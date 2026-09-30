// Recharts needs colors passed as explicit prop values — it can't read CSS
// variables itself — so we read the active theme's tokens from the DOM here.
export function getThemeColors() {
  const style = getComputedStyle(document.documentElement)
  const read = (name) => style.getPropertyValue(name).trim()

  return {
    success: read('--success'),
    warning: read('--warning'),
    'needs-work': read('--needs-work'),
    ink: read('--color-ink'),
    inkSoft: read('--color-ink-soft'),
    border: read('--color-border'),
    parchmentShade: read('--color-parchment-shade'),
  }
}
