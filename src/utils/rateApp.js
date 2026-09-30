import { InAppReview } from '@capacitor-community/in-app-review'

// Uses the native in-app review prompt (Android In-App Review API /
// iOS SKStoreReviewController under the hood) rather than linking out to
// the store listing. Has no web implementation, so this is a no-op
// (caught and logged) outside a native Capacitor build.
export async function requestAppReview() {
  try {
    await InAppReview.requestReview()
  } catch (err) {
    console.error('In-app review prompt unavailable', err)
  }
}
