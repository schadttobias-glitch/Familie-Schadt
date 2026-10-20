// Gemeinsamer Firebase-Zugriff (anonyme Anmeldung + REST) fuer alle API-Funktionen.

const FIREBASE_API_KEY = "AIzaSyCpgf8FDf2LGsOtY6aaZOX3j2X8Ck2FnbM";
const DB_URL = "https://familie-schadt-default-rtdb.europe-west1.firebasedatabase.app";
const SYNC_PATH = "sync/3cvwq26saehh370vawcftmi2/state";

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

async function fetchState() {
  const token = await getIdToken();
  const res = await fetch(`${DB_URL}/${SYNC_PATH}.json?auth=${token}`);
  if (!res.ok) throw new Error("Datenbank-Lesefehler: " + res.status);
  const data = await res.json();
  return data || {};
}

// Flacher Merge auf Feld-Ebene von SYNC_PATH (ueberschreibt nur die angegebenen
// Top-Level-Felder, laesst alles andere unberuehrt -- sicher fuer gleichzeitige
// Aenderungen durch Geraete der Familie).
async function patchState(partial) {
  const token = await getIdToken();
  const res = await fetch(`${DB_URL}/${SYNC_PATH}.json?auth=${token}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error("Datenbank-Schreibfehler: " + res.status);
  return res.json();
}

module.exports = { DB_URL, SYNC_PATH, getIdToken, fetchState, patchState };
