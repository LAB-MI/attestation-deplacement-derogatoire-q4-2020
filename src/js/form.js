import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, appendTo, createElement } from './dom-utils'

const createTitle = () => {
  const h2 = createElement('h2', {
    className: 'titre-2',
    innerHTML: 'Saisissez les informations de la visite :',
  })
  const p = createElement('p', {
    className: 'msg-info',
    innerHTML:
      'Proprioo met à disposition des agents immobiliers un générateur de bons pour visite à destination des acheteurs conformément aux préconisations du gouvernement.<br /><br /><span class="danger-emoji">⚠️</span> <b>Aucune information n’est collectée ni conservée ni transférée à des tiers.</b>',
  })
  return [p, h2]
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
  name,
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' , className: 'column'})
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', {
    className: 'input-group align-items-center',
  })
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
    required: false,
    type,
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

export function createForm() {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)



  const formFirstPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 1)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: index === 0,
        ...field,
        name: field.key,
      })

      return formGroup
    })
    
      const rowFirstPart = createElement('div', {
        className: 'row',
      })
      const appendToRow1 = appendTo(rowFirstPart)
      appendToRow1(formFirstPart)

    

    const formSecondPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 2)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })
    
    const rowSecondPart = createElement('div', {
      className: 'row',
    })
    const appendToRow2 = appendTo(rowSecondPart)
    appendToRow2(formSecondPart)



    const formThirdPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 3)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })

    const rowThirdPart = createElement('div', {
      className: 'row',
    })
    const appendToRow3 = appendTo(rowThirdPart)
    appendToRow3(formThirdPart)


    const formFourPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 4)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })

    const rowFourPart = createElement('div', {
      className: 'row',
    })
    const appendToRow4 = appendTo(rowFourPart)
    appendToRow4(formFourPart)

    const formFivePart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 5)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })

    const rowFivePart = createElement('div', {
      className: 'row',
    })
    const appendToRow5 = appendTo(rowFivePart)
    appendToRow5(formFivePart)


    const formSixPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 6)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })

    const rowSixPart = createElement('div', {
      className: 'row',
    })
    const appendToRow6 = appendTo(rowSixPart)
    appendToRow6(formSixPart)


    const formSevenPart = formData
    .flat(1)
    .filter((field) => field.key !== 'reason')
    .filter((field) => !field.isHidden)
    .filter((field) => field.group == 7)
    .map((field, index) => {
      const formGroup = createFormGroup({
        autofocus: false,
        ...field,
        name: field.key,
      })
      return formGroup
    })

    const rowSevenPart = createElement('div', {
      className: 'row',
    })
    const appendToRow7 = appendTo(rowSevenPart)
    appendToRow7(formSevenPart)

    appendToForm([...createTitle(), rowFirstPart,  
      createElement('hr'), rowSecondPart,  
      createElement('hr'), rowThirdPart,  
      createElement('hr'), rowFourPart,  
      createElement('hr'), rowFivePart, rowSixPart, 
      createElement('hr'), rowSevenPart])
}
