# 07 – Debugging-Methodik

Debugging ist kein Rumprobieren, bis es zufällig geht. Es ist ein fester
Ablauf. Springe nicht zu Schritt 4, wenn du Schritt 1 übersprungen hast.

## Der Ablauf

1. **Reproduzieren, bevor du irgendetwas änderst.** Finde die exakten
   Schritte, die den Fehler auslösen (welcher Tab, welche Eingabe, welche
   Reihenfolge von Klicks). Ohne zuverlässige Reproduktion weißt du am
   Ende nicht, ob du etwas repariert oder nur zufällig etwas anderes
   verändert hast.
2. **Die vollständige Fehlermeldung lesen**, nicht nur die erste Zeile.
   Browser-Konsole öffnen (siehe `08-manuelles-testen.md`), den Stack
   Trace bis zur letzten Zeile lesen, die in `index.html` liegt (nicht in
   Browser-internem Code).
3. **Eine einzige Hypothese aufstellen**, was die Ursache ist – konkret
   benennen ("Funktion X liest `S.foo`, aber `aFE()` setzt `S.bar`"), nicht
   vage ("irgendwas mit dem State").
4. **Die Hypothese gezielt prüfen**, bevor du den Code änderst:
   `console.log(...)` an der vermuteten Stelle, oder im DevTools den Wert
   von `S` direkt in der Konsole inspizieren (die App exponiert `S` als
   normale `let`-Variable im globalen Script-Scope, also `S` einfach in
   der Konsole eintippen).
5. **Genau einen Fix machen**, der zur bestätigten Hypothese passt. Nicht
   mehrere mögliche Fixes gleichzeitig einbauen "just in case" – dann
   weißt du hinterher nicht, welcher gewirkt hat, und hast unnötigen Code
   hinzugefügt.
6. **Den ursprünglichen Reproduktionsschritt erneut ausführen** und
   bestätigen, dass genau das ursprüngliche Symptom weg ist – nicht nur,
   dass die Konsole keinen Fehler mehr zeigt. Ein verschwundener
   Konsolenfehler ist nicht dasselbe wie ein repariertes Verhalten.
7. **Regressionscheck**: die Nachbarfunktionen/-Tabs, die dieselbe
   Hilfsfunktion oder denselben State-Key benutzen, noch einmal kurz
   anschauen (siehe `06-selbstpruefung.md`).

## Wenn du nach Schritt 3 keine Hypothese hast

Dann brauchst du mehr Information, keinen Fix-Versuch. Grep nach allen
Stellen, die die betroffene Variable/Funktion lesen oder schreiben (siehe
`03-vor-jeder-aenderung.md`), lies den Code drumherum genauer, oder
formuliere die Beobachtung präzise und frage nach, wenn du nicht
weiterkommst.

## Ausdrücklich verbotene Debug-Taktiken

- Zufällig Code ändern und schauen, ob der Fehler verschwindet, ohne zu
  verstehen, warum.
- Einen Fehler mit `try/catch` stillschweigend verschlucken, damit die
  Konsole "sauber" aussieht, ohne die Ursache zu kennen.
- Mehrere Änderungen gleichzeitig committen, wenn du nicht weißt, welche
  davon das eigentliche Problem behebt.
- Bei einem harten Fehler den State einfach zurücksetzen
  (`localStorage.clear()`), um das Problem "verschwinden" zu lassen – das
  ist Datenverlust für die Familie, kein Fix (siehe
  `05-state-und-speicher.md`).

## Regressionen: mit git bisektieren

Wenn ein Fehler neu aufgetreten ist und du nicht weißt, welche Änderung
ihn verursacht hat: `git log` auf die relevante Historie ansehen, den
letzten bekannt guten Commit auschecken (in einem separaten Worktree/
Branch, nicht mit `git reset --hard` auf dem Arbeitsbranch), und
systematisch eingrenzen, statt zu raten.
