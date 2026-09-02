# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **technical peers — VoIP, DevOps, and infrastructure engineers**, typically arriving from GitHub, a community thread, or a shared link. They are not screening a candidate against a job description; they are judging whether the work is real. They read code, follow repo links, poke at live endpoints, and lose interest fast at anything that smells like a template CV.

Recruiters and prospective consulting clients also land here, but the page is not tuned for the recruiter skim. They are served by the same evidence, plus the downloadable CV.

## Product Purpose

`danilocloud.me` is Jose Danilo Narvaez Arias's personal site: a single-page CV portfolio at the root of a domain that also hosts his real self-hosted services.

Success is **credibility, then follow**: a visiting engineer leaves convinced the VoIP/infrastructure/AI depth is genuine, and ends up on GitHub, LinkedIn, or one of the live services. Immediate contact is welcome but is not the measure — the site's job is to be believed and to be worth tracking.

## Positioning

The domain is itself the argument. `danilocloud.me` is not a hosting product's subdomain — it is a domain whose owner runs the infrastructure under it: a WebRTC contact-center stack on `webrtc.danilocloud.me`, an API on `coffee.danilocloud.me`, a Raspberry Pi homelab behind them, and the site itself deployed by Terraform-provisioned S3 + GitHub Actions.

**This argument is currently unverifiable from outside.** Both service subdomains return NXDOMAIN in public DNS (checked 2026-09-01 against 1.1.1.1); they resolve only on the owner's own network. The apex `danilocloud.me` is public and Cloudflare-fronted. Until those records exist publicly, the positioning rests on the repositories and the site's own deployment, not on reachable services.

Content: 13+ years in IT, 6+ in VoIP engineering, all at the same telephony operator (EMTELCO) — depth in one domain rather than breadth across many, now extending into AI. A neighboring portfolio can copy the layout; it cannot copy a working SIP/WebRTC stack the visitor can dial into.

## Operating Context

- Visitors arrive on desktop and mobile, often from a link with no prior context about who Danilo is.
- Peers evaluate by leaving: they open GitHub, read source, hit an endpoint. Outbound links are part of the experience, not a leak.
- The site is the public face of a personal infrastructure that the owner also uses daily (Forgejo, Vaultwarden, Immich, MinIO, AdGuard, WireGuard, behind nginx on a Raspberry Pi 4).
- Content updates are a `data.json` edit plus a push to `main`; the downloadable `resume.pdf` is regenerated from that same file by a Python script.

## Capabilities and Constraints

**Confirmed content model.** All CV content lives in `frontend/data.json` and is fetched at runtime: name, role, bio, stats, experience, education, skills (6 categories), languages, certifications, Credly badges, achievements, projects, contact. `frontend/resume.pdf` is generated from it via `scripts/generate_resume.py`.

**Buildless stack is binding.** Single-file `frontend/app.jsx` (React 18 UMD from CDN), transpiled once by Babel CLI to `app.js`, plus plain CSS. No bundler, no npm project, no framework migration. Static files served from S3 behind Cloudflare. Any future work must fit this shape.

**The webchat widget is removed, not abandoned.** `https://webrtc.danilocloud.me/webchat.js` used to load on every page. It is Danilo's own WebRTC contact-center stack, not a third-party chat tool, and it remains the intended live demonstration of the telephony work the CV describes. It was removed from `index.html` on 2026-09-01 because the subdomain does not resolve publicly, so every external visit fired a request that failed silently. Restore it — the commented placeholder in `index.html` marks the spot — once the DNS record is public.

**Third-party runtime dependencies** currently in the page: React UMD from unpkg, Google Fonts (Archivo, JetBrains Mono), Credly badge images, and the open-meteo weather API. There is no LinkedIn badge script.

**Client-side widgets.** Bogotá local time (`Intl.DateTimeFormat`) and live weather (open-meteo, no auth) are computed in the browser, configured by `WIDGET_CONFIG` in `app.jsx`.

**Open decision — Spanish.** The site is English-only today and stays that way for now. A Spanish version is a real intent, not a current requirement: future work should avoid architecting in a way that makes EN/ES impossible, but must not ship a half-built language toggle.

**Resolved 2026-09-01 — no demo links remain.** All four project entries previously carried a `demo` value that went nowhere: three literal `"#"` placeholders, and the Coffee Tracker's `coffee.danilocloud.me` endpoint, which is unreachable from the public internet. All four were removed. Each project now offers exactly one link, to its public GitHub repository. Do not reintroduce a `demo` value until the target is verified reachable from outside the owner's network.

## Brand Commitments

- Name and identity: Jose Danilo Narvaez Arias, Bogotá, Colombia. Domain `danilocloud.me`.
- Real photograph exists (`frontend/IMG_2164.jpg`) and is used as the avatar.
- Voice in existing copy is plain, technical, first-person-adjacent, and free of marketing inflation ("Self-hoster and privacy advocate"). Keep it. No superlatives the work does not earn.
- Self-hosting and privacy are stated positions, not decoration.

## Evidence on Hand

Real and verifiable:

- **Five public GitHub repos** under `github.com/dny1020` — `doction` (MIT-licensed FastAPI/PostgreSQL/MCP wiki), `pulse_bogota` (FastAPI/PostgreSQL activity scoring with Alembic, scheduler, OSM imports), `bot_whatsapp` (RAG + Llama 3 via Groq + Twilio), `coffee-tracker` (FastAPI/SQLite), `rag_without_llm` (pgvector + HF embeddings + cross-encoder reranking, Streamlit UI). The source is the proof — a peer reads it.
- **Self-hosted services** that exist but are **not publicly reachable**: the WebRTC webchat stack (`webrtc.danilocloud.me`) and the Coffee Tracker API (`coffee.danilocloud.me/api/v1`). Both are NXDOMAIN in public DNS as of 2026-09-01. They are real and they are the strongest available evidence, but until the DNS records are public they cannot be linked or embedded — a link to either is a broken promise, not a demonstration. Exposing one is the single highest-value change available to this product.
- **The homelab itself** — a Raspberry Pi 4 (arm64, 8 GB, Ubuntu 22.04) running fifteen containers behind nginx: Forgejo, Vaultwarden, Immich, MinIO, AdGuard, Uptime Kuma, doction and its Postgres, WireGuard. Every nginx vhost is guarded `allow 10.0.5.0/24; allow 10.13.13.0/24; deny all`, so nothing is publicly reachable by design. TLS is a Let's Encrypt wildcard for `*.danilocloud.me`, renewed by certbot over the Cloudflare DNS-01 challenge. It must be *shown* (described, diagrammed, evidenced), never linked to something that 404s.
- **Credly badges** with live issuer URLs: AWS Cloud Essentials, Cisco CyberOps Associate, Introduction to Cybersecurity, Networking Academy Learn-A-Thon 2023.
- **LinkedIn** profile, embedded as an official badge.
- **`resume.pdf`**, generated from `data.json`. A Spanish CV also exists in the repo root (`Curriculum vitae_spanish.docx/.pdf`) but is not published.

Absences future work must not fabricate: no testimonials, no client case studies, no press, no uptime/traffic/performance metrics, no revenue or team-size claims, no certifications beyond those listed. English level is B1 (intermediate) and is stated as such.

## Product Principles

1. **Evidence over assertion.** For this audience, a working link, a readable repo, or a reachable endpoint is worth more than any claim about skill. When there is nothing real to link, say less rather than decorating.
2. **The infrastructure is the portfolio.** The site runs on the same stack it describes. Anything that undercuts that — a dead demo link, a broken widget, a third-party service standing in for something he could self-host — costs more credibility than it buys.
3. **Depth in one domain, honestly dated.** Six years of VoIP at one operator, and since Aug 2026 an AI & Automation Developer role at the same operator, backed by a completed UNIR AI specialization (Jun 2025 - Jun 2026). Present it as specialization, not as a breadth checklist; the AI track is early and should not be inflated.
4. **A peer's read path is outward.** Make leaving easy and rewarding — to GitHub, to a live service, to the CV. The page succeeds when the visitor keeps track of the work, not when they stay on it.
5. **Boring, buildless, maintainable.** Content changes are a JSON edit and a push. Whatever gets built must still be editable that way a year from now.
