export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getIconPath(word) {
  return `/icons/l${word.lesson}/${slugify(word.en)}.svg`
}
