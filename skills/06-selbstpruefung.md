# 06 – Selbstprüfung: Checkliste bevor du "fertig" sagst

"Ich glaube, das funktioniert" ist keine Aussage, auf die man sich
verlassen kann. Diese Checkliste ersetzt das Bauchgefühl durch
nachprüfbare Schritte. Alle Punkte müssen tatsächlich ausgeführt werden,
nicht nur gedanklich durchgegangen.

## Mechanische Checkliste

- [ ] **`git diff` gelesen**, komplett, Zeile für Zeile. Steht nur drin,
      was zur Aufgabe gehört? Keine versehentlichen Whitespace-Änderungen,
      keine liegen gelassenen `console.log`/`debugger`-Zeilen, keine
      Testdaten, die eigentlich raus sollten?
- [ ] **Datei im Browser geöffnet** (siehe `08-manuelles-testen.md`) und
      die Konsole beobachtet – keine roten Fehler beim Laden.
- [ ] **Den konkreten Pfad der Aufgabe tatsächlich durchgeklickt**, nicht
      nur "sollte gehen". Neues Feature hinzugefügt/gelöscht/verändert und
      das Ergebnis mit eigenen Augen im DOM gesehen.
- [ ] **Seite neu geladen**, um zu prüfen, dass der State persistiert (falls
      die Änderung `S` betrifft, siehe `05-state-und-speicher.md`).
- [ ] **Alle sieben Tabs einmal angeklickt**, wenn die Änderung eine
      gemeinsam genutzte Funktion (`card`, `tag`, `bar`, `getAllR`, `pN`,
      `dU`, `fmtD`, …) oder CSS-Klasse betroffen hat. Eine Änderung an einer
      Stelle kann unbemerkt weitere Tabs betreffen (siehe
      `03-vor-jeder-aenderung.md`).
- [ ] **Leerer/Erststart-Zustand geprüft**, wenn die Änderung eine Liste
      betrifft (keine eigenen Rezepte, keine Termine, keine Einkaufshaken).
      Zeigt die App eine sinnvolle Leer-Meldung (`.eb`-Klasse) statt eines
      Fehlers oder einer kaputten Darstellung?
- [ ] **Die ursprüngliche Aufgabenstellung erneut gelesen** und Punkt für
      Punkt gegen das Ergebnis gehalten. Nicht "etwas Ähnliches" geliefert,
      sondern genau das Verlangte.

## Was "fertig" NICHT bedeutet

- Der Code "sieht richtig aus".
- Es gab keine Syntaxfehler beim Schreiben.
- Eine ähnliche Stelle im Code hat schon mal so funktioniert.

Keiner dieser drei Punkte ist eine Verifikation. Verifikation heißt: du
hast das Verhalten tatsächlich beobachtet, nicht abgeleitet.

## Wenn ein Punkt der Checkliste fehlschlägt

Nicht weitermachen und hoffen, dass es "meistens" reicht. Zurück zu
`07-debugging.md`.
