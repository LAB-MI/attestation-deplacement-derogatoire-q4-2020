const localStorage = window.localStorage || {
  getItem: () => null,
  setItem: () => undefined,
  clear: () => undefined,
}

export function getPreviousFormValue (name) {
  return localStorage.getItem(`form-value-${name}`)
}

export function setPreviousFormValue (name, value) {
  localStorage.setItem(`form-value-${name}`, value)
}

export function clearPreviousFormValues () {
  localStorage.clear()
}
