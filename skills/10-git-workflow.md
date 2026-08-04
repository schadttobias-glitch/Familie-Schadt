# 10 – Git-Workflow

Mechanische Regeln, keine Interpretationsspielräume.

## Vor jedem Commit

- [ ] `git status` gelesen – nichts Unerwartetes dabei (keine fremden,
      unbekannten Dateien versehentlich mitgenommen).
- [ ] `git diff` (bzw. `git diff --staged`) komplett gelesen, Zeile für
      Zeile.
- [ ] Nur die Dateien gestaged, die tatsächlich zur Aufgabe gehören.
      Niemals `git add -A` oder `git add .` blind verwenden – gezielt nach
      Dateiname stagen.
- [ ] Keine Debug-Ausgaben, keine Testdaten, keine auskommentierten
      Codeblöcke im Diff, die nicht Teil der eigentlichen Änderung sind.

## Commits

- Ein Commit = eine logisch zusammenhängende Änderung. Nicht mehrere
  unabhängige Aufgaben in einem Commit bündeln.
- Commit-Nachricht beschreibt das **Warum**, nicht nur das Was (das Diff
  zeigt bereits, was sich geändert hat).
- Neue Commits erstellen, niemals `git commit --amend` auf bereits
  gepushte/bestehende Commits, außer es wird explizit verlangt.
- Kein `--no-verify`, kein Überspringen von Hooks, auch nicht, wenn ein
  Hook lästig erscheint – wenn ein Hook fehlschlägt, die Ursache beheben.

## Branches

- Auf dem vorgesehenen Feature-Branch entwickeln, nicht direkt auf dem
  Default-Branch.
- Niemals force-push auf einen geteilten/Default-Branch.
- Kein `git reset --hard`, `git checkout -- .`, `git clean -f` ohne vorher
  `git status` geprüft zu haben und sicher zu sein, dass dabei keine
  fremde in-Arbeit befindliche Änderung verloren geht.

## Push

- `git push -u origin <branch-name>` verwenden.
- Bei Netzwerkfehlern mit exponentiellem Backoff erneut versuchen (2s, 4s,
  8s, 16s) – nicht bei anderen Fehlerarten (z. B. Rechte-/Konflikt-Fehler)
  einfach stur wiederholen, sondern die Ursache klären.

## Destruktive Aktionen generell

Löschen von Branches, Force-Push, Zurücksetzen von Historie: nur nach
expliziter Zustimmung des Nutzers für genau diese Aktion in diesem Moment
– eine frühere Zustimmung zu einer ähnlichen Aktion gilt nicht automatisch
wieder.
