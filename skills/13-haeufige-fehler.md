# 13 – Häufige Fehler in diesem Projekt (konkret, nicht generisch)

Das sind keine allgemeinen Softwareentwicklungs-Weisheiten. Das sind
Fehler, die in genau dieser Datei mit hoher Wahrscheinlichkeit passieren,
weil ihre Struktur sie begünstigt.

## 1. `sv()` nach einer State-Mutation vergessen

Jede Funktion, die `S` verändert, muss `sv()` aufrufen (siehe
`05-state-und-speicher.md`). Fehlt der Aufruf, funktioniert alles bis zum
nächsten Neuladen der Seite – dann ist die Änderung weg. Das ist der Grund,
warum "Seite neu laden und prüfen" fester Bestandteil von
`06-selbstpruefung.md` ist, nicht optional.

## 2. Re-Render nach Mutation vergessen

Nach einer State-Änderung muss die passende `r<Tab>()`-Funktion erneut
aufgerufen werden, sonst zeigt die Oberfläche weiterhin den alten Stand,
obwohl `S` (und `localStorage`) bereits korrekt ist. Sieht wie ein
UI-Bug aus, ist aber ein vergessener Funktionsaufruf.

## 3. Falsches Quoting in generierten `onclick="..."`-Strings

Werte, die Apostrophe enthalten können (z. B. Freitext-Keys), werden in
einfache Anführungszeichen innerhalb eines HTML-Attributs eingebettet.
Bestehendes Beispiel, das das korrekt macht:

```js
h += '<div ... onclick="tC(\''+k.replace(/'/g,"\\'")+'\')">';
```

Wird das `.replace(/'/g, "\\'")` bei einer neuen Stelle vergessen und der
eingebettete Wert enthält ein `'`, bricht das erzeugte `onclick`-Attribut
und der Klick tut nichts (oder wirft einen Syntaxfehler) – ohne dass beim
Schreiben des Codes etwas auffällt.

## 4. Die zwei Tages-Adressierungen verwechseln

`S.day`/`S.kd`/`PLAN[i]` sind **Index-basiert** (0–6). `REC`, `SCH`,
`S.apts` sind **String-basiert** (`"Mo"`…`"So"`). Ein Vergleich wie
`REC[i].day === S.day` ist immer falsch (String vs. Zahl) und schlägt
niemals sichtbar fehl – der Filter liefert einfach eine leere Liste. Immer
über `DAYS[S.day]` in den String konvertieren, wenn mit String-basierten
Daten verglichen wird (siehe bestehendes Muster in `rTermine`/`rSport`).

## 5. Neuen Tab hinzufügen, aber nicht an allen fünf Stellen

Siehe `02-codebase-karte.md`: Tab-Button, Container-Div, Render-Funktion,
Eintrag in `rCT()`, Eintrag im `TN`-Array am Dateiende. Vier von fünf
richtig gemacht sieht lokal fast fertig aus – der Tab bleibt trotzdem leer
oder reagiert nicht auf Klicks.

## 6. Hartcodierte Jahreszahlen/Daten, die veralten

`FERIEN` enthält feste Datumswerte für 2026/2027. Nach Ablauf dieses
Zeitraums zeigt die App keine kommenden Ferien mehr an, ohne dass ein
Fehler auftritt – die Liste wird einfach leer gefiltert. Wenn eine Aufgabe
in die Nähe dieser Daten kommt, kurz prüfen, ob sie noch aktuell sind, statt
das stillschweigend zu ignorieren.

## 7. Kollidierende, zu kurze Klassennamen wiederverwenden

Die 1–3-Buchstaben-CSS-Klassen (`.st`, `.ct`, `.rc`, `.ac`, …) sind schon
mehrfach fast identisch benannt. Eine neue Klasse mit einem bereits
vergebenen Kürzel überschreibt bestehende Styles projektweit, nicht nur an
der neuen Stelle. Immer vorher suchen (siehe `03-vor-jeder-aenderung.md`).

## 8. Nährwert-/Datenobjekte mit inkonsistenten Feldnamen erweitern

Nährwert-Felder heißen konsequent `kc` (Kalorien), `p` (Protein), `vc`
(Vitamin C), `fe` (Eisen), `ca` (Calcium) – quer durch `PLAN`, `RZKAT`,
`FDB`, `KID`. Ein neues Datenobjekt mit ausgeschriebenen Feldnamen
(`calories`, `protein_g`) bricht stillschweigend jede Stelle, die die
kurzen Feldnamen erwartet (liefert `undefined`, keinen Fehler).
