import QRCode from 'qrcode'

export function generateQR (text) {
  const opts = {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
  }
  return QRCode.toDataURL(text, opts)
}

export function pad2Zero (str) {
  return String(str).padStart(2, '0')
}

export function getFormattedDate (date) {
  const year = date.getFullYear()
  const month = pad2Zero(date.getMonth() + 1) // Les mois commencent à 0
  const day = pad2Zero(date.getDate())
  return `${year}-${month}-${day}`
}

export function addSlash (str) {
  return str
    .replace(/^(\d{2})$/g, '$1/')
    .replace(/^(\d{2})\/(\d{2})$/g, '$1/$2/')
    .replace(/\/\//g, '/')
}

export function addVersion (version) {
  document.getElementById(
    'version',
  ).innerHTML = `${new Date().getFullYear()} - ${version}`
}
