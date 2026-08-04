# 04 – Code-Stil: Wie neuer Code aussehen muss

Der bestehende Code ist absichtlich kompakt geschrieben (kurze
Funktionsnamen, String-Konkatenation statt Template-Engine, ein-Buchstaben-
CSS-Klassen). Das ist nicht "schlechter Stil" – es ist der Stil dieses
Projekts, konsequent über die ganze Datei durchgehalten. Neuer Code muss
sich einfügen, nicht "verbessern".

## Namenskonventionen für Funktionen

Bestehende Präfixe – halte dich exakt daran, wenn du neue Funktionen
hinzufügst:

| Präfix | Bedeutung | Beispiele |
|---|---|---|
| `r` | rendert einen Tab/Bereich ins DOM | `rPlan`, `rKinder`, `rSchule`, `rCT` |
| `s` | setzt einen State-Wert und stößt Re-Render an | `setDay`, `setTab`, `sKi`, `sKd`, `sApt`, `sv` (Ausnahme: speichert in localStorage) |
| `a` | fügt einen Eintrag hinzu | `aFE`, `aCF` |
| `d` | löscht einen Eintrag | `dKE`, `dApt`, `dRz` |
| `t` | toggelt einen Sichtbarkeits-/Bool-State | `tAF`, `tRF`, `tCF`, `tC`, `tS` |
| `g`/`p` | reine Hilfs-/Berechnungsfunktionen ohne Seiteneffekt | `getAllR`, `gNF`, `pct`, `pD`, `pN` |

Neue Funktionen bekommen den passenden Präfix, keinen ausgeschriebenen
Namen wie `renderShoppingList` oder `handleAddAppointment`. Das wäre
inkonsistent mit jeder bisherigen Zeile der Datei.

## HTML-Erzeugung

HTML wird als String gebaut und per `innerHTML` gesetzt (`h += '...'`,
dann `document.getElementById(...).innerHTML = h`). Es gibt kein
Template-System, kein JSX, kein `document.createElement`-Muster. Neue
UI-Fragmente folgen exakt diesem Muster – kein neuer Rendering-Ansatz für
einen einzelnen Screen.

## CSS

- Ein einziger `<style>`-Block, keine neue `<style>`-Sektion.
- Klassennamen kurz halten, konsistent mit dem bestehenden Kürzel-Schema.
- Bevor du eine neue Klasse anlegst: nachsehen, ob eine bestehende bereits
  passt (siehe `03-vor-jeder-aenderung.md`).
- Inline-`style="..."`-Attribute werden im Code bereits häufig für
  einmalige Anpassungen benutzt (z. B. Farbwerte aus Datenobjekten) – das
  ist hier normal, keine Code-Smell in diesem Kontext.

## Formatierung

- Semikolons werden konsequent gesetzt – weiter so.
- Keine automatische Neuformatierung ganzer Blöcke. Kein Prettier, kein
  Editor-"Format on Save" auf diese Datei anwenden – das erzeugt riesige,
  unlesbare Diffs für eine eigentlich kleine inhaltliche Änderung (siehe
  `12-refactoring-sicherheit.md`).
- Zeilenlänge: bestehende Zeilen sind teils sehr lang (eine Render-Funktion
  = eine Zeile). Das ist beabsichtigt kompakt. Neue Zeilen im selben Stil
  sind kein Problem, solange sie korrekt und nachvollziehbar bleiben.

## Was NICHT eingeführt wird, ohne dass explizit danach gefragt wurde

- Kein Framework (React, Vue, …)
- Kein Build-Schritt (Bundler, Transpiler, npm-Abhängigkeiten)
- Keine zweite Datei, kein Aufsplitten in Module
- Kein Test-Framework "damit es endlich Tests gibt" – wenn Tests gewünscht
  sind, ist das eine explizite Produktentscheidung, keine stille
  Nebenbei-Verbesserung.
