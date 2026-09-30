export const THEMES = [
  {
    id: 'manuscript',
    label: 'Manuscript',
    swatch: { background: '#F1EAD6', ink: '#1E3A34', primary: '#C08A28', secondary: '#2F6F62' },
  },
  {
    id: 'night',
    label: 'Night',
    swatch: { background: '#1C2321', ink: '#EDE6D6', primary: '#D4A94C', secondary: '#4A9484' },
  },
  {
    id: 'green',
    label: 'Green',
    swatch: { background: '#E3EDE2', ink: '#1B3B2A', primary: '#3C8452', secondary: '#D4A017' },
  },
]

const THEME_KEY = 'arabic-vocab-game:theme'
const DEFAULT_THEME = 'manuscript'

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return THEMES.some((t) => t.id === stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function setStoredTheme(themeId) {
  try {
    localStorage.setItem(THEME_KEY, themeId)
  } catch {
    // localStorage unavailable — the choice just won't persist
  }
}

export function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId)
}
