const { savePushSubscription, deletePushSubscription } = require("./_firebase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "DELETE") {
    try {
      const { id } = req.body || {};
      if (!id) { res.status(400).json({ ok: false, error: "id fehlt" }); return; }
      await deletePushSubscription(id);
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(502).json({ ok: false, error: String((err && err.message) || err) });
    }
    return;
  }
  if (req.method !== "POST") { res.status(405).json({ ok: false, error: "Method not allowed" }); return; }
  try {
    const { id, subscription } = req.body || {};
    if (!id || !subscription || !subscription.endpoint) {
      res.status(400).json({ ok: false, error: "Ungueltige Anfrage" });
      return;
    }
    await savePushSubscription(id, subscription);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: String((err && err.message) || err) });
  }
};
