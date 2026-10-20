// Holt Evas oeffentlich freigegebenen iPhone-Kalender (iCloud) und spielt die
// Termine schreibgeschuetzt in Familie Schadt ein (Feld "importedEva" im
// gemeinsamen Zustand). Laeuft nur in eine Richtung: iPhone -> App.

const ical = require("node-ical");
const { writeImportedEva } = require("./_firebase");

const SOURCE_PERSON = "Eva";
const ENV_VAR = "IMPORT_ICS_URL_EVA";
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

function mapInstance(instance, id) {
  const tz = (instance.start && instance.start.tz) || "Europe/Berlin";
  const isAllDay = Boolean(instance.isFullDay) || Boolean(instance.start && instance.start.dateOnly);
  const lp = localParts(instance.start, tz);
  return {
    id,
    title: instance.summary || "Termin",
    who: SOURCE_PERSON,
    date: lp.date,
    time: isAllDay ? undefined : lp.time,
    imported: true,
  };
}

async function importEvaIntoFirebase() {
  const url = process.env[ENV_VAR];
  if (!url) throw new Error(ENV_VAR + " ist nicht gesetzt");
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
        out.push(mapInstance(inst, `eva-${ev.uid || key}-${i}`));
      });
    } else if (ev.start && ev.start >= from && ev.start <= to) {
      out.push(mapInstance(ev, `eva-${ev.uid || key}`));
    }
  }

  out.sort((a, b) => (a.date + "T" + (a.time || "00:00")).localeCompare(b.date + "T" + (b.time || "00:00")));

  await writeImportedEva(out);
  return { count: out.length, updatedAt: Date.now() };
}

module.exports = { importEvaIntoFirebase };
