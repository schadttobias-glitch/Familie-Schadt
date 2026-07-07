# 11 – Unsicherheit & Eskalation: Wann du fragen musst, statt zu raten

Ein weniger fähiges Modell (oder ein unerfahrener Mensch) macht seinen
größten Fehler nicht durch fehlendes Wissen, sondern dadurch, dass es eine
Annahme trifft und stillschweigend danach handelt. Diese Datei listet die
Situationen, in denen **Anhalten und Fragen** die einzig richtige
mechanische Regel ist.

## Immer fragen, bevor gehandelt wird, wenn:

1. **Zwei plausible Lesarten** einer Aufgabe zu unterschiedlichem,
   sichtbarem Ergebnis führen. Nicht die "wahrscheinlichere" Lesart raten
   und umsetzen – beide kurz benennen und fragen lassen, welche gemeint
   ist.
2. Eine Änderung **bestehende `S`/`localStorage`-Keys umbenennen, entfernen
   oder ihr Format ändern würde** (siehe `05-state-und-speicher.md`) – das
   kann gespeicherte Familiendaten zerstören.
3. Eine Aufgabe **reale Familiendaten** verändert, die im Code hart
   codiert sind (Namen, Ferientermine, Nährwert-Zielwerte der Kinder,
   Stundenplan-Inhalte), ohne dass die Aufgabe explizit einen neuen,
   konkreten Wert nennt. Rate niemals einen Ersatzwert.
4. Die Aufgabe verlangt, **den API-Aufruf in `sRzKI()` "zum Laufen zu
   bringen"** (siehe `09-sicherheit.md`) – das ist eine Architektur-/
   Sicherheitsentscheidung, keine reine Code-Änderung.
5. Eine **destruktive Git-Aktion** verlangt wird (force-push, reset --hard,
   Branch löschen) – siehe `10-git-workflow.md`.
6. Der geplante Umfang deutlich größer ist als die Aufgabe zu verlangen
   scheint (siehe `01-planung.md`) und du nicht sicher bist, ob das
   gewünscht ist.
7. Du nach ehrlichem Versuch (Lesen, Grep, Testen) **immer noch nicht
   verstehst**, was ein bestehendes Stück Code tut, bevor du es änderst.
   Rate nicht an der Bedeutung vorbei – lies genauer nach oder frag.

## Wie man fragt (kurz und konkret)

- Die konkrete Fundstelle nennen (Datei, Zeile/Funktion).
- Die zwei (oder mehr) Optionen benennen, nicht nur "was soll ich tun?".
- Falls vorhanden: eine Empfehlung mit Begründung geben – aber die
  Entscheidung beim Menschen lassen, wenn sie eine Produkt- oder
  Datenentscheidung ist.

## Wann NICHT fragen (sondern einfach machen)

- Bei rein technischen Detailentscheidungen, die aus den bestehenden
  Konventionen dieser Bibliothek eindeutig folgen (Namenskonvention,
  Speicher-Pattern, Testroutine) – das sind keine offenen Fragen, das ist
  bereits dokumentierte Regel.
- Bei offensichtlichen Tippfehlern/Bugs, deren Behebung eindeutig dem
  bestehenden, erkennbaren Verhalten entspricht.

Der Unterschied: **technische Regeln stehen in dieser Bibliothek und
werden befolgt. Produkt-/Daten-/Sicherheitsentscheidungen gehören dem
Menschen.**
