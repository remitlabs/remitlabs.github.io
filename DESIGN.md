# DESIGN

**System:** Remit instrument — a lab datasheet for agent authority
**Last updated:** 2026-11-12

## Intent

The site is evidence, set like an instrument readout: numbered sections, a
visible left rail, hairline rules that behave like a grid, monospace for
anything measured, and a grotesk for anything spoken. Warmth is removed from
the surfaces on purpose. The previous warm-cream serif direction now reads as
the generic generated aesthetic; this one should read as a document a security
team produced for itself.

Rules that carry the look:

- One accent (amber) used as a signal lamp: rail numbers, the prompt, a status
  chip, a rule that fired. Never as a background wash except a 7% tier tint.
- Green and red appear only on real data (allowed, denied), never decoratively.
- Type roles are strict: grotesk speaks, mono measures, serif reads.
- Every section is numbered and anchored to the same rail.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--casing` | `#0A0C0B` | page background, cool near-black |
| `--surface` | `#111514` | panels, cards, receipts |
| `--raise` | `#161C19` | table headers, hover rows |
| `--sunk` | `#080A09` | code, command line, field |
| `--hair` | `#232A26` | 1px rules, grid gaps |
| `--hair-lit` | `#2F3833` | borders on interactive elements |
| `--ink` | `#EDF1E9` | primary text (~16:1) |
| `--dim` | `#9AA498` | prose, secondary (~6.5:1) |
| `--faint` | `#6E7A70` | metadata, labels |
| `--amber` | `#FFB454` | the single accent |
| `--ok` | `#8FD694` | allowed / clean |
| `--deny` | `#EA7767` | revoked / blocked |
| `--sans` | Archivo | headings, UI, statements |
| `--mono` | IBM Plex Mono | data, labels, code |
| `--serif` | Newsreader | long-form article body only |

## Type

- Hero H1: `clamp(2.5rem, 5.6vw, 4.6rem)`, line-height 0.98, tracking -0.045em,
  `text-wrap: balance`. The second sentence sits in `--dim`.
- Statement: `clamp(2rem, 4.6vw, 3.6rem)`, tracking -0.04em.
- Section head: `clamp(1.7rem, 3.2vw, 2.75rem)`, tracking -0.035em, max 26ch.
- Kicker / rail / labels: mono, uppercase, 0.6–0.72rem, tracking 0.14–0.2em.
- Prose: 1rem–1.06rem, line-height 1.78, measure 64ch.
- Article body: Newsreader 1.09rem, line-height 1.78.

## Components

- `.mast` — sticky, blurred casing, 8px amber mark, mono nav, amber pill CTA.
- `.hero` — 1.12/.88 split: statement + command left, live fleet panel right.
- `.panel` / `.fleet` — the documented run as a table, severity dots, honest
  footer (`decision: unknown`).
- `.band` + `.spine` + `.rail-num` — the datasheet spine: sticky numbered rail,
  content offset to a consistent second column.
- `.specimen` — two panes: `.code` with counters and line highlights, `.readout`
  with numbered annotations.
- `.receipt` — the signature object: `dl` rows, chips, `.coverage` meters that
  state what did not run.
- `.field` — three.js fleet: 123 points, 4 directory hubs, hairline edges, one
  revoked point. Degrades to a stalled dot field if the CDN never answers.
- `.tally` — four measured numbers, counts animate once and settle exact.
- `.tiers`, `.table-wrap`, `.docs`, `.article`, `.faq` — unchanged semantics,
  new type and rules.
- `.cmdbar` — sticky install command after the hero, dismissible per session.

## Motion

- anime.js v4 (UMD from jsDelivr) drives one hero timeline, the count-ups, and a
  3px magnetic response on the primary CTA.
- Scroll reveals are anime-driven but every one carries a 1.1s settle timer, and
  the hero carries a 2.4s one, so a throttled tab can never leave content
  invisible.
- `prefers-reduced-motion` skips all of it; the field renders one static frame.
- Nothing is hidden in CSS. A blocked CDN leaves a fully readable page.

## Accessibility

- Contrast: ink 16:1, dim 6.5:1 on casing.
- Focus: 2px amber outline, 3px offset, on every interactive element.
- One `h1` per page, landmarks throughout, the field has an `aria-label` and its
  legend is real text.
- Tables scroll horizontally rather than shrinking type.
- Tested at 1440, 1180, 845, and 390px.

## Responsive

- 1240px wrap, fluid gutters.
- Hero collapses at 940px; spine collapses to an inline number; specimen
  collapses to one column; tiers 4 → 2 → 1; tally 4 → 2 → 1 at 400px.
