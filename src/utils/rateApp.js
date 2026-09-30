import { Capacitor } from '@capacitor/core'
import { InAppReview } from '@capacitor-community/in-app-review'

// Uses the native in-app review prompt (Android In-App Review API /
// iOS SKStoreReviewController under the hood) rather than linking out to
// the store listing. Has no web implementation, so this is a no-op
// (caught and logged) outside a native Capacitor build. Used for the
// automatic background prompt (after N sessions) — silent-on-web is
// correct there, since the user never asked for anything.
export async function requestAppReview() {
  try {
    await InAppReview.requestReview()
  } catch (err) {
    console.error('In-app review prompt unavailable', err)
  }
}

// For the explicit "Rate this app" drawer item — unlike the silent
// background prompt above, this is an action the user deliberately took,
// so it deserves visible feedback on web rather than doing nothing.
export function requestAppReviewManual() {
  if (!Capacitor.isNativePlatform()) {
    window.alert("Rating isn't available in the web version — install the Android or iOS app to rate it.")
    return
  }
  return requestAppReview()
}
