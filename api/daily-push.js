const webpush = require("web-push");
const { fetchState, fetchImported, fetchPushSubscriptions, deletePushSubscription } = require("./_firebase");

const DAYS = ["Mo","Di","Mi","Do","Fr","Sa","So"];

function isoDate(d) { return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function mondayOf(d) { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; }
function weekKey(d) { return isoDate(mondayOf(d)); }
function recOccursOn(item, date) {
  if (item.freq === "monthly") return date.getDate() === (item.dayOfMonth || 1);
  const dayName = DAYS[(date.getDay()+6)%7];
  if (item.day !== dayName) return false;
  if (item.freq === "biweekly") {
    const anchor = item.startWeek || weekKey(date);
    const diffWeeks = Math.round((new Date(weekKey(date)) - new Date(anchor)) / (7*86400000));
    return ((diffWeeks % 2) + 2) % 2 === 0;
  }
  return true;
}

// Tobis importierter Google-Kalender enthaelt auch Arbeitstermine -- die
// sollen in der morgendlichen Zusammenfassung nach Feierabend (nach 15 Uhr)
// und samstags (kein Arbeitstag) nicht auftauchen. Manuell in der App
// eingetragene Termine sind nie "imported" und daher nie betroffen.
function isTobiArbeitsLaerm(e, dayIdx) {
  if (e.who !== "Tobi" || !e.imported) return false;
  if (dayIdx === 5) return true;
  if (e.time && e.time > "15:00") return true;
  return false;
}

function buildSummary(state, imported) {
  const now = new Date();
  const iso = isoDate(now);
  const dayIdx = (now.getDay()+6)%7;
  const dayName = DAYS[dayIdx];
  const parts = [];

  const rec = (state.rec || []).filter(r => recOccursOn(r, now));
  const aptsRecurring = (state.apts || []).filter(a => !a.date && recOccursOn(a, now));
  const aptsDated = (state.apts || []).filter(a => a.date === iso);
  const imp = (imported || []).filter(e => iso >= e.date && iso <= (e.dateEnd || e.date));
  const termine = [...rec, ...aptsRecurring, ...aptsDated, ...imp]
    .filter(e => !isTobiArbeitsLaerm(e, dayIdx))
    .sort((a,b) => (a.time||"99:99").localeCompare(b.time||"99:99"));
  if (termine.length) parts.push("Termine: " + termine.map(t => (t.time?t.time+" ":"")+t.title).join(", "));

  const sched = (state.sched || []).filter(s => s.day === dayName);
  if (sched.length) parts.push("Sport: " + sched.map(s => s.title).join(", "));

  const kids = state.kids || [];
  const stars = state.stars || {};
  if (kids.length) parts.push(kids.map(k => k.name+": "+(stars[k.id]||0)+" Sterne").join(" · "));

  return parts.length ? parts.join("\n") : "Heute steht laut Plan nichts Besonderes an.";
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    res.status(200).json({ ok: false, error: "VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY sind nicht gesetzt" });
    return;
  }
  try {
    const [state, imported, subs] = await Promise.all([fetchState(), fetchImported(), fetchPushSubscriptions()]);
    const body = buildSummary(state, imported);
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:familie-schadt@example.com", publicKey, privateKey);

    const payload = JSON.stringify({ title: "Familie Schadt - Heute", body });
    const results = [];
    for (const id of Object.keys(subs)) {
      try {
        await webpush.sendNotification(subs[id], payload);
        results.push({ id, ok: true });
      } catch (err) {
        const status = err && err.statusCode;
        results.push({ id, ok: false, error: String(status || err) });
        if (status === 404 || status === 410) await deletePushSubscription(id).catch(() => {});
      }
    }
    res.status(200).json({ ok: true, body, results });
  } catch (err) {
    res.status(502).json({ ok: false, error: String((err && err.message) || err) });
  }
};
