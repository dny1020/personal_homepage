"""Render what the LinkedIn profile should say, straight from frontend/data.json.

Usage:
    python scripts/linkedin_checklist.py

LinkedIn publishes no write API for personal profiles, so this leg cannot be
automated. What it can do is state the expected value for every field that is
comparable, so reconciling the profile is reading down a list instead of
remembering what changed. Work through it in the browser.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "frontend" / "data.json"
SITE = "https://danilocloud.me"


def section(title):
    print(f"\n{title}")
    print("-" * len(title))


def main():
    try:
        data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        sys.exit(f"cannot read {DATA_PATH}: {exc}")

    experience = data.get("experience", [])
    current = experience[0] if experience else {}

    print("LinkedIn should match the following. Anything else on the profile is drift.")

    section("Headline")
    print(f"  {current.get('title', '?')} at {current.get('company', '?')}")

    section("Experience")
    for role in experience:
        print(f"  {role.get('title', '?')}")
        print(f"    {role.get('company', '?')}  ·  {role.get('period', '?')}")

    section("Education")
    for edu in data.get("education", []):
        print(f"  {edu.get('degree', '?')}")
        print(f"    {edu.get('school', '?')}  ·  {edu.get('period', '?')}")

    section("Languages")
    for lang in data.get("languages", []):
        print(f"  {lang.get('language', '?')}: {lang.get('level', '?')}")

    section("Projects")
    for project in data.get("projects", []):
        print(f"  {project.get('name', '?')}  —  {project.get('github', 'no link')}")

    section("Featured")
    print(f"  {SITE}")
    for project in data.get("projects", [])[:2]:
        print(f"  {project.get('github', '')}")

    section("Cannot be checked from here")
    print("  Duplicate entries, section ordering, and the About text have no")
    print("  counterpart in data.json. Read the profile for those.")
    print()


if __name__ == "__main__":
    main()
