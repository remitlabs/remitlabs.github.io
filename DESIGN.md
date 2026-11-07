# DESIGN

**System:** Remit editorial dark
**Last updated:** 2026-11-08

## Intent

A technical broadsheet for a security product. The page should read like a
well-set document, not a SaaS landing page: generous whitespace, a strong serif
voice, monospace for evidence, and a single warm accent used like a highlighter.
The visual identity is inherited from the original `index.html` and is preserved.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--casing` | `#131110` | page background |
| `--surface` | `#1B1815` | cards, code blocks, plates |
| `--surface-2` | `#211D19` | table headers |
| `--ink` | `#EAE2D3` | primary text |
| `--dim` | `#9B9285` | secondary text, prose |
| `--hair` | `#2A2520` | 1px rules, borders |
| `--amber` | `#FFB454` | accent, labels, CTAs |
| `--ok` | `#86C08A` | positive status |
| `--deny` | `#D96F5C` | negative status |
| `--serif` | Newsreader, Iowan Old Style, Charter, Georgia | headings, prose |
| `--mono` | JetBrains Mono, SF Mono, Menlo | labels, code, metadata |

## Type scale

- Hero H1: `clamp(4.2rem, 10vw, 7.4rem)`, line-height 0.95, tracking -0.035em.
- Page H1: `clamp(2.4rem, 6vw, 4.4rem)`, line-height 1.02.
- Section H2: `clamp(1.9rem, 3.6vw, 2.7rem)`, line-height 1.15.
- Lede: `clamp(1.2rem, 2.2vw, 1.45rem)`, line-height 1.55.
- Prose: 16–18px, line-height 1.75, measure 62ch.
- Labels: 0.72–0.82rem mono, uppercase, tracking 0.1em.

## Rules

- One accent color. Amber marks the thing to notice; it is never a background
  except on a primary button hover.
- Dashed rules for metadata; solid hairline rules for structure.
- Code blocks are surfaces, not black boxes. They carry real output.
- Cards are quiet: 1px hairline, 10–12px radius, no shadow.
- Motion is a single 700ms entrance per element, disabled under
  `prefers-reduced-motion`.
- No stock photography, no gradients beyond a subtle radial glow, no glassmorphism.

## Components

- `.mast` — wordmark + mono nav, hairline bottom border.
- `.hero` — asymmetric two-column: statement left, evidence receipt right.
- `.receipt` — the signature object: a sample evidence record in mono.
- `.ledger` — row-based explanations with a mono label column.
- `.tier` — pricing cards, one `feature` card with an amber hairline.
- `.table-wrap` — scrollable comparison table, sticky header.
- `.article` — 760px measure, serif body, mono metadata.
- `.docs` — sticky mono sidebar + 760px body.
- `.foot` — four-column sitemap, hairline top border.

## Accessibility

- Body text contrast: `#EAE2D3` on `#131110` ≈ 13:1; `#9B9285` on `#131110` ≈ 5.1:1.
- Focus rings: 2px amber, 3px offset, on every interactive element.
- One `h1` per page; landmarks on every page.
- Motion respects `prefers-reduced-motion`.
- No text in images; the SVG pipeline has `role="img"` and an `aria-label`.

## Responsive

- 1160px max width, fluid gutters.
- Hero collapses to one column at 920px.
- Tiers 4 → 2 → 1 columns.
- Tables scroll horizontally rather than shrink text.
- Tested down to 320px.
