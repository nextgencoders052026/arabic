import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from icon_engine import slugify

# Load vocabulary from the JS file (simple line-based parse since it's a
# regular JSON-ish array of objects with ar/en/lesson/category fields).
import re
with open('data/vocabulary.js', encoding='utf-8') as f:
    content = f.read()

entries = []
for m in re.finditer(r'\{\s*ar:\s*"([^"]+)",\s*en:\s*"([^"]+)",\s*lesson:\s*(\d+)', content):
    ar, en, lesson = m.group(1), m.group(2), int(m.group(3))
    entries.append({"ar": ar, "en": en, "lesson": lesson})

print(f"Parsed {len(entries)} vocabulary entries")

by_lesson = {}
for e in entries:
    by_lesson.setdefault(e["lesson"], []).append(e)

REVIEW_DIR = "review"
os.makedirs(REVIEW_DIR, exist_ok=True)

CSS = """
body { background: #F1EAD6; font-family: Georgia, serif; padding: 24px; margin: 0; }
h1 { color: #1E3A34; font-size: 22px; margin-bottom: 4px; }
.sub { color: #6B5842; font-size: 13px; margin-bottom: 18px; }
.grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.cell { text-align: center; background: #FBF7EC; border: 1px solid #D9CBA0; border-radius: 8px; padding: 10px 4px; }
.cell img { width: 64px; height: 64px; }
.cell .en { margin-top: 4px; font-size: 12px; color: #1E3A34; font-weight: bold; }
.cell .ar { font-size: 14px; color: #6B5842; }
"""

for lesson in sorted(by_lesson.keys()):
    items = by_lesson[lesson]
    cells = []
    for it in items:
        slug = slugify(it["en"])
        img_path = f"../icons/l{lesson}/{slug}.svg"
        cells.append(
            f'<div class="cell"><img src="{img_path}"><div class="en">{it["en"]}</div><div class="ar">{it["ar"]}</div></div>'
        )
    html = f"""<!DOCTYPE html><html><head><style>{CSS}</style></head><body>
    <h1>Lesson {lesson}</h1>
    <div class="sub">{len(items)} words</div>
    <div class="grid">{''.join(cells)}</div>
    </body></html>"""
    with open(os.path.join(REVIEW_DIR, f"lesson_{lesson:02d}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"Built {len(by_lesson)} review pages")
