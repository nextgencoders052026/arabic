// Shared date+time formatting — local device time (not UTC) everywhere a
// session timestamp is shown, e.g. "Sep 27, 2026, 3:45 PM".
export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
