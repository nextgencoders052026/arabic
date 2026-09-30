import { App } from '@capacitor/app'

export async function getAppVersion() {
  try {
    const info = await App.getInfo()
    return `${info.version} (build ${info.build})`
  } catch {
    // App.getInfo() isn't available on web
    return 'unknown'
  }
}
