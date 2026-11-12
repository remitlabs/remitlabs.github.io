# Product

<!-- impeccable:product-schema 1 -->

**Name:** Remit
**Org:** Remit Labs
**Site:** https://remitlabs.github.io
**Last updated:** 2026-11-12

## Platform

web

## Product Purpose

Remit is least-privilege and lifecycle control for AI agent skills. It audits the
`SKILL.md` packages that coding agents (Claude Code, Codex, Cursor, OpenCode) load,
records static findings, runs a behavioral canary in a disposable container when one
is available, pins installs by digest, and blocks revoked digests at load time.

**Category:** agent-skill trust and lifecycle management.
**Business model:** open-core. Community is free forever; Team/Business/Enterprise
sell coordination, history, compliance, hosted execution, and support.

## Users

- **Primary:** 10–200 person engineering teams running at least two coding agents,
  with 30+ skills and a real audit, compliance, or incident trigger.
- **Champion:** platform / developer-experience lead, AI tooling lead.
- **Economic buyer:** security engineering lead, CISO, VP Security, CTO.
- **Community:** individual power users with 50+ skills.

## Surfaces

| Route | Mode | Job |
|---|---|---|
| `/` | Persuade | Understand the product and run the audit |
| `/pricing` | Persuade | Choose a tier or book a design-partner call |
| `/security` | Read/Trust | Evaluate the evidence model, limits, and disclosure |
| `/compare` | Persuade | Understand the difference from scanners and registries |
| `/docs` | Read | Install and operate the CLI |
| `/blog` | Read | Learn from research, teardowns, and how-tos |

## Conversion actions

1. Primary: run `npx @remitlabs/cli@latest start`.
2. Secondary: book a 15-minute design-partner call.
3. Tertiary: subscribe to The Remit Ledger.

## Brand Commitments

Direct, technical, dry, honest. "Observed," "evidence," "receipt," "coverage,"
"limit." Never "safe," "secure," "guaranteed," or "prevents exfiltration" without
qualification. Solo founder: "I," not "we." No invented customers, logos, or metrics.

## Evidence on Hand

- 8 `@remitlabs/*` packages at 0.1.1, Apache-2.0.
- 64 static rules; 73-specimen corpus (64 attacks, 9 benign); static-only recall
  64/64, benign flagged 0/9. Self-authored regression ceiling, not field accuracy.
- 123 skills / 4 agent dirs / 114 duplicate registrations on the founder's machine.
- ~15,238 eager tokens vs ~150 routed tokens (measured).
- Founder-reported on 2026-11-12: 600+ npm downloads without promoting Remit
  anywhere, plus two brand partnership offers. The download time window and
  package aggregation were not specified. Offers are not signed partnerships.
- Recorded CLI demo: `assets/cli-demo.mp4`, 26 seconds at 1440 × 810.
- Animated explainer: `assets/remit-loop.mp4`.
- Historical package, corpus and machine measurements above were recorded in
  the 2026-11-08 product record and need live verification before updating.

- Measured catalog snapshot, 2026-11-13: 14,307 entries scanned from 19,577 attempted URLs in a 20,000-URL public skills.sh sitemap snapshot. Of the scans, 13,730 reported complete file coverage and 577 were partial. There were 5,270 failed resolutions/scans and 423 unattempted entries when the user stopped remaining work. Raw static-score counts were 9,387 clean, 701 low, 1,493 elevated and 2,726 high. All behavioral decisions remain unknown. Evidence is in `data/catalog-scan-summary.json` and its linked revisioned report.

## Capabilities and Constraints

- No fake social proof. No customer logos until a signed pilot.
- Limits appear next to claims.
- The team control plane is in design-partner development; label it as such.
- Static site on GitHub Pages; no build step; no tracking by default.

## Positioning

Remit combines static skill findings, optional container observations, digest
pinning and revocation for the skills existing coding agents already load.

## Operating Context

A user runs `npx @remitlabs/cli@latest start` in a terminal. The read-only audit
scans agent skill directories and opens local reports at `127.0.0.1:8787`.
Node 22.5+ is required. Docker or Podman enables the behavioral canary.
The core works offline on macOS, Linux and Windows.

## Product Principles

- Show the rules, evidence and coverage behind each decision.
- Keep missing evidence visible through an unknown decision.
- Keep the local audit available without an account.
- Preserve user control through pinned content and revocation.
