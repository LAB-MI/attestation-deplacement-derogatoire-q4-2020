import QRCode from 'qrcode'
const formData = require('../form-data.json')

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
  const newParams = oldParams.split('&').map(part => {
    if (part.startsWith(`${key}=`)) {
      return (key + '=' + value)
    }
    return part
  })

  // Crée un param si inexistant
  if (!newParams.includes(key + '=' + value)) {
    newParams.push(key + '=' + value)
  }

  // Nettoie les paramètres
  const newParamsStr = cleanParams('#' + newParams.join('&'))

  // Définit
  window.location.hash = newParamsStr
  return newParamsStr
}

export function getParam (key) {
  const params = window.location.hash.substr(1).split('&')
  const param = params?.find((val) => val.startsWith(key + '='))
  return param?.substr((key + '=').length)
}

export function cleanParams (params = window.location.hash) {
  const oldParams = params.substr(1)
  let newParams = oldParams.split('&')

  // Supprime les doublons
  const alreadySeen = []
  newParams = newParams.filter(param => {
    if (!param?.includes('=') && param !== 'auto') return false
    const split = param.split('=')
    const key = split[0]
    const value = split[1]
    if (!value) return false
    if (alreadySeen.includes(key)) return false
    alreadySeen.push(key)
    return true
  })

  // Met dans l'ordre
  const rightOrder = formData.flat(1).filter(data => !data.isHidden).map(data => data.alias || data.key)
  newParams = rightOrder.map((elem, index) => {
    const peer = newParams.find((param) => {
      return param.split('=')[0] === elem
    })
    if (!peer) return false
    return elem + '=' + peer.split('=')[1]
  })

  // Supprime les cadavres
  newParams = newParams.filter((elem) => !!elem)

  // Retourne les params nettoyés
  return '#' + newParams.join('&')
}
