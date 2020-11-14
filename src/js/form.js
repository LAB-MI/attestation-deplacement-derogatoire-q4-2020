import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, $$, appendTo, createElement } from './dom-utils'
import { getBackup } from './localstorage'
import { setParam } from './util'

const createTitle = () => {
  // const h2 = createElement('h2', { className: 'titre-2', innerHTML: 'Votre déclaration numérique : ' })
  const p = createElement('p', { className: 'msg-info', innerHTML: 'Tous les champs sont obligatoires.' })
  const backup = getBackup()
  if (backup && backup.latestReasons) {
    const pReasons = createElement('p', { className: 'msg-info', innerHTML: 'Motifs récents : ' })
    const append = appendTo(pReasons)
    const reasonsData = getReasonsData()
    backup.latestReasons.forEach((reasons, i) => {
      const reasonsAlias = reasons.map(r => {
        const item = reasonsData.items.find(i => i.code === r)
        return item.alias || item.code
      })
      append(createElement('a', {
        innerText: reasonsAlias.join(', '),
        className: 'reason-quick-link',
        onclick: () => {
          const checkboxes = $$('[name="field-reason"]')
          for (const checkbox of checkboxes) {
            checkbox.checked = reasons.includes(checkbox.value)
          }
          setParam('raisons', reasonsAlias.join(','))
          return false
        },
      }))
      append(createElement('span', { innerText: ', ' }))
    })
    append(createElement('span', { innerText: ' ou ' }))
    append(createElement('a', {
      innerText: 'nouveau',
      className: 'reason-quick-link',
      onclick: () => {
        const checkboxes = $$('[name="field-reason"]')
        for (const checkbox of checkboxes) {
          checkbox.checked = false
        }
        setParam('raisons', '')
        $('#reason-fieldset').scrollIntoView(true)
        return false
      },
    }))
    append(createElement('span', { innerText: '.' }))
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

  const backup = getBackup()

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
    value: backup && backup.profile && backup.profile[name],
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const example = createElement('p', { className: 'exemple  basis-100' })

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)
  appendToInputGroup(example)

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

  const backup = getBackup()
  const reasonsFields = reasonsData.items.map(
    createReasonField((backup && backup.latestReasons) || []),
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

  const reasonsData = getReasonsData()

  const reasonFieldset = createReasonFieldset(reasonsData)
  appendToForm([...createTitle(), ...formFirstPart, reasonFieldset])
}

const getReasonsData = () => formData
  .flat(1)
  .find(field => field.key === 'reason')
