from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from dotenv import load_dotenv
from datetime import datetime
from zoneinfo import ZoneInfo
import httpx
import time

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_json_env(key, default=None):
    """Parse JSON from environment variable"""
    value = os.getenv(key)
    if value:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return default
    return default

_CREDLY_CACHE = {"expires_at": 0.0, "badges": None}

async def get_credly_badges():
    badges_env = parse_json_env("BADGES", []) or []
    credly_url = os.getenv("CREDLY_BADGES_URL", "")
    credly_ids = parse_json_env("CREDLY_BADGE_IDS", []) or []
    ttl = int(os.getenv("CREDLY_CACHE_TTL", "3600"))

    if not credly_url:
        return badges_env

    now = time.time()
    if _CREDLY_CACHE["badges"] is not None and _CREDLY_CACHE["expires_at"] > now:
        return _CREDLY_CACHE["badges"]

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(credly_url)
            response.raise_for_status()
            payload = response.json()
    except Exception:
        return badges_env

    items = payload.get("data", []) if isinstance(payload, dict) else []
    mapped = []
    for item in items:
        template = item.get("badge_template", {}) or {}
        issuer = ""
        issuer_info = template.get("issuer", {}) or {}
        entities = issuer_info.get("entities", []) if isinstance(issuer_info, dict) else []
        if entities:
            issuer = entities[0].get("entity", {}).get("name", "")
        mapped.append({
            "id": item.get("id"),
            "name": template.get("name") or item.get("name"),
            "issuer": issuer or item.get("issuer", {}).get("summary", ""),
            "issued": item.get("issued_at_date") or item.get("issued_at"),
            "image": item.get("image_url") or template.get("image_url"),
            "url": template.get("url") or item.get("url")
        })

    if credly_ids:
        order = {bid: idx for idx, bid in enumerate(credly_ids)}
        mapped = [b for b in mapped if b.get("id") in order]
        mapped.sort(key=lambda b: order.get(b.get("id"), 0))

    if not mapped:
        mapped = badges_env

    _CREDLY_CACHE["badges"] = mapped
    _CREDLY_CACHE["expires_at"] = now + max(ttl, 60)
    return mapped

async def get_cv_data():
    """Centralized CV data retrieval"""
    return {
        "name": os.getenv("NAME", "Your Name"),
        "role": os.getenv("ROLE", "Your Role"),
        "location": os.getenv("LOCATION", "Your Location"),
        "bio": os.getenv("BIO", "Your bio goes here"),
        "profileOverview": os.getenv("PROFILE_OVERVIEW", ""),
        "avatarUrl": os.getenv("AVATAR_URL", ""),
        "stats": parse_json_env("STATS", []),
        "experience": parse_json_env("EXPERIENCE", []),
        "education": parse_json_env("EDUCATION", []),
        "skills": parse_json_env("SKILLS", {}),
        "certifications": parse_json_env("CERTIFICATIONS", []),
        "badges": await get_credly_badges(),
        "testimonials": parse_json_env("TESTIMONIALS", []),
        "awards": parse_json_env("AWARDS", []),
        "achievements": parse_json_env("ACHIEVEMENTS", []),
        "projects": parse_json_env("PROJECTS", []),
        "repositories": parse_json_env("REPOSITORIES", []),
        "contact": parse_json_env("CONTACT", {}),
        "footer": os.getenv("FOOTER", f"© 2025 {os.getenv('NAME', 'Your Name')}. All rights reserved.")
    }

def get_widget_config():
    return {
        "timezone": os.getenv("TIMEZONE", "America/Bogota"),
        "city": os.getenv("WEATHER_CITY", "Bogotá"),
        "lat": os.getenv("WEATHER_LAT", "4.7110"),
        "lon": os.getenv("WEATHER_LON", "-74.0721"),
        "temperature_unit": os.getenv("WEATHER_TEMP_UNIT", "celsius"),
        "wind_speed_unit": os.getenv("WEATHER_WIND_UNIT", "kmh")
    }

async def get_weather_snapshot():
    config = get_widget_config()
    params = {
        "latitude": config["lat"],
        "longitude": config["lon"],
        "current": "temperature_2m,weather_code,wind_speed_10m",
        "temperature_unit": config["temperature_unit"],
        "wind_speed_unit": config["wind_speed_unit"],
        "timezone": config["timezone"]
    }
    url = "https://api.open-meteo.com/v1/forecast"
    async with httpx.AsyncClient(timeout=8.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
    current = data.get("current", {}) if isinstance(data, dict) else {}
    units = data.get("current_units", {}) if isinstance(data, dict) else {}
    return {
        "temperature": current.get("temperature_2m"),
        "temperature_unit": units.get("temperature_2m", "°C"),
        "wind_speed": current.get("wind_speed_10m"),
        "wind_speed_unit": units.get("wind_speed_10m", "km/h"),
        "weather_code": current.get("weather_code"),
        "observed_at": current.get("time")
    }

@app.get("/")
def root():
    return {"message": "CV Portfolio API is running"}

@app.get("/info")
async def info():
    """Main info endpoint (called by frontend)"""
    return await get_cv_data()

@app.get("/api/info")
async def api_info():
    """API info endpoint (alternative route)"""
    return await get_cv_data()

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/widgets")
async def widgets():
    config = get_widget_config()
    tz = ZoneInfo(config["timezone"])
    now = datetime.now(tz)
    weather = None
    try:
        weather = await get_weather_snapshot()
    except Exception:
        weather = None
    return {
        "time": now.isoformat(),
        "timezone": config["timezone"],
        "city": config["city"],
        "weather": weather
    }

@app.get("/api/debug/env")
def debug_env():
    """Debug endpoint to check environment variables"""
    return {
        "env_loaded": {
            "NAME": bool(os.getenv("NAME")),
            "ROLE": bool(os.getenv("ROLE")),
            "BIO": bool(os.getenv("BIO")),
            "EXPERIENCE": bool(os.getenv("EXPERIENCE")),
        },
        "sample_values": {
            "NAME": os.getenv("NAME", "NOT_SET")[:20] if os.getenv("NAME") else "NOT_SET",
            "ROLE": os.getenv("ROLE", "NOT_SET")[:20] if os.getenv("ROLE") else "NOT_SET",
        }
    }
