# 14 – Definition of Done: Das letzte Tor

Eine Aufgabe ist erst dann "fertig", wenn **jeder** Punkt hier mit Ja
beantwortet werden kann – nicht "vermutlich ja".

## Checkliste

- [ ] Die Aufgabe wurde exakt umgesetzt, nicht "etwas Ähnliches" oder
      "etwas Besseres, das ich für sinnvoller hielt" (siehe
      `01-planung.md`).
- [ ] `03-vor-jeder-aenderung.md` wurde vor dem Editieren durchlaufen.
- [ ] Falls `S`/`localStorage` betroffen: `05-state-und-speicher.md`
      vollständig befolgt, inklusive Persistenz-Test nach Neuladen.
- [ ] `06-selbstpruefung.md` vollständig durchgegangen, nicht nur die
      offensichtlichen Punkte.
- [ ] Der konkrete Interaktionspfad wurde im Browser tatsächlich
      durchgeklickt (siehe `08-manuelles-testen.md`) – nicht nur der Code
      gelesen und für plausibel befunden.
- [ ] `git diff` enthält ausschließlich Änderungen, die zur Aufgabe
      gehören – kein Drive-by-Cleanup, keine liegen gelassenen
      Debug-Zeilen.
- [ ] Keine der Situationen aus `11-unsicherheit-und-eskalation.md` liegt
      unbeantwortet/unadressiert vor.
- [ ] Falls etwas nicht getestet werden konnte (z. B. kein Browser
      verfügbar): das wurde **explizit gesagt**, nicht verschwiegen oder
      als "sollte funktionieren" kaschiert.

## Der Satz, den man sich vor dem Abschluss selbst stellen sollte

> "Habe ich das Verhalten beobachtet, oder nur aus dem Code abgeleitet,
> dass es funktionieren müsste?"

Nur die erste Antwort zählt als "fertig". Die zweite ist eine Vermutung
und gehört als solche benannt, nicht als Ergebnis verkauft.
