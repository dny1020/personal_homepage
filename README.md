# Personal Homepage — danilocloud.me

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)

CV portfolio + Aethrax AI services landing page. FastAPI backend, in-browser React frontend, served by a shared Nginx container.

## Architecture

```
personal_homepage/
├── frontend/           # Static React app (Babel in-browser, no build step)
│   ├── index.html
│   ├── app.jsx
│   └── styles.css
├── backend/            # FastAPI — reads .env, exposes /api/info /api/widgets
│   ├── main.py
│   └── requirements.txt
├── nginx/
│   ├── Dockerfile      # Builds shared nginx image (context: project root)
│   └── conf.d/
│       └── homepage.conf   # danilocloud.me — add more .conf files here for new sites
├── terraform/          # AWS spot instance (t3.micro, us-east-1)
├── docker-compose.yml
└── .env                # Never committed — written by CI/CD from APP_ENV secret
```

## Routing

| Path | Handler |
|---|---|
| `/` | `HomePage` (CV portfolio) |
| `/bot-ai` | `ServicesPage` (Aethrax landing) |
| `/api/*` | Proxied to `backend:5000` |

## Local development

```bash
# Backend
cd backend && pip install -r requirements.txt
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 5000

# Frontend
cd frontend && python -m http.server 3000
```

## Deployment

Push to `main` → GitHub Actions:

1. Updates Cloudflare DNS A record to the EC2 IP
2. SCPs `frontend/`, `backend/`, `nginx/`, `docker-compose.yml` to EC2
3. Runs `certbot` (DNS-01 via Cloudflare) for SSL
4. `docker compose up -d --build`

Required GitHub secrets: `EC2_HOST`, `EC2_SSH_KEY`, `APP_ENV`, `CF_DNS_API_TOKEN`, `CF_ZONE_ID`.

## Content updates

Edit `/.env` on the EC2 host, then:

```bash
sudo docker compose up -d --build   # in ~/app
```

Hard-refresh the browser (Ctrl+F5) to bypass the 7-day static asset cache.

## Adding a new site to Nginx

1. Create `nginx/conf.d/<project>.conf` with the `server_name` and proxy rules
2. Add the new backend service to `docker-compose.yml`
3. Push — CI/CD rebuilds the nginx container with all configs loaded

## SSL

Certificates are issued by Certbot (DNS-01 challenge, Cloudflare) and stored at `/etc/letsencrypt` on the host, mounted read-only into the nginx container.
