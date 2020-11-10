import removeAccents from 'remove-accents'

import { $, $$, downloadBlob } from './dom-utils'
import { addSlash, getFormattedDate, getFormattedTime, setParam, getParam, pad2Zero, clearParams } from './util'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'
import { getBackup, saveBackup, clearBackup, restoreBackup, updateBackup } from './localstorage'

const formData = require('../form-data')

const clearDataSnackbar = $('#snackbar-cleardata')

const conditions = {
  '#field-firstname': {
    length: 1,
  },
  '#field-lastname': {
    length: 1,
  },
  '#field-birthday': {
    pattern: /^([0][1-9]|[1-2][0-9]|30|31)\/([0][1-9]|10|11|12)\/(19[0-9][0-9]|20[0-1][0-9]|2020)/g,
  },
  '#field-placeofbirth': {
    length: 1,
  },
  '#field-address': {
    length: 1,
  },
  '#field-city': {
    length: 1,
  },
  '#field-zipcode': {
    pattern: /\d{5}/g,
  },
  '#field-datesortie': {
    pattern: /\d{4}-\d{2}-\d{2}/g,
  },
  '#field-heuresortie': {
    pattern: /\d{2}:\d{2}/g,
  },
}

function validateAriaFields () {
  return Object.keys(conditions)
    .map((field) => {
      const fieldData = conditions[field]
      const pattern = fieldData.pattern
      const length = fieldData.length
      const isInvalidPattern = pattern && !$(field).value.match(pattern)
      const isInvalidLength = length && !$(field).value.length

      const isInvalid = !!(isInvalidPattern || isInvalidLength)

      $(field).setAttribute('aria-invalid', isInvalid)
      if (isInvalid) {
        $(field).focus()
      }
      return isInvalid
    })
    .includes(true)
}

function showSnackbar (snackbarToShow, showDuration = 6000) {
  snackbarToShow.classList.remove('d-none')
  setTimeout(() => snackbarToShow.classList.add('show'), 100)

  setTimeout(function () {
    snackbarToShow.classList.remove('show')
    setTimeout(() => snackbarToShow.classList.add('d-none'), 500)
  }, showDuration)
}

export function setReleaseDateTime (releaseDateInput, releaseTimeInput) {
  const loadedDate = new Date()
  loadedDate.setMinutes(loadedDate.getMinutes() + 5)
  releaseDateInput.value = getFormattedDate(loadedDate)
  releaseTimeInput.value = getFormattedTime(loadedDate)
}

export function toAscii (string) {
  if (typeof string !== 'string') {
    throw new Error('Need string')
  }
  const accentsRemoved = removeAccents(string)
  const asciiString = accentsRemoved.replace(/[^\x00-\x7F]/g, '') // eslint-disable-line no-control-regex
  return asciiString
}

export function getProfile (formInputs) {
  const fields = {}
  for (const field of formInputs) {
    let value = field.value
    if (field.id === 'field-datesortie') {
      const dateSortie = field.value.split('-')
      value = `${dateSortie[2]}/${dateSortie[1]}/${dateSortie[0]}`
    }
    if (typeof value === 'string') {
      value = toAscii(value)
    }
    fields[field.id.substring('field-'.length)] = value
  }
  return fields
}

export function getReasons (reasonInputs, asArray = false) {
  const reasons = reasonInputs
    .filter(input => input.checked)
    .map(input => input.value)
  return asArray ? reasons : reasons.join(', ')
}

export function prepareInputs (formInputs, reasonInputs, reasonFieldset, reasonAlert, snackbar, releaseDateInput) {
  // Restore backup
  const backup = getBackup()
  formInputs.forEach((input) => {
    if (!input.name || input.name === 'datesortie' || input.name === 'heuresortie') return;
    // Restore, then listen to changes
    if (input.name === 'field-reason') {
      if (backup && backup.reasons) {
        input.checked = backup.reasons.includes(input.value)
      }
      input.addEventListener('click', (event) => {
        updateBackup(null, getReasons(reasonInputs, true))
      })
    } else {
      if (backup && backup.profile) {
        input.value = backup.profile[input.name]
      }
      input.addEventListener('input', (event) => {
        if (input.value) {
          updateBackup(getProfile(formInputs), null)
        }
      })
    }
  })

  // Example spans
  formInputs.forEach((input) => {
    const exempleElt = input.parentNode.parentNode.querySelector('.exemple')
    if (input.placeholder && exempleElt) {
      input.addEventListener('input', (event) => {
        if (input.value) {
          exempleElt.innerHTML = 'ex.&nbsp;: ' + input.placeholder
        } else {
          exempleElt.innerHTML = ''
        }
      })
    }
  })

  $('#field-birthday').addEventListener('keyup', function (event) {
    event.preventDefault()
    const input = event.target
    const key = event.keyCode || event.charCode
    if (key !== 8 && key !== 46) {
      input.value = addSlash(input.value)
    }
  })

  reasonInputs.forEach(radioInput => {
    radioInput.addEventListener('change', function (event) {
      const isInError = reasonInputs.every(input => !input.checked)
      reasonFieldset.classList.toggle('fieldset-error', isInError)
      reasonAlert.classList.toggle('hidden', !isInError)
    })
  })

  const generateBtns = $$('.btn-attestation')
  for (const generateBtn of generateBtns) {
    generateBtn.addEventListener('click', async (event) => {
      event.preventDefault()

      const reasons = getReasons(reasonInputs)
      if (!reasons) {
        reasonFieldset.classList.add('fieldset-error')
        reasonAlert.classList.remove('hidden')
        reasonFieldset.scrollIntoView && reasonFieldset.scrollIntoView()
        return
      }

      const invalid = validateAriaFields()
      if (invalid) {
        return
      }

      const profile = getProfile(formInputs)

      saveBackup(profile, getReasons(reasonInputs, true))

      const pdfBlob = await generatePdf(profile, reasons, pdfBase)

      const creationInstant = new Date()
      const creationDate = creationInstant.toLocaleDateString('fr-CA')
      const creationHour = creationInstant
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', '-')

      downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`)

      showSnackbar(snackbar, 6000)
    })
  }
}

export function prepareForm () {
  const formInputs = $$('#form-profile input')
  const snackbar = $('#snackbar')
  const reasonInputs = [...$$('input[name="field-reason"]')]
  const reasonFieldset = $('#reason-fieldset')
  const reasonAlert = reasonFieldset.querySelector('.msg-alert')
  const releaseDateInput = $('#field-datesortie')
  const releaseTimeInput = $('#field-heuresortie')
  setReleaseDateTime(releaseDateInput, releaseTimeInput)
  prepareInputs(formInputs, reasonInputs, reasonFieldset, reasonAlert, snackbar)
}

/**
 * Modifie un champ de formulaire, en gérant quelques formats utiles
 */
function setField (input, name, value) {
  if (name === 'heuresortie' || name === 'heure') {
    // Accepter les valeurs relatives comme "-10m" ou "+1h"
    // Note: "+" sera converti en espace, d'où le "|\s" ci-dessous
    const match = value.match(/^(-|\+|\s)(\d+)(m|h)(\d+)?$/i)
    if (match) {
      const sign = match[1] === '-' ? -1 : +1
      const val1 = sign * Number(match[2])
      const unit = match[3]
      const val2 = sign * Number(match[4] || '0')
      let date = new Date()
      if (unit === 'm' || unit === 'M') {
        date.setMinutes(date.getMinutes() + val1)
        date.setSeconds(date.getSeconds() + val2)
      } else {
        date.setHours(date.getHours() + val1)
        date.setMinutes(date.getMinutes() + val2)
      }
      input.value = `${pad2Zero(date.getHours())}:${pad2Zero(date.getMinutes())}`
      return
    }
  }
  // Cas général: prendre la valeur tel quel
  input.value = value
}

/**
 * Modifie les entrées du formulaire en fonction des paramètres spécifiés sous forme d'URI fragments
 */
export function followParams (watch = true) {
  const params = new URLSearchParams(window.location.hash.substr(1))

  // Remplit les entrées du formulaire
  formData.flat(1)
    .filter(field => field.key !== 'reason')
    .filter(field => !field.isHidden)
    .forEach(data => {
      const name = data.alias || data.key
      const field = $('#field-' + data.key)
      if (params.has(name)) setField(field, name, params.get(name))
    })

  // Coche les raisons
  const reasonsObj = formData.flat(1).find(field => field.key === 'reason')
  reasonsObj.items.forEach(data => {
    const name = data.alias || data.code
    const field = $('#checkbox-' + data.code)
    if (params.get(reasonsObj.alias || 'raisons' || reasonsObj.key)?.split(',').includes(name) && !field.checked) field.click()
  })

  if (watch) {
    // Génère automatiquement le PDF si besoin, mais seulement au chargement
    if (params.has('auto')) $('.btn-attestation').click()
    // Surveiller les modifications d'URL après le chargement
    window.addEventListener('hashchange', () => {
      followParams(false)
    })
  }
}

export function listenToInputChanges () {
  // Champs
  formData.flat(1)
    .filter(field => field.key !== 'reason')
    .filter(field => !field.isHidden)
    .forEach(data => {
      const name = data.alias || data.key
      const input = document.getElementById('field-' + data.key)
      input.addEventListener('input', (e) => {
        if (name === 'date' || name === 'datesortie' || name === 'heure' || name === 'heuresortie') {
          // Set this one ONLY if it was already manually set in URL
          const previous = getParam(name)
          if (previous) {
            setParam(name, e.target.value)
          }
        } else {
          // Other fields always saved
          setParam(name, e.target.value)
        }
      })
    })

  // Raisons
  const reasonsObj = formData.flat(1).find(field => field.key === 'reason')
  reasonsObj.items.forEach(data => {
    const name = data.alias || data.code
    const checkbox = $('#checkbox-' + data.code)
    checkbox.addEventListener('click', (e) => {
      let reasons = getParam(reasonsObj.alias || 'raisons')?.split(',')
      if (!reasons) return setParam(reasonsObj.alias || 'raisons', name)
      if (checkbox.checked && !reasons.includes(name)) {
        reasons.push(name)
      } else if (!checkbox.checked && reasons.includes(name)) {
        reasons = reasons.filter(elem => elem !== name)
      }
      setParam(reasonsObj.alias || 'raisons', reasons.toString())
    })
  })
}

export function listenToClearData () {
  $('.btn-clear-data').addEventListener('click', e => {
    e.preventDefault()
    if (confirm('Confirmer la suppression de toutes vos données stockées localement')) {
      clearBackup()
      clearParams()
      showSnackbar(clearDataSnackbar, 6000)
      setTimeout(() => location.reload(), 6000)
    }
  })
}
