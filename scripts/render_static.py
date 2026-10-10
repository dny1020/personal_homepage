"""Inject a plain-HTML copy of the CV into frontend/index.html.

Usage:
    uv run python scripts/render_static.py

The site renders client-side, so fetchers that don't run JavaScript
(curl, link unfurlers, LLM crawlers) only see the <head>. This renders
frontend/data.json into #root. React replaces it on mount, and a script in
<head> hides it until then; <noscript> isn't used because readability-based
extractors drop it. CI runs it on the deploy copy; don't commit the result.
"""

import json
import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "frontend" / "data.json"
INDEX_PATH = ROOT / "frontend" / "index.html"
MARKER = '<div id="root"></div>'

SKILL_LABELS = {
    "languages": "Languages",
    "infrastructure": "Infrastructure",
    "telephony": "Telephony & VoIP",
    "cloud_devops": "Cloud & DevOps",
    "ai_data": "AI & Data",
    "tools": "Tools",
}


def link(url: str, text: str) -> str:
    return f'<a href="{escape(url)}">{escape(text)}</a>'


def render(data: dict) -> str:
    out = [
        f"<h1>{escape(data['name'])}</h1>",
        f"<p>{escape(data['role'])} · {escape(data['location'])}</p>",
        f"<p>{escape(data['bio'])}</p>",
        "<h2>Projects</h2>",
    ]
    for p in data.get("projects", []):
        name = link(p["github"], p["name"]) if p.get("github") else escape(p["name"])
        out.append(f"<h3>{name}</h3><p>{escape(p['description'])}</p>")

    out.append("<h2>Experience</h2>")
    for e in data.get("experience", []):
        out.append(
            f"<h3>{escape(e['title'])} · {escape(e['company'])} · {escape(e['period'])}</h3>"
            f"<p>{escape(e['description'])}</p>"
        )

    out.append("<h2>Skills</h2><ul>")
    for key, items in data.get("skills", {}).items():
        label = SKILL_LABELS.get(key, key)
        out.append(f"<li>{escape(label)}: {escape(', '.join(items))}</li>")
    out.append("</ul>")

    out.append("<h2>Education</h2>")
    for e in data.get("education", []):
        out.append(
            f"<h3>{escape(e['degree'])} · {escape(e['school'])} · {escape(e['period'])}</h3>"
            f"<p>{escape(e.get('description', ''))}</p>"
        )

    out.append("<h2>Certifications</h2><ul>")
    for c in data.get("certifications", []):
        out.append(
            f"<li>{escape(c['name'])} · {escape(c['issuer'])} · {escape(c['date'])}</li>"
        )
    out.append("</ul>")

    contact = data.get("contact", {})
    out.append("<h2>Contact</h2><ul>")
    if contact.get("email"):
        out.append(f"<li>{link('mailto:' + contact['email'], contact['email'])}</li>")
    for key in ("linkedin", "github"):
        if contact.get(key):
            out.append(f"<li>{link(contact[key], contact[key])}</li>")
    if data.get("resumeUrl"):
        out.append(f"<li>{link(data['resumeUrl'], 'Resume (PDF)')}</li>")
    out.append("</ul>")

    return "\n".join(out)


def main() -> None:
    try:
        data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
        index = INDEX_PATH.read_text(encoding="utf-8")
    except (OSError, json.JSONDecodeError) as exc:
        sys.exit(f"render_static: {exc}")

    if index.count(MARKER) != 1:
        sys.exit(f"render_static: expected exactly one {MARKER} in {INDEX_PATH}")

    block = f'<div id="root"><div class="prerender">\n{render(data)}\n</div></div>'
    try:
        INDEX_PATH.write_text(index.replace(MARKER, block), encoding="utf-8")
    except OSError as exc:
        sys.exit(f"render_static: {exc}")


if __name__ == "__main__":
    main()
