export function trackPwaInstall() {
  window.addEventListener('appinstalled', () => {
    window.goatcounter?.count({
      path: 'pwa-install',
      title: 'PWA Installed',
      event: true,
    })
  })
}
