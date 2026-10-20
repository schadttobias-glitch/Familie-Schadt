// Holt oeffentlich freigegebene iPhone-Kalender (iCloud) einzelner
// Familienmitglieder und spielt die Termine schreibgeschuetzt in Familie
// Schadt ein (Pfad "imported" im Firebase-Zustand). Laeuft nur in eine
// Richtung: iPhone -> App.

const ical = require("node-ical");
const { writeImportedPerson } = require("./_firebase");

const SOURCES = {
  eva: { name: "Eva", envVar: "IMPORT_ICS_URL_EVA" },
  alia: { name: "Alia", envVar: "IMPORT_ICS_URL_ALIA" },
  tiana: { name: "Tiana", envVar: "IMPORT_ICS_URL_TIANA" },
};
const WINDOW_DAYS = 180;

function toHttps(url) {
  if (url.startsWith("webcal://")) return "https://" + url.slice("webcal://".length);
  return url;
}

function localParts(date, tz) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz || "UTC",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

function mapInstance(instance, id, personName) {
  const tz = (instance.start && instance.start.tz) || "Europe/Berlin";
  const isAllDay = Boolean(instance.isFullDay) || Boolean(instance.start && instance.start.dateOnly);
  const lp = localParts(instance.start, tz);

  let dateEnd;
  if (instance.end) {
    // Ganztaegige Termine: DTEND ist exklusiv (der Tag NACH dem letzten Tag) -- einen Tag abziehen.
    const endForCalc = isAllDay ? new Date(instance.end.getTime() - 86400000) : instance.end;
    const endTz = (instance.end && instance.end.tz) || tz;
    const lpEnd = localParts(endForCalc, endTz);
    if (lpEnd.date > lp.date) dateEnd = lpEnd.date;
  }

  return {
    id,
    title: instance.summary || "Termin",
    who: personName,
    date: lp.date,
    ...(dateEnd ? { dateEnd } : {}),
    time: isAllDay ? undefined : lp.time,
    imported: true,
  };
}

async function importPersonCalendar(personId) {
  const src = SOURCES[personId];
  if (!src) throw new Error("Unbekannte Person: " + personId);
  const url = process.env[src.envVar];
  if (!url) throw new Error(src.envVar + " ist nicht gesetzt");
  const httpsUrl = toHttps(url);

  const data = await ical.async.fromURL(httpsUrl);

  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const to = new Date(from.getTime() + WINDOW_DAYS * 86400000);

  const out = [];
  for (const key of Object.keys(data)) {
    const ev = data[key];
    if (!ev || ev.type !== "VEVENT") continue;
    if (ev.status === "CANCELLED") continue;

    if (ev.rrule) {
      const instances = ical.expandRecurringEvent(ev, { from, to });
      instances.forEach((inst, i) => {
        out.push(mapInstance(inst, `${personId}-${ev.uid || key}-${i}`, src.name));
      });
    } else if (ev.start && ev.start >= from && ev.start <= to) {
      out.push(mapInstance(ev, `${personId}-${ev.uid || key}`, src.name));
    }
  }

  out.sort((a, b) => (a.date + "T" + (a.time || "00:00")).localeCompare(b.date + "T" + (b.time || "00:00")));

  await writeImportedPerson(personId, out);
  return { person: personId, count: out.length };
}

async function importAllCalendars() {
  const results = [];
  for (const personId of Object.keys(SOURCES)) {
    if (!process.env[SOURCES[personId].envVar]) continue;
    try {
      results.push(await importPersonCalendar(personId));
    } catch (err) {
      results.push({ person: personId, error: String((err && err.message) || err) });
    }
  }
  return results;
}

module.exports = { importPersonCalendar, importAllCalendars, SOURCES };
