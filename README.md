# remitlabs.github.io — the Remit landing

**Live:** https://remitlabs.github.io (GitHub Pages, auto-deploys from `main` on push, ~1 min)

Edit `index.html` (single file, no build step). Push → live.

Copy policy: **every claim must be runnable with the published CLI or backed by a measured number** from the machine that built the project (Oct 2026). Never claim a safety guarantee; the canary is evidence from one observed run, not proof.

## The pipeline (mermaid source — GitHub renders this)

```mermaid
flowchart TD
  subgraph SRC[where skills come from]
    A1[skills.sh index]
    A2[GitHub repos]
    A3[agent skill dirs<br/>Claude · Codex · Cursor]
    A4[skillctl create]
  end
  A1 --> IN
  A2 --> IN
  A3 --> IN
  A4 --> IN

  IN[ingest — SKILL.md + scripts + metadata + sha256]

  IN --> SS[static scan<br/>64 high-signal rules<br/>secret paths · curl-pipe-sh · reverse shells<br/>mcp tampering · hidden instructions…]
  IN --> RF[declared remit<br/>read / write / network / exec<br/>the scope the skill claims]
  IN --> CN[canary sandbox<br/>disposable container · per-run fake secrets<br/>strace + logging proxy → observed behavior]

  SS --> SC{{score — findings vs declared remit<br/>coverage + confidence → allow / review / deny<br/>ships as an evidence receipt}}
  RF --> SC
  CN --> SC

  SC -->|allow| INS[install gated by policy<br/>lockfile pins sha256]
  SC -->|review / deny| PK[park + evidence receipt]

  INS --> UP[update time — semantic diff on re-publish<br/>rug-pull alerts, never silent drift]
  INS --> RT[runtime — MCP router loads on demand<br/>hook-guard watches live sessions<br/>vs network allow-lists]

  FD[[signed revocation feed<br/>Ed25519 · daily sync]] --> RT
  RT -->|revoked digest| KILL[blocked at load time<br/>remit-home copies removed<br/>user-owned files parked + removal note]
  RT --> REP[posture report · intelligence · fleet dashboard]
```

### Status legend

| Stage | State (Oct 27, 2026) |
|---|---|
| ingest → static scan → canary → score | **shipped** (corpus-golden-tested in CI) |
| policy gate + locked installs | **shipped** for CLI and marketplace installs |
| lockfile + semantic-update diffs | shipped |
| MCP router + hook-guard | shipped (hook-guard observe-first) |
| signed feed + daily sync | shipped |
| canary containment | **open** — observer-first; egress enforcement only with an allowlist |
