const { fetchState, buildFeed, PERSON_NAMES } = require("../_ics");

module.exports = async function handler(req, res) {
  const person = String((req.query && req.query.person) || "").toLowerCase();
  const valid = person === "familie" || Boolean(PERSON_NAMES[person]);
  if (!valid) {
    res.status(404).send("Unbekannter Kalender: " + person);
    return;
  }
  try {
    const state = await fetchState();
    const ics = buildFeed(state, person);
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="familie-schadt-${person}.ics"`);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(ics);
  } catch (err) {
    res.status(502).send("Kalender konnte gerade nicht geladen werden. Bitte spaeter erneut versuchen.");
  }
};
