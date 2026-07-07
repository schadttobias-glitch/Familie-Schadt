# 09 – Sicherheit: Die zwei echten Risiken in diesem Projekt

Diese App hat kein Backend, keine Nutzerkonten, keine fremden Nutzer, die
mit den Daten einer anderen Familie interagieren könnten. Das
Bedrohungsmodell ist entsprechend klein – aber nicht null. Zwei konkrete
Punkte, kein allgemeines OWASP-Namedropping.

## 1. Unescapte Nutzereingaben landen direkt in `innerHTML`

Freitext, den Nutzer eingeben – Termin-Titel (`sApt`), eigene
Rezeptnamen/-schritte (`sRzKI`), eigene Lebensmittel (`aCF`) – wird
ungeprüft per String-Konkatenation in `innerHTML` eingefügt (siehe
`04-code-stil.md` zum HTML-Erzeugungsmuster). Enthält ein Nutzer z. B.
`<img src=x onerror=...>` als Termin-Titel, wird das als HTML
interpretiert, nicht als Text.

**Bedrohungslage:** einzelner Nutzer, eigener Browser, eigene Daten – im
Wesentlichen "Self-XSS", kein Angriff auf Dritte. Trotzdem:

- **Nicht verschlimmern.** Wenn du ein neues Freitextfeld hinzufügst, das
  später angezeigt wird, füge keine weitere ungeprüfte `innerHTML`-Stelle
  hinzu, ohne dir das bestehende Muster genau anzusehen.
- Wenn explizit verlangt wird, dieses Verhalten zu härten: Text über
  `textContent` statt `innerHTML` setzen, oder eine simple
  Escape-Funktion (`&`, `<`, `>`, `"`, `'`) vor der Konkatenation anwenden.
  Das ist eine bewusste, angekündigte Änderung – kein stiller Nebeneffekt
  einer anderen Aufgabe.
- Fasse dieses bestehende Muster nicht "nebenbei" an, wenn es nicht Teil
  der Aufgabe ist (siehe `01-planung.md`, Umfang eng halten).

## 2. Der KI-Aufruf in `sRzKI()` ist toter Code, kein funktionierendes Feature

`sRzKI()` (Rezepte-Tab, "Neues Rezept – KI schätzt Nährwerte") ruft direkt
aus dem Browser `https://api.anthropic.com/v1/messages` auf – **ohne
`x-api-key`-Header**. Der Aufruf schlägt bei jedem echten Nutzer immer
fehl (401/CORS) und fällt in den `catch`-Block zurück, der Nährwerte grob
schätzt. Das ist aktuell der tatsächliche, beabsichtigte Effekt für
Endnutzer – kein Bug, der "repariert" werden muss, außer es wird explizit
danach gefragt.

**Wenn danach gefragt wird, diesen Aufruf "zum Laufen zu bringen":**

- **Niemals** einen echten API-Key als String in `index.html` einbauen.
  Diese Datei ist eine statische, öffentlich ausgelieferte Datei – jeder
  Key darin ist sofort öffentlich, für immer (auch nach späterem Entfernen,
  wegen Git-Historie).
- Ein clientseitiger LLM-Aufruf mit echtem Key ist in einer Datei ohne
  Backend architektonisch nicht sicher lösbar. Das ist keine
  Implementierungsdetail-Frage, sondern eine Produktentscheidung (braucht
  einen Proxy/Backend, das den Key hält). Wenn diese Aufgabe kommt: stoppen
  und mit dem Nutzer klären, nicht eigenmächtig einen Key einbauen (siehe
  `11-unsicherheit-und-eskalation.md`).

## Allgemein

- Keine Secrets, Tokens oder Zugangsdaten in Commits, auch nicht
  "temporär zum Testen".
- Vor jedem Commit `git diff`/`git status` auf versehentlich gestagte
  Dateien mit Zugangsdaten prüfen (siehe `10-git-workflow.md`).
