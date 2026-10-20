// Gemeinsame Logik fuer die Kalender-Abo-Feeds (.ics).
// Liest den synchronisierten App-Zustand aus Firebase und baut daraus
// eine iCalendar-Datei pro Person, damit das iPhone sie per Kalender-Abo
// automatisch einbinden kann.

const { fetchState } = require("./_firebase");

const STATIC_PEOPLE = { alia: "Alia", tiana: "Tiana", tobi: "Tobi", eva: "Eva" };
const CALENDAR_COLORS = { alia: "#1565c0", tiana: "#8e24aa", tobi: "#f9a825", eva: "#e91e63", familie: "#26a69a" };

const DAY_INDEX = { Mo: 0, Di: 1, Mi: 2, Do: 3, Fr: 4, Sa: 5, So: 6 };
const ICS_DAY = { Mo: "MO", Di: "TU", Mi: "WE", Do: "TH", Fr: "FR", Sa: "SA", So: "SU" };

const VTIMEZONE_BERLIN = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function pad2(n) { return String(n).padStart(2, "0"); }

function icsEscape(s) { return String(s).replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n"); }

function icsStampUTC(d) {
  return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + "T" +
    pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + pad2(d.getUTCSeconds()) + "Z";
}

function todayUTC() {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

function addDaysUTC(y, m, d, days) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function addMinutesUTC(y, m, d, hh, mi, addMin) {
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mi));
  dt.setUTCMinutes(dt.getUTCMinutes() + addMin);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), hh: dt.getUTCHours(), mi: dt.getUTCMinutes() };
}

function mondayOfUTC(y, m, d) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - dow);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function isoFromComp(c) { return c.y + "-" + pad2(c.m) + "-" + pad2(c.d); }

function diffWeeksBetweenMondayIso(aIso, bComp) {
  const a = new Date(aIso + "T00:00:00Z");
  const b = new Date(isoFromComp(bComp) + "T00:00:00Z");
  return Math.round((b - a) / (7 * 86400000));
}

function firstOccurrence(item) {
  const t = todayUTC();
  if (item.freq === "monthly") {
    const dom = item.dayOfMonth || 1;
    const today = new Date(Date.UTC(t.y, t.m - 1, t.d));
    let dt = new Date(Date.UTC(t.y, t.m - 1, dom));
    if (dt < today) dt = new Date(Date.UTC(t.y, t.m, dom));
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }

  const targetIdx = DAY_INDEX[item.day];
  if (targetIdx == null) return t;

  let dt = new Date(Date.UTC(t.y, t.m - 1, t.d));
  let comp = t;
  for (let i = 0; i < 14; i++) {
    const cur = (dt.getUTCDay() + 6) % 7;
    if (cur === targetIdx) { comp = { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() }; break; }
    dt.setUTCDate(dt.getUTCDate() + 1);
  }

  if (item.freq === "biweekly" && item.startWeek) {
    let guard = 0;
    while (guard < 14) {
      const mon = mondayOfUTC(comp.y, comp.m, comp.d);
      const diffWeeks = diffWeeksBetweenMondayIso(item.startWeek, mon);
      const aligned = ((diffWeeks % 2) + 2) % 2 === 0;
      if (aligned) break;
      comp = addDaysUTC(comp.y, comp.m, comp.d, 7);
      guard++;
    }
  }
  return comp;
}

function freqRule(item) {
  if (item.freq === "monthly") return "FREQ=MONTHLY;BYMONTHDAY=" + (item.dayOfMonth || 1);
  if (item.freq === "biweekly") return "FREQ=WEEKLY;INTERVAL=2;BYDAY=" + ICS_DAY[item.day];
  return "FREQ=WEEKLY;BYDAY=" + ICS_DAY[item.day];
}

function appendDtStartEnd(lines, y, m, d, time) {
  if (time) {
    const [hh, mi] = time.split(":").map(Number);
    const start = `${y}${pad2(m)}${pad2(d)}T${pad2(hh)}${pad2(mi)}00`;
    const e = addMinutesUTC(y, m, d, hh, mi, 60);
    const end = `${e.y}${pad2(e.m)}${pad2(e.d)}T${pad2(e.hh)}${pad2(e.mi)}00`;
    lines.push(`DTSTART;TZID=Europe/Berlin:${start}`);
    lines.push(`DTEND;TZID=Europe/Berlin:${end}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${y}${pad2(m)}${pad2(d)}`);
    const n = addDaysUTC(y, m, d, 1);
    lines.push(`DTEND;VALUE=DATE:${n.y}${pad2(n.m)}${pad2(n.d)}`);
  }
}

function buildEventLines(item, idx, stamp) {
  const lines = ["BEGIN:VEVENT"];
  const uid = "fs-" + (item.id != null ? item.id : idx) + "@familie-schadt.vercel.app";
  lines.push("UID:" + uid);
  lines.push("DTSTAMP:" + stamp);
  lines.push("SUMMARY:" + icsEscape(item.title || "Termin"));
  if (item.who) lines.push("DESCRIPTION:" + icsEscape(item.who));

  if (item.date) {
    const [y, m, d] = item.date.split("-").map(Number);
    appendDtStartEnd(lines, y, m, d, item.time);
  } else if (item.day) {
    const a = firstOccurrence(item);
    appendDtStartEnd(lines, a.y, a.m, a.d, item.time);
    lines.push("RRULE:" + freqRule(item));
  } else if (item.freq === "monthly") {
    const a = firstOccurrence(item);
    appendDtStartEnd(lines, a.y, a.m, a.d, item.time);
    lines.push("RRULE:" + freqRule(item));
  } else {
    const t = todayUTC();
    appendDtStartEnd(lines, t.y, t.m, t.d, item.time);
  }

  lines.push("END:VEVENT");
  return lines;
}

function resolvePersonName(state, id) {
  const all = [...(state.kids || []), ...(state.parents || [])];
  const found = all.find((p) => p.id === id);
  return (found && found.name) || STATIC_PEOPLE[id];
}

function whoMatchesPerson(who, personName) {
  return typeof who === "string" && personName && who.includes(personName);
}

function buildFeed(state, personKey) {
  const apts = Array.isArray(state.apts) ? state.apts : [];
  const rec = Array.isArray(state.rec) ? state.rec : [];
  const all = [...rec, ...apts];

  let items, calName;
  if (personKey === "familie") {
    items = all;
    calName = "Familie Schadt - Alle Termine";
  } else {
    const personName = resolvePersonName(state, personKey);
    items = all.filter((item) => whoMatchesPerson(item.who, personName));
    calName = "Familie Schadt - " + personName;
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Familie Schadt//Kalender-Export//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:" + icsEscape(calName),
    "X-WR-TIMEZONE:Europe/Berlin",
    "X-PUBLISHED-TTL:PT3H",
  ];
  if (CALENDAR_COLORS[personKey]) lines.push("X-APPLE-CALENDAR-COLOR:" + CALENDAR_COLORS[personKey]);
  lines.push(...VTIMEZONE_BERLIN);

  const stamp = icsStampUTC(new Date());
  items.forEach((item, idx) => { lines.push(...buildEventLines(item, idx, stamp)); });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

module.exports = { fetchState, buildFeed, PERSON_NAMES: STATIC_PEOPLE };
