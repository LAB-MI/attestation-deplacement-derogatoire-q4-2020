import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, $$, appendTo, createElement } from './dom-utils'
import { getPreviousFormValue } from './localstorage'

const createTitle = () => {
  //const h2 = createElement('h2', { className: 'titre-2', innerHTML: 'Votre déclaration numérique : ' })
  const p = createElement('p', { className: 'msg-info', innerHTML: 'Tous les champs sont obligatoires.' })
  const latestReasons = getPreviousFormValue('latest-reasons')
  if (latestReasons) {
    const pReasons = createElement('p', { className: 'msg-info', innerHTML: 'Motifs récents : ' });
    const reasonsStrings = latestReasons.split('|')
    reasonsStrings.forEach((reasonsString, i) => {
      appendTo(pReasons)(createElement('a', {
        innerText: reasonsString,
        className: 'reason-quick-link',
        onclick: () => {
          const reasons = reasonsString.split(', ')
          const checkboxes = $$('[name="field-reason"]')
          for (const checkbox of checkboxes) {
            checkbox.checked = reasons.includes(checkbox.value)
          }
          return false
        },
      }))
      appendTo(pReasons)(createElement('span', {
        innerText: i === reasonsStrings.length - 1 ? '.' : ', ',
      }))
    })
    return [pReasons, p]
  }
  return []
}
// createElement('div', { className: 'form-group' })

const createFormGroup = ({
  autocomplete = false,
  autofocus = false,
  inputmode,
  label,
  max,
  min,
  maxlength,
  minlength,
  name, // here the 'key' value
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' })
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', { className: 'input-group align-items-center' })
  const inputAttrs = {
    autocomplete,
    autofocus,
    className: 'form-control',
    id: `field-${name}`,
    inputmode,
    min,
    max,
    minlength,
    maxlength,
    name,
    pattern,
    placeholder,
    required: true,
    type,
    value: getPreviousFormValue(name),
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)

  return formGroup
}

const createReasonField = (reasons) => (reasonData) => {
  const formReasonAttrs = { className: 'form-checkbox align-items-center' }
  const formReason = createElement('div', formReasonAttrs)
  const appendToReason = appendTo(formReason)

  const id = `checkbox-${reasonData.code}`
  const inputReasonAttrs = {
    className: 'form-check-input',
    type: 'checkbox',
    id,
    name: 'field-reason',
    value: reasonData.code,
    checked: reasons.includes(reasonData.code),
  }
  const inputReason = createElement('input', inputReasonAttrs)
  const labelAttrs = { innerHTML: reasonData.label, className: 'form-checkbox-label', for: id }
  const label = createElement('label', labelAttrs)

  appendToReason([inputReason, label])
  return formReason
}

const createReasonFieldset = (reasonsData) => {
  const fieldsetAttrs = {
    id: 'reason-fieldset',
    className: 'fieldset',
  }

  const fieldset = createElement('fieldset', fieldsetAttrs)
  const appendToFieldset = appendTo(fieldset)

  const legendAttrs = {
    className: 'legend titre-3',
    innerHTML: 'Choisissez un motif de déplacement',
  }
  const legend = createElement('legend', legendAttrs)

  const textAlertAttrs = { className: 'msg-alert hidden', innerHTML: 'Veuillez choisir un motif' }
  const textAlert = createElement('p', textAlertAttrs)

  const textSubscribeReasonAttrs = {
    innerHTML: 'certifie que mon déplacement est lié au motif suivant (cocher la case) autorisé par le décret n°2020-1310 du 29 octobre 2020 prescrivant les mesures générales nécessaires pour faire face à l\'épidémie de Covid19 dans le cadre de l\'état d\'urgence sanitaire  <a class="footnote" href="#footnote1">[1]</a>&nbsp;:',
  }

  const textSubscribeReason = createElement('p', textSubscribeReasonAttrs)

  const previousReasons = getPreviousFormValue('reasons')
  const reasonsFields = reasonsData.items.map(
    createReasonField(previousReasons ? previousReasons.split(', ') : [])
  )

  appendToFieldset([legend, textAlert, textSubscribeReason, ...reasonsFields])
  // Créer un form-checkbox par motif
  return fieldset
}

export function createForm () {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)

  const formFirstPart = formData
    .flat(1)
    .filter(field => field.key !== 'reason')
    .filter(field => !field.isHidden)
    .map((field,
      index) => {
      const formGroup = createFormGroup({
        autofocus: index === 0,
        ...field,
        name: field.key,
      })

      return formGroup
    })

  const reasonsData = formData
    .flat(1)
    .find(field => field.key === 'reason')

  const reasonFieldset = createReasonFieldset(reasonsData)
  appendToForm([...createTitle(), ...formFirstPart, reasonFieldset])
}
