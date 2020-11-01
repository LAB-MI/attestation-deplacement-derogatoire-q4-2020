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

export function setParam (key, value) {
  const oldParams = window.location.hash.substr(1)

  // Remplace les params si existants
  let newParams = oldParams.split('&').map(part => {
    if (part.startsWith(`${key}=`)) {
      return (key + '=' + value)
    }
    return part
  })

  // Crée un param si inexistant
  if (!newParams.includes(key + '=' + value)) {
    newParams.push(key + '=' + value)
  }

  // Supprime les doublons de l'URI
  let alreadySet = false
  newParams = newParams.filter((val) => {
    if (val.startsWith(key + '=')) {
      if (alreadySet) return false
      alreadySet = true
    }
    return true
  })

  // Supprime elem 0 si nul (pour éviter les #& au lieu de #)
  while (newParams[0] === '') newParams.shift()

  if (!value) newParams = newParams.filter(param => (!param.startsWith(key)))

  window.location.hash = '#' + newParams.join('&')
}

export function getParam (key) {
  const params = window.location.hash.substr(1).split('&')
  const param = params?.find((val) => val.startsWith(key + '='))
  return param?.substr((key + '=').length)
}
