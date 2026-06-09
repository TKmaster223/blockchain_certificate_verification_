# Verified Skills Passport — Mega Project Skill Plan

## Vision
Build a portfolio-grade, full-stack platform where users solve coding challenges, earn blockchain-anchored certificates, and share a public verifiable skills profile.

## Current Project Audit and Skill Gap Mapping

### Backend (FastAPI + MongoDB)
**Strengths**
- Existing JWT authentication and role-based endpoints.
- Certificate issue/verify flows already implemented.
- Good foundation for API-first service architecture.

**Weaknesses**
- Limited automated test coverage.
- Validation, pagination, and error contract consistency can be improved.
- Security hardening (rate limits, token lifecycle, stricter CORS) needs expansion.

### Frontend (React + TypeScript)
**Strengths**
- Structured component/page layout.
- Existing auth and certificate service hooks.
- TypeScript + modern UI tooling foundation.

**Weaknesses**
- Missing package metadata/scripts in current clone (no package.json found).
- Product flows are incomplete for challenge and wallet experiences.
- Accessibility, UX states, and API error standardization need improvement.

### Blockchain (Solidity)
**Strengths**
- Contract exists for hash storage and verification.
- Clear baseline for immutable proof-of-existence.

**Weaknesses**
- No issuer authorization model.
- No revocation support.
- No event model for indexing and analytics.

### Top 3 Skill Gaps to Target
1. **Testing Discipline** (unit, integration, and contract testing).
2. **Security Engineering** (auth hardening, secrets, abuse protection).
3. **System Design for Production** (service boundaries, observability, CI/CD).

---

## Mega Project Scope

### Core Features
1. Challenge engine (problems, test cases, grading rules).
2. Submission pipeline (run, score, persist attempts).
3. Skills certificate issuance tied to challenge milestones.
4. Public verification page for certificate authenticity.
5. Admin dashboard for users, challenges, and issuers.

### Non-Functional Goals
- Authentication hardening and authorization boundaries.
- Observability (metrics, logs, traces) with operational alerts.
- CI/CD for linting, testing, security scanning, and deployment.
- Full containerized local and cloud-ready deployment.

---

## Target Architecture Upgrade

### Service Modules (within current stack)
- **Auth Service**: identity, roles, token lifecycle.
- **Challenge Service**: challenge CRUD, attempts, scoring.
- **Certificate Service**: issue/revoke, metadata persistence.
- **Verification Service**: public verification endpoint + blockchain checks.

### Architecture Standards
- Versioned API contracts (`/api/v1/...`).
- Shared response/error schema.
- Correlation IDs and audit logging for traceability.
- Backward-compatible migration strategy for schema evolution.

---

## Implementation Tracks

### 1) Backend Mastery Track
- Add strict request/response validation and centralized error handling.
- Enforce role policies at route and service layers.
- Implement list pagination/filtering across admin and challenge resources.
- Add audit logs for critical actions (issue, revoke, role updates).
- Introduce unit/integration tests for auth, challenge, certificate, verification.
- Add performance smoke checks for heavy read/write endpoints.
- Implement rate limiting and token rotation/expiry strategy.
- Move secrets to environment/config provider patterns.

### 2) Frontend Mastery Track
- Build complete user journey: onboarding → challenge solving → certificate wallet.
- Build public verification UI with clear validity status and metadata.
- Implement consistent API error and loading-state patterns.
- Improve forms with strong client-side validation.
- Add accessibility pass (labels, focus order, keyboard support, contrast).
- Add reusable data fetching/state utilities and standardized hooks.

### 3) Blockchain Mastery Track
- Upgrade contract with issuer allowlist/role checks.
- Add certificate revocation capability.
- Emit events for issuance/revocation/issuer updates.
- Add contract test suite for happy path + permission edge cases.
- Add deployment scripts for local network and testnet.

### 4) DevOps + Production Track
- Create CI pipeline stages: lint → test → build → security scan.
- Ensure backend/frontend/blockchain artifacts can be built in CI.
- Add Docker Compose stack for local end-to-end execution.
- Add environment-based configuration profiles.
- Introduce monitoring dashboards and alerting triggers.
- Write an incident playbook for common failures.

---

## Portfolio-Ready Outcomes
- Public demo instance with sample users and challenges.
- Updated technical docs and architecture diagram.
- API collection for core flows.
- Postmortem/retrospective documenting tradeoffs and lessons.
- Quantified outcomes:
  - Test coverage trend.
  - Endpoint performance trend.
  - Security scan status.
  - Verification reliability metrics.

---

## Project File/Folder Plan

```text
verified-skills-passport/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── challenges/
│   │   ├── certificates/
│   │   ├── verification/
│   │   ├── common/
│   │   └── main.py
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── performance/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── challenges/
│   │   │   ├── wallet/
│   │   │   └── verify/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── blockchain/
│   ├── contracts/
│   │   └── VerifiedSkillsPassport.sol
│   ├── scripts/
│   └── tests/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   └── retrospectives/
├── .github/workflows/
└── docker-compose.yml
```

---

## 12-Week Milestone Checklist

### Phase 1 — Foundation (Weeks 1–3)
- [ ] Define scope boundaries and acceptance criteria.
- [ ] Establish versioned API contracts and shared error model.
- [ ] Repair/standardize frontend package scripts and tooling.
- [ ] Add baseline tests for existing auth/certificate flows.
- [ ] Set up CI skeleton (lint/test/build placeholders).

### Phase 2 — Core Features (Weeks 4–7)
- [ ] Implement challenge CRUD + submission model.
- [ ] Add scoring engine and attempt history endpoints.
- [ ] Build challenge UI and attempt workflow.
- [ ] Issue skills certificates from milestone completion.
- [ ] Create certificate wallet and public verification page.

### Phase 3 — Hardening (Weeks 8–10)
- [ ] Add role/issuer policy enforcement end-to-end.
- [ ] Upgrade smart contract with issuer roles + revocation + events.
- [ ] Add integration tests and contract test coverage.
- [ ] Implement observability (logs/metrics/traces) and alerts.
- [ ] Apply security hardening (rate limits, token lifecycle, CORS).

### Phase 4 — Production (Weeks 11–12)
- [ ] Finalize CI pipeline with security scans.
- [ ] Complete containerized deployment profile.
- [ ] Publish docs, architecture diagram, API collection.
- [ ] Run full regression and performance smoke validation.
- [ ] Ship demo and write project retrospective.

---

## Execution Rhythm
For each milestone:
1. Plan scope and define done criteria.
2. Implement with tests first where possible.
3. Demo the increment.
4. Run retrospective and log one concrete skill improvement target.
