---
name: Remit
description: Charcoal and amber UI for reviewing AI agent skills.
colors:
  casing: "#0A0C0B"
  surface: "#111514"
  raise: "#161C19"
  sunk: "#080A09"
  hair: "#232A26"
  hair-lit: "#2F3833"
  ink: "#EDF1E9"
  dim: "#9AA498"
  faint: "#9AA498"
  amber: "#FFB454"
  amber-hover: "#FFC677"
  amber-wash: "rgba(255,180,84,.12)"
  action-ink: "#17120A"
  ok: "#8FD694"
  deny: "#EA7767"
  risk-clean: "#7D9C90"
  risk-low: "#BBC6A9"
  risk-elevated: "#C7954E"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.3rem, 4.8vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.3
  command:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.95rem"
    lineHeight: 1.4
  article:
    fontFamily: "Newsreader, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "1.09rem"
    fontWeight: 400
    lineHeight: 1.78
rounded:
  small: "2px"
  panel: "3px"
  control: "5px"
  visual: "8px"
spacing:
  gutter: "clamp(1rem, 2vw, 2rem)"
  control-gap: "0.75rem"
  section: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.action-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.1rem"
  button-secondary:
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.1rem"
  command:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
    typography: "{typography.command}"
    rounded: "{rounded.small}"
    padding: "0.8rem 1rem"
  visual-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.visual}"
  card:
    backgroundColor: "{colors.surface}"
    padding: "1.3rem 1.35rem"
  chip:
    textColor: "{colors.dim}"
    rounded: "{rounded.small}"
    padding: "0.32rem 0.45rem"
---

# Design System: Remit

## Overview

Remit uses charcoal surfaces, Archivo interface type and amber actions. Short introductions lead to visual evidence, with supporting detail available in disclosures. IBM Plex Mono identifies commands and measured values. Newsreader remains the article reading face.

R-01. The latest user-approved tutorial-first, single-column direction supersedes the older split hero and numbered section rails. Merge that layout decision into the established Archivo, charcoal and amber identity.

- One continuous reading path.
- Wide tutorial and mesh, bounded prose.
- Shared navigation, controls and disclosure styles.

## Colors

Amber is the action accent. Casing, surface, raise and sunk create the charcoal layers. Hair and hair-lit define dividers and interactive borders. Ink carries headings. Dim and faint share the current secondary text value.

Risk-clean, risk-low, risk-elevated and amber encode the mesh and risk graph. Ok and deny remain semantic report colors.

**The accent rule.** Use amber for actions and selected states. Use green and red for reported data states.

## Typography

Archivo handles headings, prose, navigation, buttons, captions and table headers. Controls use sentence case. IBM Plex Mono handles commands, receipt values and graph counts. Newsreader handles article paragraphs and lists.

The hero is centered with a 24ch heading limit. Homepage section introductions use `clamp(1.8rem, 3.4vw, 3rem)`. Supporting notes use Archivo at .875rem with 1.65 line height. General prose has a 72ch maximum measure, and articles have a 76ch container.

## Layout

The page uses fluid gutters. Heroes and inner-page reading sections have a centered 1000px maximum width. Homepage introductions use 760px, the tutorial and mesh use up to 1440px, and the risk graph and evidence disclosures use 840px.

The homepage order is introduction, recorded tutorial and command, early traction, mesh and risk graph, then the final scan action. Pricing uses vertically stacked plan disclosures. Trust details, ledgers and supporting grids follow a single column.

**The reading order rule.** Give each section one heading and one reading path. Place supporting explanations in native disclosures when the reader can choose to expand them.

At 700px, the mesh settles at 320px high, command text wraps, graph label columns narrow and plan summaries wrap. At 640px, navigation uses a second row and the footer becomes one column. Tables retain horizontal overflow.

## Elevation & Depth

Flat surfaces and one-pixel borders define groups. The tutorial and mesh share the visual corner radius. The masthead stays opaque and sticky. The demo dialog uses a dark backdrop with 4px blur. Article callouts retain an inset amber rule.

## Shapes

Use the control radius for buttons, mesh controls and graph rows. Use the visual radius for video and mesh frames. Code, chips and command fields retain the small radius. Hairline dividers separate disclosures and measured rows.

## Components

- Navigation has an amber active-page underline, an amber scan link and shared 44px minimum link height.
- Primary actions use amber with dark text and a lighter amber hover. Secondary actions use subdued text and a hairline border. Keyboard focus uses a 2px amber outline with 3px offset.
- Command fields show selectable monospace text and a copy button. Copy feedback lasts 1700ms, with a manual-copy message when clipboard access fails.
- The recorded tutorial uses native video controls and a caption. Enlarge opens a native dialog. Closing pauses its video. Reduced-motion preference pauses autoplay videos.
- The local canvas mesh shows 123 entries from the documented example and four directory hubs. Its accessible group contains the motion controls. Graph rows toggle risk highlights and expose selection with `aria-pressed`. Selecting the same row clears the filter. The textual status announces the selected count. The graph shows 101 clean, 1 low, 15 elevated and 6 high scores. Positions and edges are illustrative.
- Mesh motion pauses through its control, outside the viewport and while the document is hidden. Reduced-motion preference starts it paused. A textual fallback remains until the canvas is ready.
- Plan, evidence and trust disclosures use native `details` and `summary`. Community starts expanded on pricing. Supporting report values remain visible when the relevant disclosure opens.
- Cards and chips retain their shared charcoal fills and semantic report states where used by reading pages.

## Do's and Don'ts

- Do place the homepage tutorial before the mesh and risk graph.
- Do keep the mesh caption, textual counts and report limits beside the visual evidence.
- Do reuse the shared Archivo controls, amber focus treatment and hairline dividers.
- Do keep command text and tables usable at narrow widths.
