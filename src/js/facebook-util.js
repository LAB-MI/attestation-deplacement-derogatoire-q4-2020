import { $ } from './dom-utils'

export function warnFacebookBrowserUserIfNecessary () {
  if (isFacebookBrowser()) {
    const alertFacebookElt = $('#alert-facebook')
    alertFacebookElt.value =
      "ATTENTION !! Vous utilisez actuellement le navigateur Facebook, ce générateur ne fonctionne pas correctement au sein de ce navigateur ! Merci d'ouvrir Chrome sur Android ou bien Safari sur iOS."
    alertFacebookElt.classList.remove('d-none')
  }
}
// see: https://stackoverflow.com/a/32348687/1513045
function isFacebookBrowser () {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  return ua.includes('FBAN') || ua.includes('FBAV')
}
