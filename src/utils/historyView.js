const VIEW_KEY = 'arabic-vocab-game:history-view'
const DEFAULT_VIEW = 'trends'
const VALID_VIEWS = ['trends', 'all-sessions']

export function getStoredHistoryView() {
  try {
    const stored = localStorage.getItem(VIEW_KEY)
    return VALID_VIEWS.includes(stored) ? stored : DEFAULT_VIEW
  } catch {
    return DEFAULT_VIEW
  }
}

export function setStoredHistoryView(view) {
  try {
    localStorage.setItem(VIEW_KEY, view)
  } catch {
    // localStorage unavailable — the choice just won't persist
  }
}
