#!/usr/bin/env python3
"""Refresh data/publications.json from Google Scholar.

Runs weekly via .github/workflows/update-scholar.yml. Uses the
`scholarly` library to fetch the public profile, then merges into the
existing JSON so manual curation (publication `type` overrides) is
preserved. Designed to fail soft: any fetch error leaves the JSON
untouched and exits 0, so a temporary Scholar block never breaks CI.
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

SCHOLAR_ID = "bz6-A4oAAAAJ"
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "publications.json"


def normalize(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()


def guess_type(venue: str) -> str:
    v = venue.lower()
    if "patent" in v:
        return "patent"
    if any(k in v for k in ("conference", "otcon", "symposium", "workshop", "proceedings")):
        return "conference"
    if any(k in v for k in ("book", "edited volume", "chapter")):
        return "book"
    return "journal"


def fetch_profile():
    from scholarly import scholarly

    author = scholarly.search_author_id(SCHOLAR_ID)
    author = scholarly.fill(author, sections=["basics", "indices", "publications"])

    pubs = []
    for pub in author.get("publications", []):
        try:
            pub = scholarly.fill(pub)
        except Exception as exc:  # noqa: BLE001 - keep the partial record
            print(f"  warn: could not fill publication: {exc}")
        bib = pub.get("bib", {})
        title = bib.get("title", "").strip()
        if not title:
            continue
        year = bib.get("pub_year")
        venue = (
            bib.get("journal")
            or bib.get("conference")
            or bib.get("booktitle")
            or bib.get("publisher")
            or bib.get("citation", "")
        )
        volume = bib.get("volume")
        number = bib.get("number")
        pages = bib.get("pages")
        detail = ""
        if volume:
            detail += f" {volume}"
            if number:
                detail += f"({number})"
            if pages:
                detail += f", {pages}"
        pubs.append(
            {
                "title": title,
                "authors": bib.get("author", "").replace(" and ", ", "),
                "venue": (venue + detail).strip(),
                "year": int(year) if year else 0,
                "citations": int(pub.get("num_citations", 0)),
            }
        )

    metrics = {
        "citations": int(author.get("citedby", 0)),
        "citations_since_2021": int(author.get("citedby5y", 0)),
        "h_index": int(author.get("hindex", 0)),
        "i10_index": int(author.get("i10index", 0)),
    }
    return metrics, pubs


def main() -> int:
    data = json.loads(DATA_FILE.read_text())
    try:
        metrics, fetched = fetch_profile()
    except Exception as exc:  # noqa: BLE001 - fail soft, keep existing data
        print(f"Scholar fetch failed, keeping existing data: {exc}")
        return 0

    if not fetched or metrics["citations"] == 0:
        print("Scholar returned an empty/implausible profile; keeping existing data.")
        return 0

    existing_by_title = {normalize(p["title"]): p for p in data["publications"]}

    merged = []
    for pub in fetched:
        prior = existing_by_title.get(normalize(pub["title"]))
        if prior:
            # keep curated fields; refresh the moving parts
            prior["citations"] = max(prior.get("citations", 0), pub["citations"])
            if pub["year"]:
                prior["year"] = pub["year"]
            merged.append(prior)
        else:
            pub["type"] = guess_type(pub["venue"])
            merged.append(pub)
            print(f"  new publication: {pub['title']}")

    # keep curated entries Scholar no longer lists rather than dropping them
    fetched_titles = {normalize(p["title"]) for p in fetched}
    for title, prior in existing_by_title.items():
        if title not in fetched_titles:
            merged.append(prior)

    merged.sort(key=lambda p: (-p.get("citations", 0), -p.get("year", 0)))

    data["scholar_profile"]["metrics"] = metrics
    data["scholar_profile"]["last_updated"] = date.today().isoformat()
    data["publications"] = merged

    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        f"Updated: {len(merged)} publications, "
        f"{metrics['citations']} citations, h-index {metrics['h_index']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
