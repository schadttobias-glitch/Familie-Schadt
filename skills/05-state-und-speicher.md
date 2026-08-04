# 05 – State & Speicher: Die gefährlichste Regel im ganzen Projekt

Familien benutzen diese App über Wochen. Ihre Daten (eigene Rezepte,
eingetragene Termine, Einkaufslisten-Haken, Kinder-Ernährungseinträge)
liegen **ausschließlich** im `localStorage` ihres Browsers unter dem
Schlüssel `"fs8"`. Es gibt kein Backend, kein Backup, keine
Migrations-Tools. Wenn ein Schema-Fehler die gespeicherten Daten
unlesbar macht, sind sie für die Familie **unwiederbringlich weg**.

Deshalb gilt hier eine striktere Regel als überall sonst im Projekt.

## Die Mechanik, die du verstehen musst

```js
let S = { day:0, tab:"plan", checks:{}, apts:[...], ke:{}, ... };  // Defaults
const sv = () => localStorage.setItem("fs8", JSON.stringify(S));   // Speichern
const ld = () => { S = {...S, ...JSON.parse(localStorage.getItem("fs8"))}; }; // Laden
```

`ld()` merged gespeicherte Daten *über* die Defaults. Das heißt:

- Ein **neuer Key**, den du zum `S`-Literal hinzufügst, bleibt für
  bestehende Nutzer beim Default, bis sie ihn selbst setzen – das ist
  sicher und funktioniert automatisch. Du musst nichts weiter tun, außer
  den neuen Key mit einem sinnvollen Default in die `S`-Literal-Definition
  zu schreiben.
- Ein **umbenannter oder entfernter Key** wird bei bestehenden Nutzern
  NICHT migriert. Ihr gespeichertes JSON enthält weiter den alten Namen,
  dein neuer Code kennt ihn aber nicht mehr → die Funktionalität, die
  darauf aufbaut, verhält sich für diese Nutzer wie beim allerersten
  Start (Datenverlust aus Nutzersicht).

## Regeln

1. **Niemals** einen bestehenden Key in `S` umbenennen oder entfernen, ohne
   dass es explizit verlangt und mit dem Nutzer abgestimmt wurde.
2. **Neue Keys immer** mit einem funktionierenden Default-Wert im
   `S`-Literal ergänzen – nicht nur dort verwenden, wo sie gebraucht
   werden, sonst ist der Wert bei Erstnutzern `undefined`.
3. **Nach jeder Mutation von `S` muss `sv()` aufgerufen werden.** Sieh dir
   jede bestehende Mutator-Funktion an (`sApt`, `dApt`, `aFE`, `tC`, …) –
   jede endet mit `sv()` gefolgt vom passenden Re-Render-Aufruf. Neuer Code
   folgt exakt diesem Muster.
4. Wenn eine Aufgabe wirklich eine **strukturelle Änderung** an
   bestehenden Datentypen verlangt (z. B. aus einem String ein Objekt
   machen), ist das ein Migrations-Fall. Schreibe eine Migration, die alte
   Formate erkennt und in das neue überführt (z. B. in `ld()`, vor der
   ersten Nutzung), **teste sie**, indem du testweise einen alten
   Datensatz im DevTools-`localStorage` simulierst und neu lädst. Führe
   diese Änderung niemals stillschweigend durch – kündige sie an.
5. `localStorage.clear()` oder das Überschreiben des ganzen `"fs8"`-Werts
   ist eine destruktive Aktion. Niemals zu Debug-Zwecken einbauen und
   liegen lassen.

## Vor jedem Commit, der `S` verändert

- [ ] Neuer Key hat einen Default im `S`-Literal?
- [ ] Jede neue Mutation endet mit `sv()`?
- [ ] Getestet: Seite neu laden → Daten noch da?
- [ ] Getestet (falls strukturelle Änderung): alten `"fs8"`-Wert manuell in
      DevTools gesetzt, neu geladen, keine Fehler in der Konsole?
