# Vocabulary Game — Assets for Claude Code

This folder contains everything built so far for the vocabulary game app.
It's meant to be handed to Claude Code as the starting point — see the
prompt sequence your Claude Code should be given (shared alongside this
package) for exactly what to build with these assets.

## What's here

- `data/vocabulary.js` — all 289 vocabulary words across the book's 23
  lessons, each as `{ ar, en, lesson, category }`.
- `icons/l1/` through `icons/l23/` — one SVG icon per word, matching
  `vocabulary.js` exactly (same lesson number + English text → filename
  slug). Every icon has been reviewed and fixed for clarity.
- `icon_engine.py`, `gen_1_4.py`, `gen_5_12.py`, `gen_13_23.py` — the
  Python scripts that generated the icons. Not needed to build the app,
  but keep them if you (or Claude Code) want to regenerate or tweak any
  icon's design later — each icon is a short, readable line of Python,
  not hand-edited SVG.
- `review/` — HTML pages (one per lesson) for visually spot-checking all
  icons against their words. Open any `lesson_NN.html` in a browser.

## Data shape reference

```js
// data/vocabulary.js
export const VOCABULARY = [
  { ar: "بَيْتٌ", en: "house", lesson: 1, category: "place" },
  // ...289 total
];
```

Icon path convention: `icons/l{lesson}/{slug-of-english-text}.svg`
(e.g. `icons/l1/house.svg`). The slug is lowercase, non-alphanumeric
characters replaced with `-`. If you need to look one up programmatically,
the same slugify logic is in `icon_engine.py`.
