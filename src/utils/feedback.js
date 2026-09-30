import { Device } from '@capacitor/device'
import { getAppVersion } from './appInfo'

const FEEDBACK_EMAIL = 'nextgencoders052026@gmail.com'
const FEEDBACK_SUBJECT = 'Arabic Vocab Game Feedback'

export async function sendFeedback() {
  const appVersion = await getAppVersion()

  let osInfo = 'unknown'
  try {
    const device = await Device.getInfo()
    osInfo = `${device.operatingSystem} ${device.osVersion}`
  } catch {
    // ignore — Device info is best-effort context for the report
  }

  const body = `App version: ${appVersion}\nDevice OS: ${osInfo}\n\n`
  const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(FEEDBACK_SUBJECT)}&body=${encodeURIComponent(body)}`
  window.location.href = mailto
}
