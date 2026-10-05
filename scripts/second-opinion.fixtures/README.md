# Made-up bad entries

These are deliberately wrong. Each one breaks exactly one of the rules the
second opinion checks, so we can tell whether it notices. They live here, not
in `data/`, so the real validator and the real dictionary never see them.

Run: `npm run second-opinion -- --scores scripts/second-opinion.fixtures/*.yml`

| File | What's wrong with it |
|---|---|
| `bad-example-frappe.yml` | The example never uses the word |
| `bad-example-bubbler.yml` | The example uses the word in the wrong sense |
| `bad-invented-snorkwobble.yml` | Invented word |
| `bad-invented-krellstone.yml` | An inside joke from someone's group chat |
| `bad-dupe-wikkid.yml` | A respelling of `wicked` |
| `bad-dupe-packy.yml` | A respelling of `packie` |
| `bad-tone-townies.yml` | Punches down at a group of people |
| `bad-phrase-mismatch.yml` | The local line says something else entirely |
