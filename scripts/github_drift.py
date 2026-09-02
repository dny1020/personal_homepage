"""Report where frontend/data.json disagrees with the GitHub account.

Usage:
    python scripts/github_drift.py            # human-readable report
    python scripts/github_drift.py --markdown # body for a pull request

Reads the repo list with the `gh` CLI, so it inherits whatever auth `gh` has.
Exits 1 when drift is found, which is what makes it useful in CI.
"""

import argparse
import json
import logging
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "frontend" / "data.json"
ACCOUNT = "dny1020"

# Repos that are deliberately absent from the site. Keep the reason with the name
# so a future reader does not "fix" the omission.
IGNORED = {
    "dny1020": "GitHub profile README, not a project",
    "personal_homepage": "the site itself",
}

# A repo's GitHub language should show up somewhere in the entry's tags. These map
# the language name to the tags that count as evidence of it.
LANGUAGE_TAGS = {
    "Python": {"python", "fastapi", "django", "flask"},
    "JavaScript": {"javascript", "node.js", "fastify", "express", "react"},
    "TypeScript": {"typescript", "node.js", "react"},
    "Go": {"go"},
    "Shell": {"bash", "shell"},
    "HCL": {"terraform"},
}

log = logging.getLogger("github_drift")


def fetch_repos():
    fields = "name,description,primaryLanguage,isPrivate,isFork,isArchived,url"
    try:
        out = subprocess.run(
            ["gh", "repo", "list", ACCOUNT, "--limit", "200", "--json", fields],
            capture_output=True,
            text=True,
            check=True,
            timeout=60,
        ).stdout
    except FileNotFoundError:
        sys.exit("gh CLI not found. Install it or run this where gh is available.")
    except subprocess.CalledProcessError as exc:
        sys.exit(f"gh repo list failed: {exc.stderr.strip()}")
    except subprocess.TimeoutExpired:
        sys.exit("gh repo list timed out")

    try:
        return json.loads(out)
    except json.JSONDecodeError as exc:
        sys.exit(f"gh returned invalid JSON: {exc}")


def find_drift(projects, repos):
    by_name = {r["name"]: r for r in repos}
    linked = {}
    findings = []

    for entry in projects:
        url = entry.get("github", "")
        name = url.rstrip("/").rsplit("/", 1)[-1] if url else ""
        if not name:
            findings.append(("no-link", entry["name"], "entry has no github URL"))
            continue

        repo = by_name.get(name)
        if repo is None:
            findings.append(("missing-repo", entry["name"], f"{url} is not a repo on this account"))
            continue

        linked[name] = entry
        if repo["isArchived"]:
            findings.append(("archived", entry["name"], f"{name} is archived on GitHub"))
        if repo["isPrivate"]:
            findings.append(("private", entry["name"], f"{name} is private, so the link 404s for visitors"))

        language = (repo.get("primaryLanguage") or {}).get("name")
        expected = LANGUAGE_TAGS.get(language)
        if expected:
            tags = {t.lower() for t in entry.get("tags", [])}
            if not tags & expected:
                findings.append((
                    "language",
                    entry["name"],
                    f"GitHub reports {language}, but the tags are {sorted(entry.get('tags', []))}",
                ))

    for repo in repos:
        name = repo["name"]
        if name in linked or name in IGNORED or repo["isPrivate"] or repo["isFork"]:
            continue
        if repo["isArchived"]:
            continue
        findings.append(("unlisted", name, repo.get("description") or "no description on GitHub"))

    return findings


HEADINGS = {
    "language": "Tags contradict the repository language",
    "missing-repo": "Linked repository does not exist",
    "private": "Linked repository is private",
    "archived": "Linked repository is archived",
    "no-link": "Project entry has no repository link",
    "unlisted": "Public repositories not on the site",
}


def render(findings, markdown):
    if not findings:
        return "data.json and GitHub agree."

    lines = []
    for kind, heading in HEADINGS.items():
        group = [f for f in findings if f[0] == kind]
        if not group:
            continue
        lines.append(f"### {heading}" if markdown else f"{heading}:")
        for _, subject, detail in group:
            lines.append(f"- **{subject}** — {detail}" if markdown else f"  - {subject}: {detail}")
        lines.append("")

    if markdown:
        lines.append(
            "Descriptions on the site are hand-written prose. This report says what "
            "disagrees; it deliberately does not write the copy."
        )
    return "\n".join(lines).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--markdown", action="store_true", help="format for a pull request body")
    args = parser.parse_args()

    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format="%(levelname)s %(message)s",
    )

    try:
        data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        sys.exit(f"cannot read {DATA_PATH}: {exc}")

    repos = fetch_repos()
    log.info("checked %d projects against %d repos", len(data.get("projects", [])), len(repos))

    findings = find_drift(data.get("projects", []), repos)
    print(render(findings, args.markdown))
    sys.exit(1 if findings else 0)


if __name__ == "__main__":
    main()
