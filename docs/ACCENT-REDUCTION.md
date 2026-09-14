# The Accent Addition Clinic

### Boston to the 314 — a course of treatment

> **Referral required.** See `data/curriculum/boston-to-stl-314.yml` for the
> machine-readable chart. This page is the bedside manner.

---

## Indications

The patient presents with a fully non-rhotic Boston idiolect and a stated
intention to be understood in St. Louis. Six sessions. No surgery.

We take the ambitious cases. The patient who merely wishes to be *understood*
in St. Louis needs nothing from us — St. Louis understands Boston fine, the way
it understands weather. This clinic is for the patient who wishes to be
*unremarkable* there, which is harder, and is the only thing anyone in the 314
has ever wanted from anybody.

## Presenting features

Screen for all six. Each maps to a rule id in `data/pronunciation/rules.yml`,
so the chart and the engine cannot drift apart without CI noticing.

| Feature | Rule | Presentation |
|---|---|---|
| R-drop | `drop-final-r` | *cah*, *pahk*, *Hahvad* |
| R-insertion between vowels | `intrusive-r` | *idear of*, *Linder is* |
| -er collapse | `er-to-ah` | *dinnah*, *stickah* |
| Broad A | `broad-a` | *fahthah*, *cahn't* |
| O-fronting | `o-to-aw` | *cawfee*, *Bawston* |
| Fast-speech merger | `fast-speech` | *Jeet?*, *Whyja* |

The last is not treated. Every city on earth does it, St. Louis included, and
a patient who arrives saying *Jeet?* will leave saying *Jeet?* This is fine.

## Intake

One question. It is not small talk.

> **"Where'd you go to high school?"**

The patient will attempt to answer with a *city*. Note this in the chart. The
question is not asking for a city. See `data/phrases/stl-314/` for the entry
and its sourcing; outsiders hear conversation, locals are reading a map, and
the gap between those two things is the entire syllabus compressed into six
words.

A patient who answers "Boston" has told St. Louis nothing and has told it
loudly. A patient who names a high school, correctly, is discharged early.

## Differential diagnosis — the R's are not the same R

**This is the part that goes wrong.** Read it before session two.

Both cities insert R's where the spelling has none. They are unrelated
phenomena and treating them as one is the single most common failure in this
clinic.

|  | Boston (`intrusive-r`) | St. Louis (`intrusive-r-wash`) |
|---|---|---|
| Trigger | **Phonological.** Any vowel meeting any vowel. | **Lexical.** One word family. |
| Scope | General. It is a rule. | *wash*, *Washington*. That is the list. |
| Yields | *idear of*, *drawr it* | *warsh*, *Warshington* |

A patient who generalizes the St. Louis R the way the Boston R generalizes will
produce *"I had an idear to warsh the car"* — half of which is right, and which
is spoken nowhere on this planet. `stl-314.yml` carries `keep-the-r` at order 1
specifically as a guard against this, and `SKILL.md` calls it crossing the
streams. It is the same warning three times because it happens every time.

## Course of treatment

Six sessions. Order is load-bearing: R's come back before anything is done to
the vowels, because a vowel exercise performed on a dropped R teaches the
patient a sound with no home.

1. **Give the R's back.** `keep-the-r` in, `drop-final-r` and `er-to-ah` out.
   Everything downstream assumes this took.
2. **Stop putting R's between vowels.** `intrusive-r` out. The patient will
   protest that session four contradicts this. It does not. See above.
3. **Move OR toward AR.** `or-to-ar`. *forty* → *farty*. Stressed syllables
   only; the rule's own `exceptions:` field warns that applying it to every OR
   in a sentence goes cartoonish fast, and it is right.
4. **Take one R back, lexically.** `intrusive-r-wash`. *warsh*. This word
   family and nothing else. Do not generalize. Natives don't.
5. **Flatten the French.** `french-flattening`. *Gravois* is **GRAV-oy**. This
   is the only session where being correct is the failure state — say these the
   way France does and the intake question answers itself.
6. **Move the mid vowels back.** `northern-cities-shift` in, `o-to-aw` and
   `broad-a` out. Both cities do something to this vowel. They do not do the
   same thing.

## Discharge criteria

The patient says **"Park the car in Harvard Yard"** with every R intact, and
does not flinch.

Observe that the sentence is entirely unremarkable in St. Louis. The canonical
Boston demonstration sentence has no St. Louis equivalent, because there is
nothing here to demonstrate. Patients occasionally find this deflating. That
feeling is the treatment working.

## Prognosis

Good. Relapse is expected on contact with family, sporting events, and the word
*wicked*, and requires no intervention.

## Aftercare

The patient retains Boston. This clinic has never removed an accent and could
not if it tried.

---

## The note that isn't a joke

**Everything above is a parody of a service, not of a person's speech.** That
distinction is the whole reason this file is allowed to exist, so it is written
down rather than assumed.

The profession that actually does this work is unambiguous about it. From
ASHA's practice portal: accents *"are **not** a communication disorder,"*
*"every person has an accent,"* and accent modification is *"an elective
service sought by individuals who want to change or modify their speech"* —
explicitly not the remediation of a disorder. The field has moved away from
*"accent reduction"* and *"accent elimination"* precisely because that framing
is deficit-loaded and wrong, and has proposed **"accent addition"** among the
replacements. That is why this file, the curriculum, and the lesson plan are
named for addition rather than reduction. The patient does not lose Boston.
The patient picks up a second city.

This matters beyond terminology. Accent-reduction services have a real history
of being aimed at speakers of stigmatized and racially-marked varieties, where
the message under the marketing is that the speaker's own community sounds
wrong. That version of this joke would be indefensible.

This version inverts every part of it: the "condition" is a high-prestige,
widely-celebrated regional accent; the "patient" is a Bostonian who volunteered;
the destination is the smaller city; and the clinic's own self-seriousness is
the thing being laughed at. `docs/TONE.md` sets the test — parody the **genre**,
not the people, and the target is the cliché rather than the city. The genre
here is clinical marketing copy. It can take a punch.

Two things this file therefore does not do, on purpose:

- **It does not drill the "urr" vowel.** `data/pronunciation/stl-314.yml`
  documents that feature and deliberately leaves it out of the applied rules,
  because it is most associated with Black St. Louisans and an automated
  caricature of racially-marked speech is exactly the failure
  `CODE_OF_CONDUCT.md` exists to prevent. A curriculum that drilled it would be
  teaching the impression the accent file refuses to perform. Same call, made
  the same way, recorded in the curriculum's `not_covered:` block.
- **It does not use `hoosier` as a name for anything.** Not the clinic, not a
  patient, not a level of the dial. `SKILL.md` already explains why: *masshole*
  is a badge locals wear, *hoosier* is what St. Louisans call other people. A
  clinic that called its patients hoosiers would be punching at exactly the
  people it claims to be helping join.

If any of the above reads as punching down on a re-read, cut the file. The joke
is not worth the rule. That is rule #2, and it outranks this document.

## Sources

- ASHA, *Accent Modification* (Practice Portal) —
  https://www.asha.org/practice-portal/professional-issues/accent-modification/
- *A Viewpoint on Accent Services: Framing and Terminology Matter*,
  American Journal of Speech-Language Pathology —
  https://pubs.asha.org/doi/10.1044/2021_AJSLP-20-00376
- STLPR, *How to speak STL: A pronunciation guide for new St. Louisans* —
  https://www.stlpr.org/culture-history/2023-10-16/how-to-speak-stl-a-pronunciation-guide-for-new-st-louisans
- `docs/TONE.md`, `CODE_OF_CONDUCT.md`, and `data/pronunciation/stl-314.yml`,
  which between them decided most of the calls on this page.
