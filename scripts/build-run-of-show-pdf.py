#!/usr/bin/env python3
"""Rebuild public/downloads/run-of-show.pdf from the schedule in src/lib/program.ts.

Run from the project root: python3 scripts/build-run-of-show-pdf.py
The schedule is read out of the TypeScript source with bun, so the PDF can
never drift from the times shown on the program page.
"""
import json
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "downloads" / "run-of-show.pdf"

DUMP = """
import { RUN_OF_SHOW, PROGRAM_TITLE, PROGRAM_PLACE, PROGRAM_MC } from "./src/lib/program";
console.log(JSON.stringify({ RUN_OF_SHOW, PROGRAM_TITLE, PROGRAM_PLACE, PROGRAM_MC }));
"""


def load_program() -> dict:
    out = subprocess.run(
        ["bun", "-e", DUMP], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(out.stdout)


def central_hm(ms: int) -> str:
    # Nov 12, 2026 in Chicago is CST (UTC-6).
    dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc) - timedelta(hours=6)
    return dt.strftime("%I:%M").lstrip("0")


def main() -> None:
    data = load_program()
    c = canvas.Canvas(str(OUT), pagesize=letter)
    c.setTitle("Run of show")
    c.setAuthor("Region 17 Ghana")
    width, height = letter
    left = 0.9 * inch
    y = height - 0.9 * inch

    c.setFont("Helvetica-Bold", 16)
    c.drawString(left, y, data["PROGRAM_TITLE"])
    y -= 0.32 * inch
    c.setFont("Helvetica", 11)
    c.drawString(left, y, data["PROGRAM_PLACE"])
    y -= 0.22 * inch
    c.drawString(left, y, data["PROGRAM_MC"])
    y -= 0.22 * inch
    c.setFont("Helvetica-BoldOblique", 10)
    c.drawString(left, y, "All times Central Time.")
    y -= 0.4 * inch

    for seg in data["RUN_OF_SHOW"]:
        start, end = central_hm(seg["start"]), central_hm(seg["end"])
        line = f"{start} - {end}   {seg['title']}"
        lead = seg.get("lead") or ""
        if y < 1.0 * inch:
            c.showPage()
            y = height - 0.9 * inch
        c.setFont("Helvetica-Bold", 11)
        c.drawString(left, y, line)
        y -= 0.2 * inch
        if lead:
            c.setFont("Helvetica", 10)
            c.drawString(left + 0.25 * inch, y, lead)
            y -= 0.2 * inch
        y -= 0.08 * inch

    c.save()
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
