# 02 – Codebase-Karte: Was in `index.html` existiert

Diese Datei ist die einzige Quelle der Wahrheit. Lies sie ganz, bevor du
etwas änderst – sie ist kurz genug (486 Zeilen), das ist keine Ausnahme,
das ist die Regel.

## Aufbau der Datei

```
<head>          Meta-Tags, ein einziger <style>-Block (alle CSS-Regeln,
                 sehr kompakt: 1–3-Buchstaben-Klassennamen)
<body>          statisches HTML-Grundgerüst (Header, Tab-Leiste, 7 leere
                 Container-Divs, ein Rezept-Vollbild-Overlay #rz)
<script>        die gesamte Anwendungslogik, ein einziger Block
```

Es gibt keine externen Dateien, keine `<link>`- oder `<script src>`-Importe.
Alles – Daten, Logik, Darstellung – lebt in dieser einen Datei. So soll es
bleiben, wenn nicht explizit anders verlangt.

## Die 7 Tabs

`plan` (Essen) · `kinder` · `schule` · `termine` · `rezepte` · `einkauf` ·
`sport`

Jeder Tab hat:
- einen Button in der Tab-Leiste (`onclick="setTab('<name>',this)"`)
- ein Container-Div `#t-<name>`
- eine Render-Funktion `r<Name>()` (z. B. `rPlan`, `rKinder`, `rSchule`,
  `rTermine`, `rRezepte`, `rEinkauf`, `rSport`)
- einen Eintrag in `rCT()` (dem zentralen Dispatcher)
- einen Eintrag im `TN`-Array ganz unten im Script (Initial-Rendering)

**Wenn du einen achten Tab hinzufügst, musst du an allen fünf Stellen
etwas ändern.** Vergisst du eine, sieht es lokal so aus, als würde es
funktionieren, aber der Tab bleibt leer oder der Button reagiert nicht.

## Der globale State: `S`

Ein einziges mutable Objekt, das die gesamte Laufzeit-Wahrheit der App
enthält (aktueller Tag, aktiver Tab, Checkboxen, eigene Rezepte, …). Siehe
`05-state-und-speicher.md` für die Regeln dazu – hier nur die Struktur:

```js
let S = {
  day: 0,          // Index 0–6, Mo–So, siehe DAYS
  tab: "plan",     // aktiver Tab-Name
  checks: {},      // Einkaufslisten-Haken, Key: "<Kategorie>-<Artikel>"
  apts: [...],     // manuell angelegte Termine
  ke: {},          // "Kind gegessen"-Einträge, Key: "<kidId>-<dayIndex>"
  kid: "alia",     // aktuell ausgewähltes Kind im Kinder-Tab
  kd: 0,           // ausgewählter Tag im Kinder-Tab
  mr: [],          // eigene (nutzererstellte) Rezepte
  showAF/showRF/showCF: false,  // Sichtbarkeit der jeweiligen "Neu"-Formulare
  rzKat: "fruehstueck",         // aktive Rezept-Kategorie
};
```

## Datenkonstanten (read-only, am Kopf des Scripts)

| Konstante | Bedeutung |
|---|---|
| `DAYS` / `DAYSFULL` | Kurze/volle Wochentagsnamen, Index 0=Mo…6=So |
| `FERIEN` | Bayerische Schulferien mit festen Datumswerten – **wird mit der Zeit veraltet**, siehe `13-haeufige-fehler.md` |
| `SP` | Stundenplan (Zeiten × Tage × Fächer) |
| `FC` / `FCOL` | Fach → CSS-Klasse → Farbe |
| `REC` | wöchentlich wiederkehrende Termine (fix im Code) |
| `PLAN` | Essensplan, ein Eintrag pro Wochentag, **Reihenfolge muss `DAYS`-Reihenfolge entsprechen** (Index-basiert, nicht `day`-Feld-basiert) |
| `RZKAT` | Rezept-Datenbank, gruppiert nach Kategorie (`fruehstueck`, `mittagessen`, `abendessen`, `snack`), jedes Rezept hat eine `id`, auf die `PLAN[i].f.rz` etc. verweist |
| `FDB` | Lebensmittel-Datenbank für die Freitext-Suche im Kinder-Tab |
| `KID` | Kinder-Profile mit Tages-Nährwertzielen |
| `SCH` | Bewegungs-/Ruhe-Plan, **tagesstring-basiert** (`day:"Mo"`), nicht index-basiert |
| `TC` | Farb-/Label-Zuordnung für `SCH`-Einträge |
| `SHOP` | Einkaufsliste, gruppiert nach Kategorie |

## Zwei verschiedene Tages-Adressierungen – nicht verwechseln

- **Index-basiert** (`0`–`6`): `S.day`, `S.kd`, `PLAN[i]`. Muss exakt zur
  Reihenfolge von `DAYS` passen.
- **String-basiert** (`"Mo"`…`"So"`): `REC[i].day`, `SCH[i].day`,
  `S.apts[i].day`.

Beide existieren parallel. Wenn du Code schreibst, der Tage vergleicht,
prüfe genau, welches Schema die jeweilige Datenstruktur benutzt.

## Persistenz

`sv()` schreibt `S` als JSON nach `localStorage["fs8"]`.
`ld()` liest es beim Start und merged es über die Default-Werte von `S`.
Ohne `sv()` nach einer Mutation von `S` geht die Änderung beim nächsten
Neuladen verloren – das ist der häufigste Bug in diesem Projekt, siehe
`13-haeufige-fehler.md`.
