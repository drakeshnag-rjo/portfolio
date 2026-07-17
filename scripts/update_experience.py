#!/usr/bin/env python3
"""Keep the years-of-experience figure current across the site.

Career start: August 2011 (first DevOps role). Rather than blindly
adding 1 each run, the script computes the correct value from the
date — idempotent, so re-runs and manual dispatches can never
double-increment. Runs every August via
.github/workflows/update-experience.yml.
"""

import re
import sys
from datetime import date
from pathlib import Path

CAREER_START_YEAR = 2011
CAREER_START_MONTH = 8  # August

ROOT = Path(__file__).resolve().parent.parent
FILES = ["index.html", "README.md"]


def current_years(today=None):
    today = today or date.today()
    years = today.year - CAREER_START_YEAR
    if today.month < CAREER_START_MONTH:
        years -= 1
    return years


def main() -> int:
    years = current_years()
    changed_any = False

    for name in FILES:
        path = ROOT / name
        text = path.read_text()
        updated = text
        # "14+ years" (descriptions, hero, meta) and "over 14 years" (About)
        updated = re.sub(r"\d+\+ years", f"{years}+ years", updated)
        updated = re.sub(r"over \d+ years", f"over {years} years", updated)
        # hero stat card: <h3>14+</h3> immediately before "Years Experience"
        updated = re.sub(
            r"(<h3>)\d+(\+</h3>\s*<p>Years Experience)",
            rf"\g<1>{years}\g<2>",
            updated,
        )
        if updated != text:
            path.write_text(updated)
            changed_any = True
            print(f"updated {name}")

    if changed_any:
        print(f"Experience is now {years}+ years.")
    else:
        print(f"Already current ({years}+ years) — nothing to do.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
