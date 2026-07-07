# 12 – Refactoring-Sicherheit in einer Monolith-Datei

Es gibt nur eine Datei. Es gibt keinen Compiler, der dir bei einem Umbau
hilft, und keine Tests, die dir sagen, ob du etwas kaputt gemacht hast.
Jeder Umbau ist deshalb per Hand abgesichert – über strikt kleine Schritte.

## Regeln

1. **Eine Funktion pro Schritt.** Nicht mehrere Funktionen gleichzeitig
   umbauen. Nach jeder einzelnen: testen (siehe `08-manuelles-testen.md`),
   dann erst die nächste angehen.
2. **Vor jeder Signaturänderung: alle Aufrufer suchen** (siehe
   `03-vor-jeder-aenderung.md`) – inklusive der Aufrufe aus generierten
   `onclick="..."`-Strings, die eine normale Code-Suche im Editor
   übersieht.
3. **Verhaltensänderung und Refactoring nicht mischen.** Ein Commit, der
   Code umbaut, ohne das sichtbare Verhalten zu ändern, ist etwas anderes
   als ein Commit, der ein Feature ändert. Vermische das nicht in einem
   Schritt – sonst ist bei einem Fehler später unklar, welche der beiden
   Änderungen ihn verursacht hat.
4. **Keine Reformatierung unbeteiligter Zeilen.** Der Diff soll exakt
   zeigen, was sich inhaltlich geändert hat. Ein Autoformatter, der die
   ganze Datei neu einrückt, macht den Diff für die nächste Person
   unlesbar – auch wenn das Ergebnis "schöner" aussieht.
5. **Keine Modularisierung ohne expliziten Auftrag.** Diese Datei bewusst
   in mehrere Dateien aufzuteilen, eine Build-Pipeline einzuführen oder
   Funktionen in Klassen/Module zu packen, ist eine Architekturentscheidung
   für das ganze Projekt – kein Nebeneffekt einer Einzelaufgabe (siehe
   `04-code-stil.md`, `11-unsicherheit-und-eskalation.md`).
6. **Kompatible Datenstrukturen zuerst prüfen.** Wenn ein Umbau eine der
   Konstanten (`PLAN`, `RZKAT`, `SCH`, `S`, …) betrifft, siehe
   `02-codebase-karte.md` für die Adressierungs-Schemata (Index- vs.
   String-basiert) – ein Umbau, der das eine mit dem anderen verwechselt,
   bricht die App auf eine Weise, die visuell nicht sofort auffällt.

## Ein guter Refactoring-Commit sieht so aus

- Klein genug, um in einem `git diff` in unter einer Minute vollständig
  gelesen zu werden.
- Verhaltensidentisch – nach dem Umbau verhält sich die App exakt wie
  vorher (mit `08-manuelles-testen.md` geprüft).
- Beschreibt im Commit-Text, warum umgebaut wurde, nicht nur, dass
  umgebaut wurde.
