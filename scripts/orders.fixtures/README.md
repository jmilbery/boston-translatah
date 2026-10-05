# Broken orders, on purpose

These files are wrong on purpose. `scripts/check-order-messages.mjs` copies the
validator into a throwaway folder with these as its only orders, runs it, and
checks that each mistake gets the plain-English message it should. `npm test`
runs it after the real check.

`validate.mjs` only ever walks `data/`, so nothing in here is treated as a real
entry.

- `regions.yml` is a stand-in registry. It adds `plain-000`, a region with no
  accent file, because every real region has one and the `spoken:` check needs
  a region without.
- `orders/boston/good-order.yml` is the one correct file. It must pass.
- Every other file breaks exactly one rule. Its name says which.
