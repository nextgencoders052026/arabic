import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from icon_engine import *

OUT = os.path.join(os.path.dirname(__file__), "icons")
generated = []

def add(lesson, en, markup):
    save_icon(OUT, lesson, en, markup)
    generated.append((lesson, en))

# ============================================================ LESSON 13
add(13, "man", t_person(""))
add(13, "people", t_custom(f'<g transform="translate(50,58)"><circle cx="-14" cy="-18" r="8" fill="{TEAL}"/><path d="M-24,4 Q-24,-6 -14,-6 Q-4,-6 -4,4 Z" fill="{TEAL}"/><circle cx="14" cy="-18" r="8" fill="{GOLD}"/><path d="M4,4 Q4,-6 14,-6 Q24,-6 24,4 Z" fill="{GOLD}"/></g>'))
add(13, "pilgrim", t_person(f'<path d="M-12,-26 Q0,-16 12,-26 L12,-20 Q0,-12 -12,-20 Z" fill="{PAPER_WHITE}"/>', head_color=PAPER_WHITE))
add(13, "guest", t_person(f'<path d="M14,-2 L26,-2 M26,-2 L20,-8 M26,-2 L20,4" stroke="{GOLD}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'))
add(13, "friend", t_custom(f'<g transform="translate(50,58)"><circle cx="-10" cy="-16" r="8" fill="{TEAL}"/><path d="M-20,4 Q-20,-4 -10,-4 Q0,-4 0,4 Z" fill="{TEAL}"/><circle cx="10" cy="-16" r="8" fill="{TEAL}"/><path d="M0,4 Q0,-4 10,-4 Q20,-4 20,4 Z" fill="{TEAL}"/></g>'))
add(13, "village", t_custom(f'<g transform="translate(50,58)"><polygon points="-20,-8 -14,-18 -8,-8" fill="{GOLD}"/><rect x="-18" y="-8" width="20" height="18" fill="{INK}"/><polygon points="8,-4 14,-14 20,-4" fill="{TEAL}"/><rect x="6" y="-4" width="16" height="14" fill="{BROWN}"/></g>'))
add(13, "restaurant", t_building(RED, PAPER_WHITE, f'<circle cx="0" cy="6" r="6" fill="none" stroke="{INK}" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="3" stroke="{INK}" stroke-width="2"/>'))
add(13, "field", t_custom(f'<g fill="{TEAL}"><path d="M30,72 Q30,50 34,50 Q38,50 38,72"/><path d="M46,72 Q46,44 50,44 Q54,44 54,72"/><path d="M62,72 Q62,50 66,50 Q70,50 70,72"/></g>'))
add(13, "old man / learned man", t_person(f'<path d="M-12,20 L-12,28 M12,20 L12,28" stroke="{PAPER}" stroke-width="1.5"/>', body_color=BROWN))
add(13, "wife", t_person(f'<polygon points="0,-6 10,10 -10,10" fill="{RED}"/>', body_color=RED))
add(13, "lady professor", t_person(f'<rect x="-10" y="8" width="20" height="4" fill="{GOLD}"/><polygon points="0,-6 10,10 -10,10" fill="{RED}"/>', body_color=RED))
add(13, "woman", t_person(f'<polygon points="0,-6 10,10 -10,10" fill="{RED}"/>', body_color=RED))

# ============================================================ LESSON 14
add(14, "the Lord", t_custom(f'<polygon points="50,20 58,42 82,42 62,56 70,78 50,64 30,78 38,56 18,42 42,42" fill="{GOLD}" stroke="{INK}" stroke-width="1"/>'))
add(14, "Islam", t_custom(f'<path d="M60,26 A24,24 0 1,0 60,74 A20,20 0 1,1 60,26 Z" fill="{TEAL}"/><polygon points="66,30 68,36 74,36 69,40 71,46 66,42 61,46 63,40 58,36 64,36" fill="{GOLD}"/>'))
add(14, "religion", t_custom(f'<rect x="34" y="30" width="32" height="40" fill="{INK}"/><rect x="34" y="30" width="32" height="8" fill="{GOLD}"/>'))
add(14, "prophet", t_person(f'<path d="M-11,-25 Q0,-31 11,-25 L11,-19 L-11,-19 Z" fill="{PAPER}"/>', head_color=PAPER_WHITE))
add(14, "welcome", t_person(f'<g transform="translate(16,-4) rotate(20)" fill="{GOLD}"><rect x="-4" y="-2" width="8" height="16" rx="3"/><rect x="-9" y="-10" width="5" height="12" rx="2.5"/><rect x="-2" y="-13" width="5" height="14" rx="2.5"/><rect x="5" y="-11" width="5" height="13" rx="2.5"/></g>'))
add(14, "constitution / law", t_custom(f'<rect x="32" y="24" width="36" height="50" fill="{PAPER_WHITE}" stroke="{INK}" stroke-width="2.5"/><line x1="38" y1="36" x2="62" y2="36" stroke="{BORDER}" stroke-width="2"/><line x1="38" y1="44" x2="62" y2="44" stroke="{BORDER}" stroke-width="2"/><line x1="38" y1="52" x2="54" y2="52" stroke="{BORDER}" stroke-width="2"/>'))
add(14, "prayer direction", t_custom(f'<rect x="34" y="30" width="32" height="40" fill="{TEAL}"/><rect x="34" y="30" width="32" height="8" fill="{GOLD}"/><path d="M50,74 L42,86 L58,86 Z" fill="{GOLD}"/>'))
add(14, "lawcourt", t_building(BROWN, PAPER_WHITE, f'<line x1="-12" y1="4" x2="12" y2="4" stroke="{INK}" stroke-width="3"/><line x1="0" y1="4" x2="0" y2="-4" stroke="{INK}" stroke-width="2"/>'))
add(14, "grandson", t_person(f'<polygon points="0,-6 10,10 -10,10" fill="{TEAL}" opacity="0.001"/>', body_color=TEAL))
add(14, "garden", t_custom(f'<g transform="translate(50,58)"><circle cx="-14" cy="0" r="10" fill="{TEAL}"/><circle cx="14" cy="4" r="12" fill="{TEAL}"/><circle cx="0" cy="-10" r="9" fill="{GOLD}"/><rect x="-20" y="10" width="40" height="6" fill="{BROWN}"/></g>'))
add(14, "Saturday", t_custom(f'<rect x="26" y="30" width="48" height="42" rx="3" fill="{PAPER_WHITE}" stroke="{INK}" stroke-width="2.5"/><rect x="26" y="30" width="48" height="10" fill="{TEAL}"/><text x="50" y="58" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="{INK}" text-anchor="middle">Sat</text>'))
add(14, "month", t_crescent(GOLD))
add(14, "the month of Rajab", t_crescent(TEAL))
add(14, "Greece", t_flag2(SLATE, PAPER_WHITE, "GR"))
add(14, "airport", t_custom(f'<path d="M50,22 L58,50 L82,58 L82,64 L58,58 L54,74 L62,78 L62,82 L50,80 L38,82 L38,78 L46,74 L42,58 L18,64 L18,58 L42,50 Z" fill="{TEAL}"/>'))
add(14, "faculty / college", t_building(INK, GOLD, f'<rect x="-16" y="4" width="32" height="10" fill="{INK}"/><polygon points="0,-30 -20,-22 20,-22" fill="{RED}"/>'))
add(14, "faculty of medicine", t_building(RED, PAPER_WHITE, f'<rect x="-4" y="0" width="8" height="16" fill="{RED}"/><rect x="-10" y="4" width="20" height="8" fill="{RED}"/>'))
add(14, "faculty of engineering", t_building(BROWN, PAPER_WHITE, f'<circle cx="0" cy="6" r="8" fill="none" stroke="{BROWN}" stroke-width="3"/>'))
add(14, "faculty of commerce", t_building(GOLD, PAPER_WHITE, f'<text x="0" y="12" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="{GOLD}" text-anchor="middle">$</text>'))
add(14, "faculty of Islamic law", t_building(TEAL, PAPER_WHITE, f'<text x="0" y="12" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="{TEAL}" text-anchor="middle">&#9770;</text>'))
add(14, "Christian", t_person(f'<line x1="0" y1="-28" x2="0" y2="-16" stroke="{PAPER}" stroke-width="2.5"/><line x1="-5" y1="-24" x2="5" y2="-24" stroke="{PAPER}" stroke-width="2.5"/>'))
add(14, "May Allah grant him health!", t_custom(f'<circle cx="50" cy="50" r="26" fill="{TEAL}"/><path d="M38,50 L46,58 L64,40" fill="none" stroke="{PAPER}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'))

# ============================================================ LESSON 15
add(15, "before", t_gauge("left", marker_color=GOLD))
add(15, "he returned", t_custom(f'<path d="M70,50 A20,20 0 1,1 60,32" fill="none" stroke="{TEAL}" stroke-width="5" stroke-linecap="round"/><polygon points="60,24 60,38 72,32" fill="{TEAL}"/>'))
add(15, "lesson", t_custom(f'<rect x="30" y="26" width="40" height="48" fill="{PAPER_WHITE}" stroke="{INK}" stroke-width="2"/><line x1="36" y1="38" x2="64" y2="38" stroke="{TEAL}" stroke-width="2.5"/><line x1="36" y1="46" x2="64" y2="46" stroke="{TEAL}" stroke-width="2.5"/><line x1="36" y1="54" x2="52" y2="54" stroke="{TEAL}" stroke-width="2.5"/>'))
add(15, "prayer", t_custom(f'<g transform="translate(50,52)"><rect x="-26" y="14" width="52" height="8" rx="2" fill="{TEAL}"/><circle cx="10" cy="-4" r="7" fill="{INK}"/><path d="M10,3 Q-4,3 -4,14 L24,14 Q24,3 10,3 Z" fill="{INK}"/></g>'))
add(15, "the call to prayer", t_custom(f'<g transform="translate(50,55)"><rect x="-6" y="-30" width="12" height="42" fill="{INK}"/><path d="M-6,-30 Q0,-36 6,-30" fill="{GOLD}"/><path d="M12,-10 Q22,-10 22,0 M14,-4 Q20,-4 20,2" stroke="{GOLD}" stroke-width="2.5" fill="none"/></g>'))
add(15, "week", t_custom(f'<rect x="24" y="30" width="52" height="44" rx="3" fill="{PAPER_WHITE}" stroke="{INK}" stroke-width="2.5"/><rect x="24" y="30" width="52" height="10" fill="{RED}"/><line x1="34" y1="46" x2="34" y2="46" stroke="{INK}"/><g fill="{INK}"><circle cx="34" cy="50" r="2.5"/><circle cx="44" cy="50" r="2.5"/><circle cx="54" cy="50" r="2.5"/><circle cx="64" cy="50" r="2.5"/><circle cx="34" cy="60" r="2.5"/><circle cx="44" cy="60" r="2.5"/><circle cx="54" cy="60" r="2.5"/></g>'))
add(15, "examination", t_custom(f'<rect x="30" y="26" width="40" height="48" fill="{PAPER_WHITE}" stroke="{INK}" stroke-width="2"/><path d="M38,44 L44,50 L60,34" fill="none" stroke="{TEAL}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line x1="38" y1="58" x2="62" y2="58" stroke="{BORDER}" stroke-width="2"/>'))

# ============================================================ LESSON 16
add(16, "river", t_custom(f'<path d="M20,40 Q40,50 30,60 Q20,70 40,74 L80,74 Q60,66 70,58 Q80,50 60,42 Z" fill="{TEAL}"/>'))
add(16, "sea", t_custom(f'<g stroke="{TEAL}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M20,44 Q30,36 40,44 Q50,52 60,44 Q70,36 80,44"/><path d="M20,58 Q30,50 40,58 Q50,66 60,58 Q70,50 80,58"/></g>'))
add(16, "hotel", t_building(RED, PAPER_WHITE, f'<text x="0" y="12" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="{RED}" text-anchor="middle">H</text>'))
add(16, "airplane", t_custom(f'<path d="M50,22 L58,50 L82,58 L82,64 L58,58 L54,74 L62,78 L62,82 L50,80 L38,82 L38,78 L46,74 L42,58 L18,64 L18,58 L42,50 Z" fill="{INK}"/>'))

# ============================================================ LESSON 17
add(17, "company", t_building(TEAL, PAPER_WHITE, f'<rect x="-16" y="4" width="32" height="10" fill="{TEAL}"/>'))
add(17, "director of the company", t_person(f'<rect x="10" y="0" width="10" height="12" fill="{GOLD}" stroke="{INK}" stroke-width="1.5"/>'))
add(17, "cheap", t_custom(f'<path d="M30,50 L50,30 L74,30 L74,54 L54,74 Z" fill="{GOLD}" stroke="{INK}" stroke-width="2"/><circle cx="62" cy="42" r="4" fill="{PAPER}"/>'))
add(17, "Japanese", t_flag(RED, "JP"))

# ============================================================ LESSON 18
add(18, "wheel", t_custom(f'<circle cx="50" cy="50" r="24" fill="none" stroke="{INK}" stroke-width="5"/><circle cx="50" cy="50" r="5" fill="{GOLD}"/><line x1="50" y1="26" x2="50" y2="74" stroke="{INK}" stroke-width="3"/><line x1="26" y1="50" x2="74" y2="50" stroke="{INK}" stroke-width="3"/>'))
add(18, "writing board", t_custom(f'<rect x="24" y="30" width="52" height="36" rx="2" fill="{INK}" stroke="{BROWN}" stroke-width="3"/><line x1="32" y1="44" x2="58" y2="44" stroke="{PAPER}" stroke-width="2.5"/><line x1="32" y1="52" x2="50" y2="52" stroke="{PAPER}" stroke-width="2.5"/>'))
add(18, "festival", t_custom(f'<g transform="translate(50,54)"><path d="M-16,10 L-10,-14 L0,4 L10,-14 L16,10 Z" fill="{GOLD}"/></g>'))
add(18, "riyal", t_custom(f'<circle cx="50" cy="50" r="26" fill="{GOLD}" stroke="{INK}" stroke-width="2"/><text x="50" y="60" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="{INK}" text-anchor="middle">R</text>'))
add(18, "year", t_custom(f'<circle cx="50" cy="50" r="26" fill="none" stroke="{TEAL}" stroke-width="4" stroke-dasharray="6 4"/><text x="50" y="58" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="{INK}" text-anchor="middle">365</text>'))
add(18, "city district", t_custom(f'<g transform="translate(50,58)" fill="{TEAL}"><rect x="-24" y="-10" width="12" height="26"/><rect x="-10" y="-20" width="12" height="36"/><rect x="4" y="-14" width="12" height="30"/><rect x="18" y="-6" width="8" height="22"/></g>'))
add(18, "rak'ah (a unit of prayer)", t_custom(f'<g transform="translate(50,52)"><rect x="-26" y="14" width="52" height="8" rx="2" fill="{TEAL}"/><path d="M-10,0 Q10,0 10,14 L-10,14 Z" fill="{INK}"/></g>'))
add(18, "ruler (for drawing lines)", t_custom(f'<rect x="20" y="44" width="60" height="12" rx="2" fill="{GOLD}" stroke="{INK}" stroke-width="1.5" transform="rotate(-15 50 50)"/>'))
add(18, "shop / store", t_building(TEAL, GOLD, f'<rect x="-14" y="0" width="28" height="14" fill="{INK}"/>'))

# ============================================================ LESSON 19
NUMS = {"one (1)": 1, "two (2)": 2, "three (3)": 3, "four (4)": 4, "five (5)": 5,
        "six (6)": 6, "seven (7)": 7, "eight (8)": 8, "nine (9)": 9, "ten (10)": 10}
for en, n in NUMS.items():
    add(19, en, t_numeral(n))
add(19, "all", t_custom(f'<g transform="translate(50,58)"><circle cx="-14" cy="-16" r="7" fill="{TEAL}"/><path d="M-22,2 Q-22,-6 -14,-6 Q-6,-6 -6,2 Z" fill="{TEAL}"/><circle cx="0" cy="-20" r="7" fill="{GOLD}"/><path d="M-8,-2 Q-8,-10 0,-10 Q8,-10 8,-2 Z" fill="{GOLD}"/><circle cx="14" cy="-16" r="7" fill="{RED}"/><path d="M6,2 Q6,-6 14,-6 Q22,-6 22,2 Z" fill="{RED}"/></g>'))
add(19, "country", t_custom(f'<circle cx="50" cy="50" r="26" fill="{TEAL}"/><path d="M30,42 Q40,38 50,44 Q60,50 70,44 M28,58 Q40,54 52,60 Q62,64 72,58" stroke="{PAPER}" stroke-width="2" fill="none"/>'))
add(19, "different", t_custom(f'<circle cx="40" cy="50" r="14" fill="{TEAL}"/><rect x="52" y="36" width="24" height="24" fill="{GOLD}"/>'))
add(19, "bus", t_custom(f'<g transform="translate(50,54)"><rect x="-26" y="-10" width="52" height="24" rx="4" fill="{GOLD}"/><rect x="-20" y="-4" width="12" height="10" fill="{PAPER_WHITE}"/><rect x="-4" y="-4" width="12" height="10" fill="{PAPER_WHITE}"/><rect x="12" y="-4" width="12" height="10" fill="{PAPER_WHITE}"/><circle cx="-14" cy="16" r="6" fill="{INK}"/><circle cx="14" cy="16" r="6" fill="{INK}"/></g>'))
add(19, "Europe", t_flag2(BLUE, GOLD, "EU"))
add(19, "thanks", t_custom(f'<path d="M30,50 L44,64 L72,32" fill="none" stroke="{GOLD}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'))
add(19, "day", t_custom(f'<g transform="translate(50,50)"><circle cx="0" cy="0" r="14" fill="{GOLD}"/><g stroke="{GOLD}" stroke-width="4" stroke-linecap="round"><line x1="0" y1="-24" x2="0" y2="-30"/><line x1="0" y1="24" x2="0" y2="30"/><line x1="-24" y1="0" x2="-30" y2="0"/><line x1="24" y1="0" x2="30" y2="0"/></g></g>'))
add(19, "price", t_custom(f'<path d="M28,50 L50,28 L74,28 L74,52 L52,74 Z" fill="{GOLD}" stroke="{INK}" stroke-width="2"/><circle cx="62" cy="40" r="4" fill="{PAPER}"/>'))
add(19, "half", t_custom(f'<circle cx="50" cy="50" r="26" fill="{INK}"/><path d="M50,24 A26,26 0 0,0 50,76 Z" fill="{PAPER}"/>'))
add(19, "1/10th of a riyal", t_custom(f'<circle cx="50" cy="50" r="20" fill="{BORDER}" stroke="{INK}" stroke-width="2"/><text x="50" y="58" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="{INK}" text-anchor="middle">Q</text>'))
add(19, "passenger", t_person(f'<rect x="10" y="4" width="8" height="6" fill="{GOLD}"/>'))
add(19, "question", t_monogram("?", TEAL))
add(19, "pocket", t_custom(f'<path d="M32,36 L68,36 L74,72 Q50,80 26,72 Z" fill="{TEAL}"/><path d="M32,36 Q50,44 68,36" fill="none" stroke="{INK}" stroke-width="2"/>'))

# ============================================================ LESSON 20
add(20, "word", t_custom(f'<rect x="26" y="42" width="48" height="16" rx="8" fill="{TEAL}"/><line x1="34" y1="50" x2="66" y2="50" stroke="{PAPER}" stroke-width="3"/>'))
add(20, "magazine / journal", t_custom(f'<rect x="30" y="24" width="40" height="52" fill="{RED}" stroke="{INK}" stroke-width="2"/><rect x="36" y="32" width="28" height="18" fill="{PAPER_WHITE}"/>'))
add(20, "letter (of the alphabet)", t_monogram("A", GOLD))

# ============================================================ LESSON 21
add(21, "colour", t_custom(f'<g transform="translate(50,50)"><circle cx="-10" cy="-10" r="12" fill="{RED}"/><circle cx="10" cy="-10" r="12" fill="{GOLD}"/><circle cx="0" cy="10" r="12" fill="{TEAL}"/></g>'))
add(21, "spacious", t_custom(f'<rect x="20" y="20" width="60" height="60" fill="none" stroke="{TEAL}" stroke-width="4"/><path d="M32,32 L20,20 M20,20 L20,30 M20,20 L30,20" stroke="{GOLD}" stroke-width="3" fill="none"/><path d="M68,68 L80,80 M80,80 L80,70 M80,80 L70,80" stroke="{GOLD}" stroke-width="3" fill="none"/>'))
add(21, "Asia", t_flag2(ORANGE, TEAL, "AS"))
add(21, "Africa", t_flag2(BROWN, GOLD, "AF"))

# ============================================================ LESSON 22
COLORS = {"red": RED, "blue": "#2E5A9E", "green": "#3C7A4E", "black": INK, "yellow": "#D4A72C", "white": PAPER_WHITE}
for en, c in COLORS.items():
    add(22, en, t_swatch(c))
add(22, "Baghdad", t_flag2(OLIVE, RED, "BGD"))
add(22, "Jeddah", t_flag2(TEAL, GOLD, "JED"))
add(22, "tea-cup", t_custom(f'<g transform="translate(50,56)"><path d="M-14,-6 L12,-6 L9,12 Q9,16 -2,16 Q-14,16 -14,12 Z" fill="{RED}"/><path d="M12,-3 Q22,-3 22,5 Q22,11 12,10" fill="none" stroke="{RED}" stroke-width="3"/></g>'))
add(22, "minute", t_custom(f'<circle cx="50" cy="50" r="26" fill="none" stroke="{INK}" stroke-width="3"/><line x1="50" y1="50" x2="50" y2="30" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="50" x2="64" y2="50" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'))
add(22, "he said", t_custom(f'<path d="M28,40 Q50,26 72,40 L72,58 Q60,58 56,66 L52,58 Q40,58 28,54 Z" fill="{TEAL}"/><circle cx="42" cy="48" r="2" fill="{PAPER}"/><circle cx="50" cy="48" r="2" fill="{PAPER}"/><circle cx="58" cy="48" r="2" fill="{PAPER}"/>'))
add(22, "she said", t_custom(f'<path d="M28,40 Q50,26 72,40 L72,58 Q60,58 56,66 L52,58 Q40,58 28,54 Z" fill="{RED}"/><circle cx="42" cy="48" r="2" fill="{PAPER}"/><circle cx="50" cy="48" r="2" fill="{PAPER}"/><circle cx="58" cy="48" r="2" fill="{PAPER}"/>'))

# ============================================================ LESSON 23
add(23, "Istanbul", t_flag2(RED, GOLD, "IST"))
add(23, "Taif (city)", t_flag2(FOREST, PAPER_WHITE, "TIF"))
add(23, "Washington (city)", t_flag2(INK, RED, "DC"))

with open('/home/claude/vocab-app/gen_log3.txt', 'w') as f:
    for l, e in generated:
        f.write(f"{l}\t{e}\n")
print(f"Generated {len(generated)} icons (lessons 13-23)")
