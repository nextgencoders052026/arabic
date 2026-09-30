"""
Icon generation engine. Provides a badge background + a library of
parametrized templates (person, building, gauge-pair, flag, numeral,
swatch) plus helpers for hand-composed custom icons, all sharing one
consistent visual style (parchment badge, ink/teal/gold palette).
"""
import os
import re

INK = "#1E3A34"
TEAL = "#2F6F62"
GOLD = "#C08A28"
RED = "#B23A32"
PAPER = "#F1EAD6"
PAPER_WHITE = "#FBF7EC"
BROWN = "#6B5842"
BORDER = "#D9CBA0"
BLUE = "#2E5A9E"
PURPLE = "#6B4C8A"
ORANGE = "#C2703D"
OLIVE = "#7A8450"
MAROON = "#7A2E2E"
PINK = "#B5657A"
SLATE = "#4A5F6B"
FOREST = "#3C7A4E"

BADGE = f'<circle cx="50" cy="50" r="46" fill="{PAPER}" stroke="{BORDER}" stroke-width="2"/>'
BADGE_WHITE = f'<circle cx="50" cy="50" r="46" fill="{PAPER_WHITE}" stroke="{BORDER}" stroke-width="2"/>'


def svg(inner, bg=None):
    bg = BADGE if bg is None else bg
    return f'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">{bg}{inner}</svg>'


def slugify(text):
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "word"


# ---------------- Parametrized templates ----------------

def t_swatch(color, ring=INK):
    return svg(f'<circle cx="50" cy="50" r="26" fill="{color}" stroke="{ring}" stroke-width="2"/>')


def t_numeral(n):
    return svg(f'<text x="50" y="68" font-family="Georgia, serif" font-size="48" font-weight="bold" '
               f'fill="{INK}" text-anchor="middle">{n}</text>')


def t_flag(accent, letter):
    """Legacy signature kept for compatibility; delegates to t_flag2 with a
    neutral background band so old calls still render distinctly."""
    return t_flag2(accent, INK, letter)


# A deliberately spread-out, low-collision palette for the ~20 country/city
# icons — each call site below picks two clearly different colors so no two
# countries end up looking identical at a glance, and the letters are large
# enough to read at icon size.
def t_flag2(top_color, bottom_color, letters):
    return svg(
        f'<path d="M50,24 A26,26 0 0,1 50,76 Z" fill="{top_color}"/>'
        f'<path d="M50,24 A26,26 0 0,0 50,76 Z" fill="{bottom_color}"/>'
        f'<circle cx="50" cy="50" r="26" fill="none" stroke="{INK}" stroke-width="2"/>'
        f'<text x="50" y="90" font-family="Georgia, serif" font-size="13" font-weight="bold" '
        f'fill="{INK}" text-anchor="middle">{letters}</text>',
        bg=BADGE_WHITE,
    )


def t_person(accessory, body_color=INK, head_color=GOLD):
    return svg(
        f'<g transform="translate(50,58)">'
        f'<path d="M-18,18 Q-18,-4 0,-4 Q18,-4 18,18 Z" fill="{body_color}"/>'
        f'<circle cx="0" cy="-14" r="10" fill="{head_color}"/>'
        f'{accessory}'
        f'</g>'
    )


def t_building(roof_color, body_color, detail=""):
    return svg(
        f'<g transform="translate(50,54)">'
        f'<polygon points="0,-26 26,-4 -26,-4" fill="{roof_color}"/>'
        f'<rect x="-20" y="-4" width="40" height="26" fill="{body_color}"/>'
        f'{detail}'
        f'</g>'
    )


def t_gauge(marker="right", track_color=TEAL, marker_color=GOLD):
    """A horizontal track with a marker positioned left/mid/right — used for
    paired opposite adjectives sharing one visual motif (e.g. near/far,
    big/small), so the pair reads as a slider moved to opposite ends."""
    x = {"left": 30, "mid": 50, "right": 70}[marker]
    return svg(
        f'<line x1="26" y1="50" x2="74" y2="50" stroke="{track_color}" stroke-width="6" stroke-linecap="round"/>'
        f'<circle cx="{x}" cy="50" r="10" fill="{marker_color}" stroke="{INK}" stroke-width="2"/>'
    )


def t_monogram(letter, bg_color=TEAL):
    return svg(
        f'<circle cx="50" cy="50" r="30" fill="{bg_color}"/>'
        f'<text x="50" y="62" font-family="Georgia, serif" font-size="30" font-weight="bold" '
        f'fill="{PAPER}" text-anchor="middle">{letter}</text>'
    )


def t_speech(color, symbol, symbol_color=None):
    """A clearly-readable speech bubble (rounded rect + tail) with a big
    symbol inside — used for short spoken phrases."""
    symbol_color = symbol_color or PAPER
    return svg(
        f'<rect x="22" y="28" width="56" height="34" rx="10" fill="{color}"/>'
        f'<polygon points="34,62 34,74 46,62" fill="{color}"/>'
        f'<text x="50" y="52" font-family="Georgia, serif" font-size="24" font-weight="bold" '
        f'fill="{symbol_color}" text-anchor="middle">{symbol}</text>'
    )


def t_crescent(color=GOLD):
    """Reliable crescent-moon shape (two overlapping circles, not an arc
    path — arc-based crescents were rendering as invisible/degenerate)."""
    return svg(
        f'<circle cx="46" cy="50" r="20" fill="{color}"/>'
        f'<circle cx="56" cy="46" r="17" fill="{PAPER}"/>'
    )


def t_custom(inner, bg=None):
    """For hand-composed one-off icons: pass raw inner SVG shapes."""
    return svg(inner, bg=bg)


def save_icon(out_dir, lesson, word_en, svg_markup):
    slug = slugify(word_en)
    path = os.path.join(out_dir, f"l{lesson}", f"{slug}.svg")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_markup)
    return path
