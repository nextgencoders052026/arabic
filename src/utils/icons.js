export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getIconPath(word) {
  // BASE_URL is '/' locally and '/arabic/' on GitHub Pages — a hardcoded
  // leading '/' here would 404 under that subpath (Vite only rewrites
  // asset paths it processes at build time, not plain runtime strings).
  return `${import.meta.env.BASE_URL}icons/l${word.lesson}/${slugify(word.en)}.svg`
}
