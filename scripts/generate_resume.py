"""Generate frontend/resume.pdf from frontend/data.json.

Usage:
    uv run --with fpdf2 python scripts/generate_resume.py

Run this after editing frontend/data.json so the downloadable CV
stays in sync with the site content.
"""

import json
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "frontend" / "data.json"
OUTPUT_PATH = ROOT / "frontend" / "resume.pdf"

INK = (20, 24, 33)
TEAL = (15, 118, 110)
GRAY = (108, 117, 130)
LIGHT_GRAY = (200, 205, 212)

MARGIN = 16
PAGE_WIDTH = 210 - 2 * MARGIN


class ResumePDF(FPDF):
    def section_title(self, title: str) -> None:
        if self.get_y() > 260:
            self.add_page()
        self.ln(3)
        self.set_font("helvetica", "B", 11)
        self.set_text_color(*TEAL)
        self.cell(0, 6, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*LIGHT_GRAY)
        self.set_line_width(0.3)
        self.line(MARGIN, self.get_y(), 210 - MARGIN, self.get_y())
        self.ln(2.5)

    def entry(self, heading: str, subheading: str, period: str, body: str) -> None:
        if self.get_y() > 250:
            self.add_page()
        self.set_font("helvetica", "B", 10.5)
        self.set_text_color(*INK)
        period_width = 42
        self.cell(PAGE_WIDTH - period_width, 5.5, heading)
        self.set_font("helvetica", "", 9)
        self.set_text_color(*GRAY)
        self.cell(period_width, 5.5, period, align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(*TEAL)
        self.cell(0, 5, subheading, new_x="LMARGIN", new_y="NEXT")
        if body:
            self.set_font("helvetica", "", 9)
            self.set_text_color(*INK)
            self.multi_cell(PAGE_WIDTH, 4.4, body)
        self.ln(2.5)

    def label_line(self, label: str, text: str) -> None:
        self.set_font("helvetica", "B", 9)
        self.set_text_color(*INK)
        self.cell(38, 4.8, label)
        self.set_font("helvetica", "", 9)
        self.multi_cell(PAGE_WIDTH - 38, 4.8, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(0.5)


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    pdf = ResumePDF(format="A4")
    pdf.set_margins(MARGIN, MARGIN, MARGIN)
    pdf.set_auto_page_break(auto=True, margin=MARGIN)
    pdf.add_page()

    # Header
    pdf.set_font("helvetica", "B", 20)
    pdf.set_text_color(*INK)
    pdf.cell(0, 9, data["name"], new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 10.5)
    pdf.set_text_color(*TEAL)
    pdf.cell(0, 5.5, data["role"], new_x="LMARGIN", new_y="NEXT")
    contact = data.get("contact", {})
    contact_line = "  |  ".join(
        part
        for part in [
            data.get("location", ""),
            contact.get("email", ""),
            contact.get("linkedin", "").replace("https://www.", ""),
            contact.get("github", "").replace("https://", ""),
        ]
        if part
    )
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 5, contact_line, new_x="LMARGIN", new_y="NEXT")

    # Summary
    pdf.section_title("Summary")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*INK)
    pdf.multi_cell(PAGE_WIDTH, 4.6, data.get("bio", ""))

    # Experience
    pdf.section_title("Professional Experience")
    for exp in data.get("experience", []):
        pdf.entry(exp["title"], exp["company"], exp["period"], exp.get("description", ""))

    # Education
    pdf.section_title("Education")
    for edu in data.get("education", []):
        pdf.entry(edu["degree"], edu["school"], edu["period"], edu.get("description", ""))

    # Skills
    pdf.section_title("Technical Skills")
    skill_labels = {
        "languages": "Languages",
        "infrastructure": "Infrastructure",
        "telephony": "Telephony & VoIP",
        "cloud_devops": "Cloud & DevOps",
        "ai_data": "AI & Data",
        "tools": "Tools",
    }
    for key, items in data.get("skills", {}).items():
        if items:
            pdf.label_line(skill_labels.get(key, key.title()), ", ".join(items))

    # Certifications
    certs = data.get("certifications", []) + [
        {"name": b["name"], "issuer": b["issuer"], "date": b.get("issued", "")}
        for b in data.get("badges", [])
    ]
    if certs:
        pdf.section_title("Certifications")
        for cert in certs:
            pdf.set_font("helvetica", "", 9)
            pdf.set_text_color(*INK)
            date = cert.get("date", "")
            line = f"{cert['name']} - {cert['issuer']}" + (f" ({date[:4]})" if date else "")
            pdf.multi_cell(PAGE_WIDTH, 4.8, line, new_x="LMARGIN", new_y="NEXT")

    # Languages
    langs = data.get("languages", [])
    if langs:
        pdf.section_title("Languages")
        pdf.set_font("helvetica", "", 9.5)
        pdf.set_text_color(*INK)
        pdf.multi_cell(
            PAGE_WIDTH,
            4.8,
            "  |  ".join(f"{lang['language']}: {lang['level']}" for lang in langs),
        )

    pdf.output(str(OUTPUT_PATH))
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
