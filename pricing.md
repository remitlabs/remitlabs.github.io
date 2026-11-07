# Remit pricing

**As of:** 2026-11-08
**Status:** public-beta hypothesis. Prices may change before general availability. Design partners get 50% off for six months. Annual billing is 20% off.

Remit is least-privilege and lifecycle control for AI agent skills. The local audit is free forever. Teams pay for coordination: a shared fleet, roles, approvals, scheduled scans, alerts, retained evidence, and a compliance export.

## Community — $0, forever

For individual developers and evaluators.

- Local CLI + dashboard
- Static scan, 64 rules
- Local canary (Docker or Podman)
- Lockfile, pin, update diff, rollback
- MCP router + hook-guard
- Signed revocation feed
- Apache-2.0
- Community support

No account, no seat count, no trial timer.

## Team — $25 per operator per month

For 10–50 person engineering teams. 5-seat minimum, $250/month floor.

Everything in Community, plus:

- Hosted org, members, roles
- Shared fleet across machines
- Google/GitHub SSO
- Org policy + approval workflow
- Scheduled scans + Slack/email/webhook alerts
- Hosted canary, 500 runs/month
- 90-day audit log + evidence history
- Private team registry, 5 GB
- Business-hours support

Read-only viewers are unlimited and free.

## Business — $50 per operator per month

For 50–200 person companies with compliance needs. 20-seat minimum, $1,000/month floor.

Everything in Team, plus:

- SAML SSO + SCIM
- Advanced RBAC + scoped API keys
- SIEM connectors: Splunk, Datadog, Microsoft Sentinel
- Compliance evidence pack (SOC 2 / ISO 27001)
- 1-year retention + legal hold
- Custom rules and signature packs
- 99.9% uptime SLA
- Priority support

## Enterprise — from $25,000 per year

For regulated, air-gapped, or 200+ person organizations. Custom contract.

Everything in Business, plus:

- Self-hosted / VPC / air-gapped
- Dedicated canary workers
- Custom data residency and retention
- Custom integrations: GitLab, Azure DevOps, Jira, ServiceNow
- Security review + pentest report
- 24/7 support + named technical account manager
- Professional services

## FAQ

**Is the local audit really free?** Yes. No account, no seat count, no time limit.

**What counts as an operator?** Anyone who can change policy, approve an install, run a hosted canary, or administer the org. Read-only viewers are unlimited and free.

**Why per operator, not per skill?** Value scales with the number of people who can see and act on the fleet, not with the number of files.

**Do you store my code?** The local scan runs on your machine. The self-hosted API is yours. The hosted team tier will document what leaves the machine before it ships.

**Is this a guarantee that a skill is safe?** No. Remit is defense in depth: static findings, one observed canary run, digest pinning, and revocation.

**Can I self-host?** Yes, on Enterprise.

**What happens to my data if I cancel?** Export everything for 30 days, then delete on request.

**Do you offer a discount?** 20% off annual. Design partners get 50% off for six months.

## Contact

Email singhgaurprahalad@gmail.com with "Remit" in the subject.
