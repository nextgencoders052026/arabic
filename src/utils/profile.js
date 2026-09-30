const NAME_KEY = 'arabic-vocab-game:name'

export function getStoredName() {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

export function setStoredName(name) {
  try {
    localStorage.setItem(NAME_KEY, name)
  } catch {
    // localStorage unavailable — the name just won't persist
  }
}
