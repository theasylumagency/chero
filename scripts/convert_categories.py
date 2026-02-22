#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path

def csv_to_categories_json(csv_path: str, json_path: str):
    csv_file = Path(csv_path)
    out_file = Path(json_path)

    items = []
    with csv_file.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        required = {"id", "order", "ka", "en", "ru"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise SystemExit(f"Missing CSV columns: {sorted(missing)}. Found: {reader.fieldnames}")

        for row in reader:
            items.append({
                "id": str(row["id"]).strip(),
                "order": int(str(row["order"]).strip()),
                "status": "active",
                "title": {
                    "ka": (row["ka"] or "").strip(),
                    "en": (row["en"] or "").strip(),
                    "ru": (row["ru"] or "").strip(),
                }
            })

    data = {"items": items}  # change to just `items` if your app expects an array
    out_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ Wrote {len(items)} categories to: {out_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_categories.py input.csv output.json")
        sys.exit(1)

    csv_to_categories_json(sys.argv[1], sys.argv[2])
