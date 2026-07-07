# 01 – Planung: Bevor die erste Zeile geändert wird

Planung ist kein Nachdenken im Kopf, das man dann vergisst. Planung ist ein
mechanischer Ablauf mit sichtbarem Ergebnis (eine Liste), bevor ein einziges
Zeichen geändert wird.

## Ablauf, Schritt für Schritt

1. **Aufgabe in eigenen Worten wiederholen.** Wenn du die Aufgabe nicht in
   einem Satz zusammenfassen kannst, hast du sie nicht verstanden. Nicht
   raten – nachfragen (siehe `11-unsicherheit-und-eskalation.md`).
2. **Fundstellen suchen, bevor du planst, was du änderst.** Nutze Grep/Suche
   über die *gesamte* `index.html` (sie hat nur 486 Zeilen – es gibt keine
   Ausrede, nicht die volle Datei zu lesen). Finde jede Funktion, jede
   CSS-Klasse, jeden State-Key, der mit der Aufgabe zu tun hat.
3. **Betroffene Stellen auflisten**, bevor du editierst:
   - Welche Funktion(en) ändern sich?
   - Welche Aufrufer dieser Funktionen gibt es? (grep nach dem Funktionsnamen)
   - Wird `S` (der globale State, siehe `05-state-und-speicher.md`) berührt?
   - Wird eine der sieben Tabs (`plan`, `kinder`, `schule`, `termine`,
     `rezepte`, `einkauf`, `sport`) beeinflusst, die du nicht ändern sollst?
4. **Umfang eng halten.** Baue nur, was gefragt wurde. Kein Drive-by-Refactor,
   keine "während ich schon dabei bin"-Aufräumarbeiten, keine neuen
   Abstraktionen für Fälle, die (noch) nicht existieren. Drei ähnliche
   Zeilen sind besser als eine verfrühte Hilfsfunktion.
5. **Risiko einschätzen, bevor du beginnst:**
   - Ändert die Aufgabe die Struktur von `S`? → hohes Risiko, siehe Datei 05.
   - Betrifft sie mehr als eine Tab-Funktion? → Zwischenstand kurz festhalten.
   - Ist unklar, ob eine Änderung bestehende gespeicherte Daten (in
     `localStorage`) zerstören könnte? → stoppen, nachfragen.
6. **Kleinster Schritt zuerst.** Wenn eine Aufgabe in unabhängige Teilschritte
   zerfällt, mache sie einzeln und prüfe nach jedem Schritt (siehe
   `06-selbstpruefung.md`), statt alles auf einmal zu ändern und am Ende zu
   hoffen, dass es passt.

## Was KEINE Planung ist

- "Ich schau mal, was passiert, wenn ich das ändere" – das ist Raten, kein
  Planen.
- Eine Änderung committen und dann erst prüfen, ob sie Sinn ergibt.
- Mehrere unabhängige Änderungen gleichzeitig anfassen, weil man "gerade da"
  ist.

## Faustregel für den Umfang einer einzelnen Aufgabe

Wenn eine Änderung mehr als 3–4 Funktionen in `index.html` gleichzeitig
anfasst, ist das ein Signal, die Aufgabe in kleinere Schritte zu zerlegen
oder – falls das nicht möglich ist – dem Team/Nutzer kurz zu sagen, welche
Teile angefasst werden, bevor du weitermachst.
