import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

// The report should match whatever theme is actually active on screen at
// export time. html2canvas captures by cloning the document into an
// off-screen iframe, and that clone doesn't reliably resolve CSS custom
// properties scoped via [data-theme="..."] on the real <html> element — so
// instead of relying on the clone to inherit the live theme, read out the
// current theme's *resolved* color values here (on the real, non-cloned
// document) and pass them down as literal inline overrides. That sidesteps
// clone/inheritance issues entirely.
export function getExportThemeVars() {
  const style = getComputedStyle(document.documentElement)
  const read = (name) => style.getPropertyValue(name).trim()

  const parchment = read('--color-parchment')
  const ink = read('--color-ink')

  return {
    '--color-parchment': parchment,
    '--color-parchment-shade': read('--color-parchment-shade'),
    '--color-ink': ink,
    '--color-ink-soft': read('--color-ink-soft'),
    '--color-brass': read('--color-brass'),
    '--color-brass-soft': read('--color-brass-soft'),
    '--color-teal': read('--color-teal'),
    '--color-teal-soft': read('--color-teal-soft'),
    '--color-error': read('--color-error'),
    '--color-error-soft': read('--color-error-soft'),
    '--color-border': read('--color-border'),
    '--shadow-card': read('--shadow-card'),
    '--success': read('--success'),
    '--warning': read('--warning'),
    '--needs-work': read('--needs-work'),
    background: parchment,
    color: ink,
  }
}

const PAGE_WIDTH_PT = 595.28 // A4 @ 72pt/in
const PAGE_HEIGHT_PT = 841.89

// Recharts sizes its charts via ResizeObserver after mount, and the header
// logo needs to finish loading — both need a moment before html2canvas takes
// its snapshot, or it captures an empty/half-drawn layout.
export async function waitForCaptureReady(...elements) {
  const images = elements.flatMap((el) => (el ? [...el.querySelectorAll('img')] : []))
  await Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          }),
    ),
  )
  // A plain timer, not requestAnimationFrame — rAF is paused indefinitely by
  // some browsers/webviews when the tab isn't the visible/foregrounded one,
  // which would hang this forever; a timer still fires either way and is
  // plenty of margin for recharts' ResizeObserver-driven layout to settle.
  await new Promise((resolve) => setTimeout(resolve, 250))
}

// Walk the offsetParent chain to get an element's bottom edge relative to ancestor (DOM px).
function relativeOffsetBottom(el, ancestor) {
  let top = 0
  let curr = el
  while (curr && curr !== ancestor) {
    top += curr.offsetTop
    curr = curr.offsetParent
  }
  return top + el.offsetHeight
}

async function addElementAsPages(pdf, element, { startNewPage, backgroundColor }) {
  // scale: 2 (not devicePixelRatio, which can be 3x on modern phones) and
  // JPEG at 0.75 quality (not lossless PNG) — this content is mostly flat
  // cards, text, and simple charts, so the size difference is dramatic with
  // no visible quality loss for a report viewed on screen or printed.
  const canvas = await html2canvas(element, { scale: 2, backgroundColor })
  const CAPTURE_SCALE = 2 // must match the scale: 2 above
  const pxPerPt = canvas.width / PAGE_WIDTH_PT
  const pageHeightPx = PAGE_HEIGHT_PT * pxPerPt

  // Collect safe vertical cut positions: the bottom edge of every significant
  // block (cards, mode sections, direct children). Cuts placed here never
  // slice through a card mid-way.
  const breakSet = new Set([0, canvas.height])
  for (const child of element.querySelectorAll(
    ':scope > *, :scope > * > *, .card, .export-report__mode-block'
  )) {
    const bottom = Math.round(relativeOffsetBottom(child, element) * CAPTURE_SCALE)
    if (bottom > 0 && bottom < canvas.height) breakSet.add(bottom)
  }
  const breaks = [...breakSet].sort((a, b) => a - b)

  // `startNewPage` only controls whether a page is added *before* this
  // element starts (so it lands after whatever the previous element drew).
  // The first slice drawn here always lands on whatever page is current at
  // that point — never behind another addPage() — regardless of
  // startNewPage, or an extra blank page is inserted between elements.
  if (startNewPage) pdf.addPage()
  let sliceStart = 0
  let isFirstPage = true

  while (sliceStart < canvas.height) {
    const idealEnd = sliceStart + pageHeightPx
    // Pick the last safe break point that still fits within one page.
    // If none exists (single element taller than a page), fall back to the
    // page boundary so we don't loop forever.
    const viable = breaks.filter(b => b > sliceStart && b <= idealEnd)
    const sliceEnd = viable.length > 0
      ? viable[viable.length - 1]
      : Math.min(idealEnd, canvas.height)
    if (sliceEnd <= sliceStart) break

    const slice = document.createElement('canvas')
    slice.width = canvas.width
    slice.height = Math.ceil(sliceEnd - sliceStart)
    slice.getContext('2d').drawImage(
      canvas,
      0, sliceStart, canvas.width, slice.height,
      0, 0, canvas.width, slice.height
    )

    if (!isFirstPage) pdf.addPage()
    pdf.addImage(slice.toDataURL('image/jpeg', 0.75), 'JPEG', 0, 0, PAGE_WIDTH_PT, slice.height / pxPerPt)

    sliceStart = sliceEnd
    isFirstPage = false
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function exportHistoryReport({ trendsEl, allSessionsEl, filename }) {
  const pdf = new jsPDF('p', 'pt', 'a4')
  // Read on the real (non-cloned) document, right before capture, so the
  // canvas background matches whichever theme is actually active.
  const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-parchment')
    .trim()

  await addElementAsPages(pdf, trendsEl, { startNewPage: false, backgroundColor })
  await addElementAsPages(pdf, allSessionsEl, { startNewPage: true, backgroundColor })

  const blob = pdf.output('blob')

  if (Capacitor.getPlatform() === 'ios') {
    // iOS: save directly to the app's Documents directory. With
    // UIFileSharingEnabled in Info.plist the file is immediately visible
    // in Files app → On My iPhone → Lisan — no share sheet needed.
    const base64 = await blobToBase64(blob)
    await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    })
  } else if (Capacitor.getPlatform() === 'android') {
    const base64 = await blobToBase64(blob)
    try {
      // Direct save to the public Downloads folder (works on Android ≤ 10
      // with requestLegacyExternalStorage, and on Android 9 and below).
      await Filesystem.writeFile({
        path: 'Download/' + filename,
        data: base64,
        directory: Directory.ExternalStorage,
        recursive: true,
      })
    } catch {
      // Android 11+ scoped-storage blocks direct external writes — fall back
      // to the Share sheet so the user can still save the file.
      const { uri } = await Filesystem.writeFile({
        path: filename,
        data: base64,
        directory: Directory.Cache,
      })
      await Share.share({ title: 'Lisan — Progress Report', url: uri })
    }
  } else {
    // Use application/octet-stream so the browser treats this as a generic
    // binary download rather than opening it in its built-in PDF viewer
    // (which shows a "Save" button requiring extra interaction).
    const downloadBlob = blob.slice(0, blob.size, 'application/octet-stream')
    const url = URL.createObjectURL(downloadBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }
}
