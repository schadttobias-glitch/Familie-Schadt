// Gemeinsamer Firebase-Zugriff (anonyme Anmeldung + REST) fuer alle API-Funktionen.

const FIREBASE_API_KEY = "AIzaSyCpgf8FDf2LGsOtY6aaZOX3j2X8Ck2FnbM";
const DB_URL = "https://familie-schadt-default-rtdb.europe-west1.firebasedatabase.app";
const SYNC_ROOT = "sync/3cvwq26saehh370vawcftmi2";
const SYNC_PATH = SYNC_ROOT + "/state";
const IMPORTED_PATH = SYNC_ROOT + "/imported";

let cachedToken = null;
let cachedTokenExp = 0;

async function getIdToken() {
  if (cachedToken && Date.now() < cachedTokenExp) return cachedToken;
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  if (!res.ok) throw new Error("Firebase-Anmeldung fehlgeschlagen: " + res.status);
  const data = await res.json();
  if (!data.idToken) throw new Error("Firebase-Anmeldung ohne Token");
  cachedToken = data.idToken;
  cachedTokenExp = Date.now() + (Number(data.expiresIn || 3600) - 120) * 1000;
  return cachedToken;
}

// Die App speichert ihren Zustand als { updatedAt, data: {...} } unter
// SYNC_PATH (siehe pushCloudSync() in index.html) -- wir lesen hier die
// eigentlichen Felder aus "data".
async function fetchState() {
  const token = await getIdToken();
  const res = await fetch(`${DB_URL}/${SYNC_PATH}.json?auth=${token}`);
  if (!res.ok) throw new Error("Datenbank-Lesefehler: " + res.status);
  const raw = await res.json();
  return (raw && raw.data) || {};
}

// Importierte Termine leben in einem EIGENEN Pfad, getrennt von SYNC_PATH.
// Grund: der Client ueberschreibt SYNC_PATH bei jeder lokalen Aenderung komplett
// (volles .set()). Laegen die Importe dort, koennte ein Geraet mit veraltetem
// lokalem Stand einen frischen Server-Import versehentlich wieder loeschen.
// Der eigene Pfad wird vom Client nur gelesen, nie beschrieben. Pro Person ein
// eigener Unterschluessel (PATCH = nur diese Person wird ersetzt, die anderen
// bleiben unberuehrt).
async function writeImportedPerson(personId, items) {
  const token = await getIdToken();
  const res = await fetch(`${DB_URL}/${IMPORTED_PATH}.json?auth=${token}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [personId]: { items, updatedAt: Date.now() } }),
  });
  if (!res.ok) throw new Error("Datenbank-Schreibfehler: " + res.status);
  return res.json();
}

module.exports = { DB_URL, SYNC_PATH, IMPORTED_PATH, getIdToken, fetchState, writeImportedPerson };
