import { $, $$, downloadBlob } from './dom-utils'
import { addSlash, getFormattedDate, getFormattedTime, setParam, getParam } from './util'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'
import { setPreviousFormValue } from './localstorage'

const formData = require('../form-data')

let params = new URLSearchParams(window.location.hash.substr(1))

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

export function setReleaseDateTime (releaseDateInput, releaseTimeInput) {
  const loadedDate = new Date()
  loadedDate.setMinutes(loadedDate.getMinutes() + 5)
  releaseDateInput.value = getFormattedDate(loadedDate)
  releaseTimeInput.value = getFormattedTime(loadedDate)
}

export function getProfile (formInputs) {
  const fields = {}
  for (const field of formInputs) {
    let value = field.value
    if (field.id === 'field-datesortie') {
      const dateSortie = field.value.split('-')
      value = `${dateSortie[2]}/${dateSortie[1]}/${dateSortie[0]}`
    }
    fields[field.id.substring('field-'.length)] = value
  }
  return fields
}

export function getReasons (reasonInputs) {
  const reasons = reasonInputs
    .filter(input => input.checked)
    .map(input => input.value).join(', ')
  return reasons
}

export function prepareInputs (formInputs, reasonInputs, reasonFieldset, reasonAlert, snackbar) {
  formInputs.forEach((input) => {
    const exempleElt = input.parentNode.parentNode.querySelector('.exemple')
    const validitySpan = input.parentNode.parentNode.querySelector('.validity')
    if (input.placeholder && exempleElt) {
      input.addEventListener('input', (event) => {
        if (input.value) {
          exempleElt.innerHTML = 'ex.&nbsp;: ' + input.placeholder
          validitySpan.removeAttribute('hidden')
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

  const generateBtns = $$('.generate-btn');
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

      ;[
        'address',
        'birthday',
        'city',
        'firstname',
        'lastname',
        'placeofbirth',
        'zipcode',
      ].forEach(inputName => setPreviousFormValue(inputName, profile[inputName]))

      const pdfBlob = await generatePdf(profile, reasons, pdfBase)

      const creationInstant = new Date()
      const creationDate = creationInstant.toLocaleDateString('fr-CA')
      const creationHour = creationInstant
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', '-')

      downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`)

      snackbar.classList.remove('d-none')
      setTimeout(() => snackbar.classList.add('show'), 100)

      setTimeout(function () {
        snackbar.classList.remove('show')
        setTimeout(() => snackbar.classList.add('d-none'), 500)
      }, 6000)
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
 * Modifie les entrées du formulaire en fonction des paramètres spécifiés sous forme d'URI fragments
 */
export function followParams () {
  // Remplit les entrées du formulaire
  formData.flat(1)
    .filter(field => field.key !== 'reason')
    .filter(field => !field.isHidden)
    .forEach(data => {
      const name = data.alias || data.key
      const field = $('#field-' + data.key)
      if (params.has(name)) field.value = params.get(name)
    })

  // Coche les raisons
  const reasonsObj = formData.flat(1).find(field => field.key === 'reason')
  reasonsObj.items.forEach(data => {
    const name = data.alias || data.code
    const field = $('#checkbox-' + data.code)
    if (params.get(reasonsObj.alias || 'raisons' || reasonsObj.key)?.split(',').includes(name) && !field.checked) field.click()
  })

  // Génère automatiquement le PDF si besoin
  if (params.has('auto')) $('#generate-btn').click()
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
        setParam(name, e.target.value)
        params = new URLSearchParams(window.location.hash.substr(1))
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
