from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

# CORS middleware for development
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

@app.get("/")
def root():
    return {"message": "CV Portfolio API is running"}

@app.get("/api/info")
def info():
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
        "footer": os.getenv("FOOTER", f"© 2024 {os.getenv('NAME', 'Your Name')}. All rights reserved.")
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

