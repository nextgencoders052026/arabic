import { App } from '@capacitor/app'

// __APP_VERSION__ is injected at build time from package.json (see
// vite.config.js) — used as the web fallback since App.getInfo() (native
// build number) has no equivalent in a browser.
export async function getAppVersion() {
  try {
    const info = await App.getInfo()
    return `${info.version} (build ${info.build})`
  } catch {
    // App.getInfo() isn't available on web
    return __APP_VERSION__
  }
}
