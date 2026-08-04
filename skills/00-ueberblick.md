# 00 – Überblick: Wie diese Skill-Bibliothek benutzt wird

Ich gehe morgen in Rente. Das hier ist keine Doku über *was* der Code tut –
das steht im Code selbst. Das hier ist *wie ich gearbeitet habe*, damit
jemand mit weniger Erfahrung (auch ein weniger fähiges Modell) die gleichen
Ergebnisse bekommt, ohne meine Intuition zu haben. Intuition ersetze ich
hier durch **mechanische Regeln**. Regel schlägt Bauchgefühl.

## Lesereihenfolge

1. `01-planung.md` – bevor du irgendetwas anfasst
2. `02-codebase-karte.md` – was in dieser App überhaupt existiert
3. `03-vor-jeder-aenderung.md` – die Pflicht-Checkliste vor jedem Edit
4. `04-code-stil.md` – wie neuer Code aussehen muss, damit er passt
5. `05-state-und-speicher.md` – die gefährlichste Datei-interne Regel überhaupt
6. `06-selbstpruefung.md` – Checkliste bevor du "fertig" sagst
7. `07-debugging.md` – Methodik, wenn etwas nicht funktioniert
8. `08-manuelles-testen.md` – wie man ohne Test-Suite trotzdem testet
9. `09-sicherheit.md` – die zwei echten Risiken in diesem Projekt
10. `10-git-workflow.md` – Commit- und Branch-Disziplin
11. `11-unsicherheit-und-eskalation.md` – wann du fragen statt raten musst
12. `12-refactoring-sicherheit.md` – wie man in einer Monolith-Datei sicher umbaut
13. `13-haeufige-fehler.md` – die Fehler, die hier garantiert passieren werden
14. `14-definition-of-done.md` – das letzte Tor vor "erledigt"

## Die eine Regel, die alle anderen zusammenfasst

> **Lieber eine Frage zu viel stellen als eine falsche Annahme stillschweigend
> umsetzen.** Ein Fix, der nicht verifiziert wurde, ist keine Lösung, sondern
> eine Behauptung.

## Kontext, den du kennen musst

Dieses Repo ist **eine einzige Datei**: `index.html`. Kein Build-Schritt,
kein `package.json`, kein Test-Runner, kein Linter, kein Framework. Das ist
**Absicht**, kein technisches Schulden-Problem – die App muss ohne Server,
ohne `npm install`, per Doppelklick oder als statische Seite funktionieren.
Jede Regel in dieser Bibliothek respektiert das. Schlage niemals vor, einen
Build-Prozess, ein Framework oder mehrere Dateien einzuführen, nur weil es
"sauberer" wäre – das wurde bewusst nicht so gebaut.
