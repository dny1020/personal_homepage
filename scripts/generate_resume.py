"""Generate frontend/resume.pdf from frontend/data.json.

Usage:
    uv run --with fpdf2 python scripts/generate_resume.py

Run this after editing frontend/data.json so the downloadable CV
stays in sync with the site content.

Layout: a dark sidebar (photo, contact, skills, languages, certifications)
next to a white column (profile, experience, education, projects).
"""

import json
from datetime import datetime, timezone
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "frontend" / "data.json"
PHOTO_PATH = ROOT / "assets" / "IMG_2164.jpg"
OUTPUT_PATH = ROOT / "frontend" / "resume.pdf"

NAVY = (35, 51, 69)
TEAL = (94, 205, 193)
DEEP_TEAL = (15, 118, 110)
INK = (20, 24, 33)
GRAY = (108, 117, 130)
SIDEBAR_TEXT = (214, 221, 228)
SIDEBAR_RULE = (86, 104, 124)
RULE = (200, 205, 212)
WHITE = (255, 255, 255)

PAGE_W = 210
PAGE_H = 297
SIDEBAR_W = 72
PAD = 9
SIDEBAR_TEXT_W = SIDEBAR_W - 2 * PAD
MAIN_X = SIDEBAR_W + 10
MAIN_W = PAGE_W - MAIN_X - 14
TOP = 14

SKILL_LABELS = {
    "languages": "Languages",
    "infrastructure": "Infrastructure",
    "telephony": "Telephony & VoIP",
    "cloud_devops": "Cloud & DevOps",
    "ai_data": "AI & Data",
    "tools": "Tools",
}

# Dots drawn next to each language. Anything unlisted gets three.
LANGUAGE_DOTS = {"Native": 5, "Intermediate (B1)": 3}


class ResumePDF(FPDF):
    def header(self) -> None:
        self.set_fill_color(*NAVY)
        self.rect(0, 0, SIDEBAR_W, PAGE_H, style="F")

    # --- sidebar ---------------------------------------------------------

    def sidebar_title(self, title: str) -> None:
        self.ln(3)
        self.set_x(PAD)
        self.set_font("helvetica", "B", 9.5)
        self.set_text_color(*TEAL)
        self.cell(SIDEBAR_TEXT_W, 5, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*SIDEBAR_RULE)
        self.set_line_width(0.25)
        y = self.get_y() + 0.5
        self.line(PAD, y, SIDEBAR_W - PAD, y)
        self.ln(2.5)

    def sidebar_text(self, text: str, size: float = 8, style: str = "", color=SIDEBAR_TEXT) -> None:
        self.set_x(PAD)
        self.set_font("helvetica", style, size)
        self.set_text_color(*color)
        self.multi_cell(SIDEBAR_TEXT_W, 4.2, text, align="L", new_x="LMARGIN", new_y="NEXT")

    def sidebar_space(self, height: float) -> None:
        """Move to the next page's sidebar when the current one is full."""
        if self.get_y() + height <= PAGE_H - 12:
            return
        if self.page < len(self.pages):
            self.page += 1
        else:
            self.add_page()
        self.set_xy(PAD, TOP)

    def dots(self, filled: int, total: int = 5) -> None:
        y = self.get_y() + 1.2
        x = PAD
        for i in range(total):
            self.set_fill_color(*(TEAL if i < filled else SIDEBAR_RULE))
            self.ellipse(x, y, 1.8, 1.8, style="F")
            x += 3
        self.ln(4.5)

    # --- main column -----------------------------------------------------

    def section_title(self, title: str) -> None:
        self.keep_together(14)
        self.ln(3)
        self.set_font("helvetica", "B", 12)
        self.set_text_color(*NAVY)
        self.cell(MAIN_W, 6.5, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*RULE)
        self.set_line_width(0.3)
        y = self.get_y() + 0.3
        self.line(MAIN_X, y, PAGE_W - 14, y)
        self.ln(2.5)

    def entry(self, heading: str, subheading: str, period: str, body: str) -> None:
        self.keep_together(22)
        self.set_font("helvetica", "B", 10)
        self.set_text_color(*INK)
        period_w = 34
        self.cell(MAIN_W - period_w, 5.2, heading)
        self.set_font("helvetica", "", 8)
        self.set_text_color(*GRAY)
        self.cell(period_w, 5.2, period, align="R", new_x="LMARGIN", new_y="NEXT")
        if subheading:
            self.set_font("helvetica", "I", 9)
            self.set_text_color(*DEEP_TEAL)
            self.cell(MAIN_W, 4.6, subheading, new_x="LMARGIN", new_y="NEXT")
        if body:
            self.set_font("helvetica", "", 8.5)
            self.set_text_color(*INK)
            self.multi_cell(MAIN_W, 4.2, body, align="L", new_x="LMARGIN", new_y="NEXT")
        self.ln(2.5)

    def keep_together(self, height: float) -> None:
        if self.get_y() + height > PAGE_H - 16:
            self.add_page()


def build_sidebar(pdf: ResumePDF, data: dict) -> None:
    pdf.set_auto_page_break(auto=False)
    pdf.set_margins(PAD, TOP, PAD)
    pdf.page = 1

    diameter = 42
    photo_x = (SIDEBAR_W - diameter) / 2
    with pdf.elliptic_clip(photo_x, TOP, diameter, diameter):
        # The photo is landscape: scale it to the circle's height and centre it.
        pdf.image(str(PHOTO_PATH), x=SIDEBAR_W / 2 - diameter * 2078 / 1704 / 2, y=TOP, h=diameter)
    pdf.set_y(TOP + diameter + 4)

    contact = data.get("contact", {})
    pdf.sidebar_title("Contact")
    for line in [
        data.get("location", ""),
        contact.get("email", ""),
        contact.get("linkedin", "").replace("https://www.linkedin.com/", "").strip("/"),
        contact.get("github", "").replace("https://", ""),
    ]:
        if line:
            pdf.sidebar_text(line)

    skills = data.get("skills", {})
    if skills:
        pdf.sidebar_title("Skills")
        for key, items in skills.items():
            if items:
                pdf.sidebar_space(12)
                pdf.sidebar_text(SKILL_LABELS.get(key, key.title()), 8, "B", TEAL)
                pdf.sidebar_text(" \u00b7 ".join(items), 7.5)
                pdf.ln(1)

    langs = data.get("languages", [])
    if langs:
        pdf.sidebar_title("Languages")
        for lang in langs:
            pdf.sidebar_space(14)
            pdf.sidebar_text(lang["language"], 8, "B", WHITE)
            pdf.dots(LANGUAGE_DOTS.get(lang["level"], 3))
            pdf.set_x(PAD)
            pdf.sidebar_text(lang["level"], 7, "", SIDEBAR_TEXT)
            pdf.ln(1)

    certs = data.get("certifications", []) + [
        {"name": b["name"], "issuer": b["issuer"], "date": b.get("issued", "")}
        for b in data.get("badges", [])
    ]
    if certs:
        pdf.sidebar_title("Certifications")
        for cert in certs:
            pdf.sidebar_space(11)
            pdf.sidebar_text(cert["name"], 7.5, "B", WHITE)
            issuer = cert["issuer"]
            date = cert.get("date", "")
            pdf.sidebar_text(f"{issuer} \u00b7 {date[:4]}" if date else issuer, 7)
            pdf.ln(0.8)


def build_main(pdf: ResumePDF, data: dict) -> None:
    pdf.set_margins(MAIN_X, TOP, 14)
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_xy(MAIN_X, TOP)

    pdf.set_font("helvetica", "B", 21)
    pdf.set_text_color(*NAVY)
    pdf.multi_cell(MAIN_W, 9, data["name"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*DEEP_TEAL)
    pdf.multi_cell(MAIN_W, 4.8, data["role"], align="L", new_x="LMARGIN", new_y="NEXT")

    pdf.section_title("Professional Profile")
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(*INK)
    pdf.multi_cell(MAIN_W, 4.4, data.get("bio", ""), align="L", new_x="LMARGIN", new_y="NEXT")

    pdf.section_title("Professional Experience")
    for exp in data.get("experience", []):
        pdf.entry(exp["title"], exp["company"], exp["period"], exp.get("description", ""))

    pdf.section_title("Education")
    for edu in data.get("education", []):
        pdf.entry(edu["degree"], edu["school"], edu["period"], edu.get("description", ""))

    projects = data.get("projects", [])
    if projects:
        pdf.section_title("Featured Projects")
        for project in projects:
            pdf.keep_together(20)
            pdf.set_font("helvetica", "B", 9.5)
            pdf.set_text_color(*INK)
            pdf.cell(MAIN_W, 4.8, project["name"], new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("helvetica", "", 8.5)
            pdf.multi_cell(MAIN_W, 4.2, project["description"], align="L", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("helvetica", "I", 7.5)
            pdf.set_text_color(*DEEP_TEAL)
            pdf.cell(MAIN_W, 4.2, " \u00b7 ".join(project.get("tags", [])), new_x="LMARGIN", new_y="NEXT")
            if project.get("github"):
                pdf.set_font("helvetica", "", 7.5)
                pdf.set_text_color(*GRAY)
                pdf.cell(
                    MAIN_W,
                    4,
                    project["github"].replace("https://", ""),
                    new_x="LMARGIN",
                    new_y="NEXT",
                )
            pdf.ln(2)


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    pdf = ResumePDF(format="A4")
    # Pin the timestamp so regenerating unchanged data produces an identical file,
    # which is what lets CI detect a stale PDF by hash.
    pdf.set_creation_date(datetime(2020, 1, 1, tzinfo=timezone.utc))
    pdf.add_page()

    build_main(pdf, data)
    build_sidebar(pdf, data)

    pdf.output(str(OUTPUT_PATH))
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
