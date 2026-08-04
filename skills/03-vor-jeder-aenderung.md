# 03 – Pflicht-Checkliste vor jeder Änderung

Diese Schritte sind nicht optional und nicht "wenn Zeit ist". Sie sind
billiger als der Fehler, den sie verhindern.

## Checkliste (in dieser Reihenfolge)

- [ ] **Ganze Datei gelesen**, nicht nur den vermeintlich betroffenen
      Ausschnitt. 486 Zeilen sind kein Grund, sich auf `grep`-Treffer zu
      verlassen.
- [ ] **Alle Aufrufer gesucht**, bevor eine Funktion umbenannt, ihre
      Signatur geändert oder sie entfernt wird. Suche nach dem exakten
      Funktionsnamen als Text – Funktionen werden hier auch aus
      `onclick="..."`-Attributen im generierten HTML-String heraus
      aufgerufen, nicht nur aus anderem JavaScript. Ein normaler
      "Referenzen finden" im Editor sieht diese Aufrufe nicht, weil sie in
      Strings stecken.
- [ ] **Jede CSS-Klasse, die du wiederverwendest, vorher nachgeschlagen.**
      Die Klassennamen sind 1–3 Buchstaben lang (`.st`, `.ct`, `.ac`, `.rc`
      …) und dadurch leicht mit einer bereits existierenden, anders
      gemeinten Klasse zu verwechseln.
- [ ] **Geprüft, ob `S` (der State) betroffen ist.** Wenn ja: Datei
      `05-state-und-speicher.md` gelesen, bevor weitergemacht wird.
- [ ] **Geprüft, ob mehr als ein Tab betroffen ist.** Gemeinsame
      Hilfsfunktionen (`card()`, `tag()`, `bar()`, `pct()`, `bc()`, `pD()`,
      `pN()`, `dU()`, `gNF()`, `fmtD()`, `getAllR()`) werden von mehreren
      Tabs benutzt. Eine Änderung an einer davon wirkt sich überall aus, wo
      sie aufgerufen wird.
- [ ] **Diff-Umfang im Kopf abgeschätzt.** Wenn die geplante Änderung
      deutlich größer aussieht als die Aufgabe es verlangt, zurück zu
      `01-planung.md` und den Umfang neu eingrenzen.

## Wenn eine dieser Fragen mit "ich bin nicht sicher" beantwortet wird

Nicht weitermachen und hoffen, dass es schon passt. Stattdessen: nachlesen,
zusätzliche Grep-Suche machen, oder – wenn die Unsicherheit eine fachliche
Entscheidung betrifft, keine technische – nachfragen (siehe
`11-unsicherheit-und-eskalation.md`).
