#!/usr/bin/env python3
"""Rebuild public/downloads/speaker-bios.pdf from SPEAKERS in src/lib/program.ts.

Run from the project root: python3 scripts/build-speaker-bios-pdf.py
Photos are fetched from the published site, so publish before rebuilding
if a photo changes.
"""
import json, subprocess, urllib.request
from io import BytesIO
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "downloads" / "speaker-bios.pdf"
SITE = "https://r17gh.com"
DUMP = 'import { SPEAKERS, PROGRAM_TITLE, PROGRAM_PLACE } from "./src/lib/program"; console.log(JSON.stringify({ SPEAKERS, PROGRAM_TITLE, PROGRAM_PLACE }));'


def main() -> None:
    data = json.loads(subprocess.run(["bun", "-e", DUMP], cwd=ROOT, check=True, capture_output=True, text=True).stdout)
    c = canvas.Canvas(str(OUT), pagesize=letter)
    c.setTitle("Speaker bios"); c.setAuthor("Region 17 Ghana")
    w, h = letter; left = 0.9 * inch; textw = w - 2 * left
    for s in data["SPEAKERS"]:
        y = h - 0.9 * inch
        c.setFont("Helvetica", 10); c.drawString(left, y, f"{data['PROGRAM_TITLE']}, {data['PROGRAM_PLACE']}")
        y -= 0.4 * inch
        photo = s["photo"] if s["photo"].startswith("http") else SITE + s["photo"]
        img = ImageReader(BytesIO(urllib.request.urlopen(urllib.request.Request(photo, headers={"User-Agent": "Mozilla/5.0"})).read()))
        size = 1.6 * inch
        c.drawImage(img, left, y - size, size, size)
        c.setFont("Helvetica-Bold", 15); c.drawString(left + size + 0.25 * inch, y - 0.3 * inch, s["name"])
        c.setFont("Helvetica", 10)
        ry = y - 0.55 * inch
        for line in simpleSplit(s["role"], "Helvetica", 10, textw - size - 0.25 * inch):
            c.drawString(left + size + 0.25 * inch, ry, line); ry -= 0.18 * inch
        y -= size + 0.35 * inch
        for para in s["bio"]:
            for line in simpleSplit(para, "Helvetica", 10.5, textw):
                if y < 0.9 * inch:
                    c.showPage(); y = h - 0.9 * inch
                c.setFont("Helvetica", 10.5); c.drawString(left, y, line); y -= 0.19 * inch
            y -= 0.12 * inch
        c.showPage()
    c.save(); print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
