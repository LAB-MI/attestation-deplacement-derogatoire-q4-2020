import SecureLS from 'secure-ls'

const ls = new SecureLS({ encodingType: 'aes' })

const profileKeys = [
  'address',
  'birthday',
  'city',
  'firstname',
  'lastname',
  'placeofbirth',
  'zipcode',
]

// Convert previously existing localStorage
if (window.localStorage && window.localStorage.getItem('form-value-reasons')) {
  const profile = profileKeys.reduce(
    (o, k) => (o[k] = window.localStorage.getItem(`form-value-${k}`), o),
    {},
  )
  const reasons = (window.localStorage.getItem('form-value-reasons') || '')
    .split(/,\s*/)
  const latestReasons = (window.localStorage.getItem('form-value-latest-reasons') || '')
    .split('|')
    .map(rs => rs.split(/,\s*/))
  ls.set('backup', { profile, reasons, latestReasons })
  profileKeys
    .concat(['reasons', 'latest-reasons'])
    .map(k => `form-value-${k}`)
    .forEach(k => window.localStorage.removeItem(k))
}

const reasonsAsComparableString = rs => rs.slice().sort().join('|')

export function getBackup () {
  return ls.get('backup')
}

export function getPreviousFormValue (name) {
  return localStorage.getItem(`form-value-${name}`)
}

const filterProfileForBackup = profile => profileKeys
  .reduce((o, k) => (o[k] = profile[k], o), {})

export function saveBackup (profile, reasons) {
  const backup = getBackup()

  // Store the 3 latest reasons set used
  const reasonsString = reasonsAsComparableString(reasons)
  const latestReasons = (backup && backup.latestReasons || [])
    // Remove currently selected reason
    .filter(rs => reasonsAsComparableString(rs) !== reasonsString)
    // Keep only the first 2
    .slice(0, 2)
  // Prepend currently selected reasons, so they're first in new list
  latestReasons.unshift(reasons)

  ls.set('backup', {
    profile: filterProfileForBackup(profile),
    reasons,
    latestReasons,
  })
}

export function updateBackup (profile, reasons) {
  const backup = ls.get('backup') || {}
  if (profile) {
    backup.profile = filterProfileForBackup(profile)
  }
  if (reasons) {
    backup.reasons = reasons
  }
  ls.set('backup', backup)
}

export function clearBackup () {
  ls.removeAll()
}
