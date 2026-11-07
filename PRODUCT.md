# PRODUCT

**Name:** Remit
**Org:** Remit Labs
**Site:** https://remitlabs.github.io
**Last updated:** 2026-11-08

## What it is

Remit is least-privilege and lifecycle control for AI agent skills. It audits the
`SKILL.md` packages that coding agents (Claude Code, Codex, Cursor, OpenCode) load,
records static findings, runs a behavioral canary in a disposable container when one
is available, pins installs by digest, and blocks revoked digests at load time.

**Category:** agent-skill trust and lifecycle management.
**Business model:** open-core. Community is free forever; Team/Business/Enterprise
sell coordination, history, compliance, hosted execution, and support.

## Who it is for

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

## Voice

Direct, technical, dry, honest. "Observed," "evidence," "receipt," "coverage,"
"limit." Never "safe," "secure," "guaranteed," or "prevents exfiltration" without
qualification. Solo founder: "I," not "we." No invented customers, logos, or metrics.

## Proof points (as of 2026-11-08)

- 8 `@remitlabs/*` packages at 0.1.1, Apache-2.0.
- 64 static rules; 73-specimen corpus (64 attacks, 9 benign); static-only recall
  64/64, benign flagged 0/9. Self-authored regression ceiling, not field accuracy.
- 123 skills / 4 agent dirs / 114 duplicate registrations on the founder's machine.
- ~15,238 eager tokens vs ~150 routed tokens (measured).
- npm: 509 downloads in 30 days, ~40/week. Treat as curiosity, not users.

## Constraints

- No fake social proof. No customer logos until a signed pilot.
- Limits appear next to claims.
- The team control plane is in design-partner development; label it as such.
- Static site on GitHub Pages; no build step; no tracking by default.
