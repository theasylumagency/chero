#!/usr/bin/env python3
"""
Convert dishes.csv -> dishes.json (schema used by your menu app)

Input columns expected (flexible, extra columns ignored):
  id, order, category_id, ka, en, ru, price,
  vegetarian, topRated, soldOut,
  description_ka, description_en, description_ru,
  story_ka, story_en, [story_ru]

Behavior:
- Skips empty rows (missing id)
- Sets status="active" for all dishes
- Assumes currency="GEL"
- Converts price to priceMinor (GEL * 100). If price is like "23.00/25.00", uses the first number.
- If story_ka looks like English and story_en looks like Georgian, swaps them (fixes common spreadsheet mix-up).

Usage:
  python convert_dishes_csv_to_json.py dishes.csv dishes.json
"""
import csv, json, re, sys
from pathlib import Path

PRICE_RE = re.compile(r"\d+(?:[.,]\d+)?")

def detect_dialect(sample: str):
    sniffer = csv.Sniffer()
    try:
        return sniffer.sniff(sample, delimiters=[",",";","\t","|"])
    except Exception:
        class D: delimiter=","
        return D()

def has_georgian(text: str) -> bool:
    return any('\u10A0' <= ch <= '\u10FF' for ch in text)

def has_latin(text: str) -> bool:
    return any(('A' <= ch <= 'Z') or ('a' <= ch <= 'z') for ch in text)

def to_bool(v):
    if v is None:
        return False
    if isinstance(v, bool):
        return v
    s = str(v).strip().lower()
    if s in ("true","1","yes","y","t"):
        return True
    if s in ("false","0","no","n","f",""):
        return False
    return True

def price_to_minor(price_val):
    if price_val is None:
        return 0
    s = str(price_val).strip()
    if not s:
        return 0
    m = PRICE_RE.search(s)
    if not m:
        return 0
    num = m.group(0).replace(",", ".")
    try:
        f = float(num)
    except Exception:
        return 0
    return int(round(f * 100))

def main():
    in_path = Path(sys.argv[1] if len(sys.argv) > 1 else "dishes.csv")
    out_path = Path(sys.argv[2] if len(sys.argv) > 2 else "dishes.json")

    with in_path.open("r", encoding="utf-8-sig", newline="") as f:
        sample = f.read(4096)
        f.seek(0)
        dialect = detect_dialect(sample)
        reader = csv.DictReader(f, dialect=dialect)
        rows = list(reader)

    items = []
    for row in rows:
        dish_id = (row.get("id") or "").strip()
        if not dish_id:
            continue

        try:
            order_int = int(float((row.get("order") or "0").strip() or 0))
        except Exception:
            order_int = 0

        category_id = (row.get("category_id") or row.get("categoryId") or "").strip()

        title = {
            "ka": (row.get("ka") or "").strip(),
            "en": (row.get("en") or "").strip(),
            "ru": (row.get("ru") or "").strip(),
        }

        description = {
            "ka": (row.get("description_ka") or "").strip(),
            "en": (row.get("description_en") or "").strip(),
            "ru": (row.get("description_ru") or "").strip(),
        }

        story_ka = (row.get("story_ka") or "").strip()
        story_en = (row.get("story_en") or "").strip()
        story_ru = (row.get("story_ru") or "").strip()

        if story_ka and story_en and has_latin(story_ka) and has_georgian(story_en) and not has_georgian(story_ka):
            story_ka, story_en = story_en, story_ka

        item = {
            "id": dish_id,
            "categoryId": category_id,
            "order": order_int,
            "status": "active",
            "priceMinor": price_to_minor(row.get("price")),
            "currency": "GEL",
            "title": title,
            "description": description,
            "vegetarian": to_bool(row.get("vegetarian")),
            "topRated": to_bool(row.get("topRated")),
            "soldOut": to_bool(row.get("soldOut")),
            "story": {"ka": story_ka, "en": story_en, "ru": story_ru},
        }
        items.append(item)

    payload = {"items": items}
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(items)} dishes to {out_path}")

if __name__ == "__main__":
    main()
# python dishes_to_json.py dishes.csv dishes.json