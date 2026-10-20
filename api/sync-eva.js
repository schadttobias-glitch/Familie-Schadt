const { importAllCalendars } = require("./_calImport");

module.exports = async function handler(req, res) {
  try {
    const results = await importAllCalendars();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: true, results });
  } catch (err) {
    res.status(502).json({ ok: false, error: String((err && err.message) || err) });
  }
};
