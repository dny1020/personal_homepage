# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Backend (FastAPI)**
```bash
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

**Frontend (static file server)**
```bash
cd frontend && python -m http.server 3000
```

**Install backend dependencies**
```bash
cd backend && pip install -r requirements.txt
```

**Production service management**
```bash
sudo systemctl restart cv-backend   # apply .env changes
sudo journalctl -u cv-backend -f    # tail logs
```

## Architecture

### Dual-page SPA (no build step)

`frontend/app.jsx` is a single-file React app transpiled **in-browser** by Babel standalone (loaded via CDN). There is no npm, no webpack, no build pipeline. The file is served directly by Nginx and executed client-side.

Routing is done via a `useRoute()` hook that reads `window.location.pathname`. Two page components exist:
- `/` → `HomePage` — CV portfolio
- `/bot-ai` → `ServicesPage` — Aethrax enterprise AI services landing page

The `App` component switches between them based on `route.startsWith('/bot-ai')`.

### Data flow

All CV content is stored in `/.env` (project root, not inside `backend/`). The backend reads it at startup via `python-dotenv`. The frontend calls `GET /api/info` and `GET /api/widgets` on load. If the API is unreachable, it falls back to the hardcoded `fallbackData` object at the top of `app.jsx`.

The `/api/widgets` endpoint returns current Bogotá time and live weather (from `open-meteo.com`). Widgets refresh every 10 minutes client-side.

Credly badges are fetched server-side from `CREDLY_BADGES_URL` with a TTL cache (`CREDLY_CACHE_TTL`, default 3600s) to avoid hammering the external API.

### Deployment

- Nginx runs as a Docker container using `frontend/nginx-docker.conf` (proxies `/api/` to the `backend` container)
- FastAPI runs as the `backend` Docker container (port 5000, internal only)
- Both containers are managed by `docker-compose.yml` on the EC2 host
- The `.env` file is never committed to git — it lives only on the EC2 server, written by the CI/CD pipeline from the `APP_ENV` GitHub secret

### Content updates

Edit `/.env` at the project root, then `sudo systemctl restart cv-backend`. Hard-refresh the browser to clear cached assets (cache TTL is 7 days for static files).

### Terraform

`terraform/` contains an AWS spot instance definition (Amazon Linux 2023, `t3.micro`, `us-east-1`). This is infrastructure-as-code for the server, separate from the application deployment.
