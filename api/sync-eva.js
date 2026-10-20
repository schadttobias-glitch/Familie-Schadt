const { importEvaIntoFirebase } = require("./_evaImport");

module.exports = async function handler(req, res) {
  try {
    const result = await importEvaIntoFirebase();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: true, count: result.count, updatedAt: result.updatedAt });
  } catch (err) {
    res.status(502).json({ ok: false, error: String((err && err.message) || err) });
  }
};
