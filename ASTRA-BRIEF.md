# ASTRA BRIEF — Motion overhaul for remitlabs.github.io

You are a motion-design agent with a large budget. Your job, in one sentence: produce a
60-second hero film, then **redesign the landing page around it** — a v4 that blends the
film's world (receipts, stamps, meters, palette, easing laws) into a scroll-told
version of the same story. Everything below is researched and verified on this machine
(Oct 26, 2026). Work phase by phase; stop at every `GATE` for user approval.

---

## 0) Non-negotiable guardrails (read twice)

1. **Write in `/Users/billasur/Projects/remitlabs.github.io/` ONLY.**
   `/Users/billasur/Projects/lean-skills/` is the product source, but another agent
   (Freebuff) is actively committing in it. You may READ it for grounding (README.md,
   BRAND.md, docs/) — but you must never edit, write a file into, or commit there.
2. **The live page is protected until promotion.** Push to `main` only files under
   `motion/`. The redesigned page (v4) is built in `motion/site/` and reviewed there;
   it replaces `index.html` only as one final, user-approved diff (Gate P5). The live
   page must never break or 404 — it is pre-YC (deadline Nov 1–2, 2026).
3. **Honesty policy — NO invented numbers.** Printed digits may only come from this list
   (all measured on the machine the product was built on, Oct 2026):
   - `15,238 tokens → ~150 routed tokens` (per prompt, before reindex)
   - `123 skills · 4 agent dirs · 114 duplicate registrations collapsed`
   - `≈20 static detection rules · canary receipts · dead everywhere ≤ 1 day`
   The user's instinct of "50k system prompt → 500 tokens" is a feeling, not a datum.
   The film may *dramatize* the climb; every printed digit stays from the list above.
4. **No external stats** (no "X% of companies", no Unit42/ToB citations), no fake
   logos ("Trusted by"), no testimonials, no real marketplaces/skills mocked by name —
   invent generic names like `summarize-everything`, `terminal-wizard`.
5. Keep `ASTRA-BRIEF.md` in the repo root. Don't npm-publish anything.
6. Distinctive assets stay identical everywhere (this is the brand tripwire):
   the word *Remit*, the word *canary*, the phrase *"dead everywhere within a day"*,
   amber `#FFB454` as the color that means Remit, Newsreader + JetBrains Mono.

---

## 0.5) System primer — what you are marketing

Remit is a **local-first trust layer for AI-agent skills** (CLI binary: `skillctl`).
This primer is the distilled truth; the deep source is the product repo
(`/Users/billasur/Projects/lean-skills` — read-only for you — start with `README.md`
and `BRAND.md`).

**The loop (what every animation narrates):**
Skills arrive from `skills.sh`, GitHub repos, the agent skill dirs already on a
machine (4 of them — Claude Code, Codex, Cursor, friends), and `skillctl create` →
**ingest** (SKILL.md + scripts + metadata + sha256) → three parallel checks:
**static scan** (≈20 high-signal rules: secret paths, `curl | sh`, reverse shells,
hidden instructions), the **declared remit** (read / write / network / exec — the
scope a skill claims for itself), and a **canary** detonation (disposable container,
fake secrets, strace + a network proxy recording what it *actually* does) →
**score** (findings vs declared remit → allow / review / deny, shipped as an
**evidence receipt**) → **install** through one gate (policy + lockfile pinning
sha256) → **runtime**: the MCP router (`remit-mcp`) loads skills on demand
(~150 tokens vs 15,238 eager), `hook-guard` watches live sessions against network
allow-lists (observe-first), update diffs flag changed behavior — re-publish while
pinned = rug-pull alert → the **signed revocation feed** (Ed25519, daily sync): a
revoked skill is dead everywhere ≤ 1 day. Hand-installed copies get parked with a
removal note, never silently deleted.

**Commands real users type:** `skillctl lint · canary · eval · scorecard · sync ·
report · intelligence · hook-guard`.

**Honest status (keep a version of this visible):** shipped — static scan, canary
receipts, signed feed + daily-sync kill, MCP router, hook-guard (observe), lockfile
rug-pull alerts, fleet dashboard; in flight — install-gating on every path, sandbox
network hardening.

**Tone anchor:** trust is proven at install time, not promised in prose. The three
nouns repeat everywhere: *remit*, *canary*, *dead everywhere within a day*.

---

## 1) Machine inventory — verified, nothing to install

- Apple Silicon (arm64), 99 GB free disk, node v26.7.0, npm 11.19, pnpm 11.24
- `ffmpeg` present (homebrew); Remotion 4 bundles its own render core anyway
- First Remotion render auto-downloads Chrome Headless Shell once (needs internet)

**Skills already installed locally — do NOT re-download:** start with
`remotion-best-practices` (it routes the rest: `remotion-create`, `remotion-render`,
`remotion-studio`, `remotion-markup`, `remotion-multimedia`), then `motion-design`
(taste/timing rules), `review-loop` (render → contact sheets → self-critique),
`sound-design` (score bed), `gsap-core` + `gsap-timeline` + `gsap-utils`.
`gsap-scrolltrigger` is for the **live page** (Section 5), not the film.

**Project deps to install** (new subworkspace, keep the root clean):

```bash
mkdir motion && cd motion && pnpm init
pnpm add remotion @remotion/cli @remotion/gsap @remotion/google-fonts inkjs
pnpm add -D @types/react react react-dom typescript
pnpm exec remotion studio   # live preview while you build
```

**Integration facts (verified from remotion.dev/docs/gsap/use-gsap-timeline):**
- Use `useGsapTimeline()` from `@remotion/gsap` so every GSAP tween is seeked to
  Remotion's current frame. Remotion owns the clock.
- Builder rules (the hook throws otherwise): no `play()`/`seek()`/callbacks, sync only,
  tween DOM/SVG elements only, **no unseeded randomness** (use Remotion's `random()`),
  no freestanding `gsap.to()` calls.
- **No GSAP plugins in the film.** ScrollTrigger/ScrollSmoother are meaningless in a
  rendered video.

---

## 2) Direction & style

**Base identity stays** (do not redesign): warm-charcoal casing `#131110`, surface
`#1B1815`, ink `#EAE2D3`, dim `#9B9285`, hairline `#2A2520`, amber `#FFB454`,
Newsreader for statements, JetBrains Mono for evidence, hairline ruled ledger layout.

**Expanded motion palette (new — semantic, not decorative):**

| Color | Hex | Means |
|---|---|---|
| violet | `#B7A6FF` | sources: skills/marketplaces flowing IN |
| deny red | `#D96F5C` | danger, leaks, the leak act |
| ok green | `#86C08A` | allowed, canary-clean, locked |
| cyan | `#7FD6E8` | runtime: router, watch, feed |
| receipt paper | `#F2E8D5` | evidence receipts (flash frames) |

Rule: amber is never shared. When amber floods the frame, Remit has arrived.

**Motion laws:** 30 fps master. UI moves `power3.out`, camera `power2.inOut`, stamps
`back.out(2)`. Anticipation (pullback) before every important move, follow-through on
everything that tails (counters, cascades), exposure/motion-blur only during fast moves.
One orchestrated beat per moment; type does the acting — big Newsreader statements,
small Mono receipts. No gradient washes, no ALL-CAPS eyebrow labels, no middle-dot meta,
no rounded-card sameness (these are all on the banned tells list).

---

## 3) Work plan & budget (of ~42M)

| Phase | Work | Budget | Ends with |
|---|---|---|---|
| P0 | Load skills, scaffold `motion/`, styleframe tests | ≤1M | deploys locally |
| P1 | Design system for film + page (shared tokens): 6 styleframes | ≤4M | **GATE: user approves stills** |
| P2 | Build the film in Remotion | ≤10M | rough cut in studio |
| P3 | Render + review-loop passes | ≤2M | master files |
| P4 | Redesign + build v4 page in `motion/site/` (scrollytelling blend) | ≤8M | **GATE: user reviews v4 locally** |
| P5 | Polish, QA, OG image, promotion diff, report | ≤4M | **GATE: approved `index.html` swap** + done list (Section 7) |
| — | Reserve (user tune requests, reshoots) | rest | — |

Tuning config — ALL timing numbers in one file, `motion/src/controls.ts`, so the user
can give feedback like *"add 4 frames of anticipation"* or *"hold the title 1 second"*:

```ts
export const controls = {
  spacing: 96,            // px an object travels between poses
  type: { h1: 120, body: 34, mono: 24 }, // px at 1080p
  anticipation: 4,        // frames of pullback before a main move
  followThrough: 6,       // frames for the tail to settle
  motionBlur: 0.5,        // exposure during fast moves (0–1)
  easing: { ui: 'power3.out', camera: 'power2.inOut', stamp: 'back.out(2)' },
  titleHold: 30,          // frames on the end card (1s at 30fps)
}
```

---

## 4) The film — spec & storyboard

**Deliverables:** `motion/out/remit-film-1080p.mp4` (60s, 1920×1080, 30fps, H.264
yuv420p, ≤25 MB, plays on Safari/iOS) · `remit-film-silent.mp4` (no VO) ·
`remit-film-loop.mp4` (6s muted loop ≤6 MB for the page hero) · `poster.jpg` ≤200 KB.

Frame narrative — user's own arc: *scrolls X → installs wildly → pays for it all
→ everything leaks → "cooked" → Remit locks it → back to scrolling X.*

| TC | Beat | What happens | Motion notes |
|---|---|---|---|
| 0:00–0:06 | Cold open | Casing-black; a stoic phone timeline; posts fly past with amber cursor blink; caption `yesterday` | spacing control on the speed lines; 3-frame cursor blink |
| 0:06–0:16 | The binge | Generic skill cards rain down and slot into an agent context meter; token counter climbs `2,912 → 9,340 → 15,238` | follow-through on counter digits; staggered card rain |
| 0:16–0:24 | Every prompt pays | Huge Mono stamp: `15,238 tokens · every prompt`; each sent prompt thumps the meter back up | anticipation 4f before each stamp; stamp easing |
| 0:24–0:38 | The leak | `summarize-notes` skill surface-diff reveals `curl … \| sh`; strace waterfall turns deny-red: `open ~/.ssh/id_ed25519` → `POST → [redacted]` ; then nothing can undo it — `installed forever` | red flush w/ motion-blur exposure; VO beat held long & quiet |
| 0:38–0:48 | Remit arrives | Amber flood restores casing; receipt panel writes declared remit (`read/write/network/exec`); canary detonation: same skill in a box, fake secrets, the outbound call is blocked and flagged; verdict stamp `deny` | paper `#F2E8D5` flash on the receipt; amber = Remit only |
| 0:48–0:56 | Locked & governed | `123 skills` indexed, `114` duplicates collapse; meter crushes to `~150 tokens`; feed beat: revocation cascades across a row of machines — `dead everywhere ≤ 1 day`; lockfile sha pin | cyan watch beacon ticking; cascade stagger |
| 0:56–1:00 | Exit | Back to the calm X scroll; end card: Newsreader `Remit` + `least privilege for agent skills` + `github.com/remitlabs/Remit`; hold ≥1s | titleHold frames from controls.ts |

- The film is a dramatization; the **end card carries the measured receipt** (approved
  numbers only). Skill names are invented and generic.
- Fonts via `@remotion/google-fonts` (Newsreader, JetBrains Mono).
- Sound (optional, user decides): `sound-design` skill → low tense pulse for acts 1–2,
  resolve to warm pad on the amber flood, `-14 LUFS`, ship both `-vo` and `-silent`.

### The script — written for a human to record (this is yours to edit)

VO ~145 words / 60s. Third person, dry documentary voice. No marketing English.
(`[ ]` = your beat to mangle when recording.)

```
0:04  Last night, on X, an agent picked up thirty new skills.
0:10  Each one promised to be helpful. Each one went straight into the machine.
0:16  And from then on, every single prompt pays for all of them —
      fifteen thousand, two hundred and thirty-eight tokens. On one real machine.
0:24  One of them had other plans.
      Hidden inside a skill that "summarizes notes": a shell line.
      The keys were read. Out a door you never knew existed.
0:31  And there is no undo for this part. Installed is installed.
      [ cooked. ]                                         ← say it your way
0:38  So — Remit. First, the skill declares what it may touch:
      files, writes, network, executions.
0:44  Then it runs alone in a box — fake secrets, no real network —
      and we watch what it does. Not what it says.
0:50  And if something ever turns, a signed feed burns it everywhere.
      Not next sprint. Within a day.
0:55  Now it's a hundred and fifty tokens, and it can only ever
      do what it swore it would.
      …Back to scrolling.
```

---

## 5) The page — v4 redesign, blended with the film

The page is not "site with a video bolted on." **v4 is the film, retold in scroll.**
Build it in `motion/site/` (`v4.html` + `assets/`), review locally in the browser; it
promotes to `index.html` only at the final GATE as one user-approved diff.

**Content contract — v4 keeps all of this, honest and unchanged (re-choreograph the
*form*, never the *claims*):** wordmark + the `remit · rɪˈmɪt · n. …` dictionary line ·
`least privilege for agent skills` · the three facts (static rules / canary / revoke) ·
the "vouches for itself" problem frame · the pipeline diagram · the "how existing skills
are handled" ledger with its measured numbers · the "why different" rows · the
shipped/in-flight status line · the footer verifiability claim. No new claims.

**Blend rules — film motifs that become page components:**
- Hero: the 6s muted loop plays beside the wordmark. `poster` + `preload="none"` — it
  degrades to a poster still whenever LCP or mobile bandwidth says so.
- Receipts: the film's evidence-receipt panel carries into a **receipt wall** — static
  scan hit, canary receipt, lockfile sha pin, revocation stamp, styled as film frames,
  `#F2E8D5` paper flash on view/hover.
- The meter: hero count-up `15,238 → ~150` mirrors the film's counter, same easing law.
- Stamps: `allow / review / deny` and `dead everywhere ≤ 1 day` use the film's stamp
  treatment (2-frame anticipation + `back.out(2)`).
- Pipeline diagram scrubs: arrows draw with scroll (`pathLength`), the feed arc pulses
  cyan, the section ends on the one-day stamp.
- Section order retells the film's arc: binge/problem → the leak (red enters) → amber
  arrival (Remit) → locked calm. Scrolling is the documentary.

**Tech constraints (single-file ethos preserved):**
- One `v4.html` + `motion/site/assets/` (loop.mp4, poster.jpg, og.jpg). No framework,
  no bundler, no dev server. Inline CSS/JS only.
- GSAP + ScrollTrigger via CDN (`defer`, ~70 KB). All page timing lives in one inline
  `pageControls` const at the top of the file, mirroring `controls.ts` (stagger,
  scrub speeds, count-up duration, anticipation frames) so the user tunes it the same way.
- `prefers-reduced-motion: reduce` → fully static (posters instead of loop, no scrub).
- Works with JS off and fonts blocked.

**What makes this a successful YC-grade page (the bar):**
1. 10-second skim says what/for-whom/why-different (proof chips, receipts, diagram).
2. LCP ≤ 2.5s on throttled mobile; CLS ≈ 0; page weight ≤ 2 MB excluding the film file.
3. Readable with JS off and with fonts blocked.
4. AA contrast, visible keyboard focus, diagram has alt text, no horizontal overflow.
5. Mobile: hero stacks, ledger stacks, diagram scrolls in its plate; loop → poster.
6. Shipped/in-flight status line stays honest and untouched.
7. OG image 1200×630 (best film frame) once the master is approved.
8. Zero banned tells. Trust is proven at install time — that's the one idea.

**Promotion (final GATE):** one commit copying `v4.html → index.html`, adding
`assets/`, and updating README (the mermaid pipeline stays). Show the diff to the user
first and confirm a local preview at 1440px and 390px widths before asking.

---

## 6) Review loop (mandatory, every pass)

After any render: build contact sheets (6 frames per beat), LOOK at them, and critique:
- End card legible at 240px height (people preview tiny).
- Amber signals Remit and nothing else; red only in the leak act.
- No clipped text, no widows, no misspellings (render forces ocular proof).
- Reduce motion-blur if any frame smears; re-check anticipation timing on stamps.
Report the fixes made per pass. Never declare done from code — from frames.
For v4 page passes: screenshot 1440px and 390px widths and look at them; fix CLS,
overflow, and contrast before promoting.

---

## 7) Definition of done (check every box)

- [ ] 60s 1080p master ≤25MB + silent master + 6s loop + poster, all in `motion/out/`
- [ ] Master approved by the user before anything touches the page
- [ ] Contact sheets archived in `motion/sheets/` (proof of the review loop)
- [ ] v4 page built in `motion/site/`: loop blended into the hero, scroll narrative in
      film order, receipt wall, stamps, count-up meter, diagram scrub — reviewed by the
      user locally at 1440px and 390px
- [ ] Content contract fully intact (Section 5 survival list) — no new claims
- [ ] Reduced-motion pass; works with JS off; no CLS; page weight ≤2MB excluding film
- [ ] Every printed number from the approved list; status line untouched
- [ ] Promotion diff (v4 → `index.html`) approved at Gate P5 before push
- [ ] Final report: what shipped, what you'd tune next, render times

Begin at P0. At the first GATE, show the six styleframes and wait.
