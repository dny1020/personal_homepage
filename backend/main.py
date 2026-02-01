from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json

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

def get_cv_data():
    """Centralized CV data retrieval"""
    return {
        "name": os.getenv("NAME", "Your Name"),
        "role": os.getenv("ROLE", "Your Role"),
        "location": os.getenv("LOCATION", "Your Location"),
        "bio": os.getenv("BIO", "Your bio goes here"),
        "experience": parse_json_env("EXPERIENCE", []),
        "education": parse_json_env("EDUCATION", []),
        "achievements": parse_json_env("ACHIEVEMENTS", []),
        "projects": parse_json_env("PROJECTS", []),
        "repositories": parse_json_env("REPOSITORIES", []),
        "contact": parse_json_env("CONTACT", {}),
        "footer": os.getenv("FOOTER", f"© 2025 {os.getenv('NAME', 'Your Name')}. All rights reserved.")
    }

@app.get("/")
def root():
    return {"message": "CV Portfolio API is running"}

@app.get("/info")
def info():
    """Main info endpoint (called by frontend)"""
    return get_cv_data()

@app.get("/api/info")
def api_info():
    """API info endpoint (alternative route)"""
    return get_cv_data()

@app.get("/health")
def health():
    return {"status": "healthy"}

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
