# 08 – Manuelles Testen: Es gibt keine Test-Suite

Dieses Projekt hat null automatisierte Tests, keinen Linter, keinen
Build-Check. Das heißt nicht "Testen entfällt" – es heißt, dass Testen
**manuell und diszipliniert** passieren muss, jedes Mal, mechanisch nach
derselben Routine.

## Standard-Testroutine (nach jeder Änderung)

1. **Öffnen**: `index.html` lokal im Browser öffnen (Doppelklick reicht,
   die App braucht keinen Server). Falls ein Werkzeug/Skill zum Starten
   einer lokalen Vorschau existiert, das benutzen.
2. **Konsole öffnen** (DevTools) und offen lassen, während getestet wird.
   Jede rote Zeile ist ein Befund, kein "kann man ignorieren".
3. **Jeden der sieben Tabs einmal anklicken**: Essen, Kinder, Schule,
   Termine, Rezepte, Einkauf, Sport. Jeder muss ohne Konsolenfehler
   rendern.
4. **Den konkreten Interaktionspfad der Aufgabe durchspielen**, inklusive:
   - Etwas hinzufügen (Termin, eigenes Rezept, eigenes Lebensmittel,
     Einkaufshaken setzen)
   - Etwas wieder löschen/entfernen
   - Den Zustand, den du gerade verändert hast, tatsächlich anschauen
     (nicht nur "die Funktion wurde aufgerufen")
5. **Seite neu laden (F5)** und prüfen, dass alles, was gespeichert werden
   sollte, noch da ist – und alles, was gelöscht wurde, weg bleibt.
6. **Schmales (mobiles) Browserfenster testen.** Die App ist mobile-first
   gestaltet (`viewport`-Meta-Tag, `overflow-x:auto`-Leisten). Ein Layout,
   das nur auf breitem Desktop-Fenster getestet wurde, ist nicht getestet.
7. **Privates/Inkognito-Fenster für den Erststart-Fall.** Ohne
   `localStorage`-Eintrag `"fs8"` muss die App mit den eingebauten
   Default-Werten sauber starten, ohne Fehler.

## Wenn die Änderung `S`/`localStorage` betrifft

Zusätzlich, siehe `05-state-und-speicher.md`:
- In DevTools → Application/Storage → Local Storage manuell einen alten
  oder unvollständigen `"fs8"`-Wert setzen, neu laden, Konsole auf Fehler
  prüfen.

## Wenn kein Browser verfügbar ist

Wenn du in einer Umgebung ohne Browser-Zugriff arbeitest, sag das
ausdrücklich, statt Erfolg zu behaupten. "Typecheck/Syntax ist okay" ist
keine Aussage über Funktionsverhalten – Syntaxkorrektheit und
Featurekorrektheit sind zwei verschiedene Dinge.
