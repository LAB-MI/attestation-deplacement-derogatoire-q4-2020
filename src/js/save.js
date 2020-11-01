import { $, $$, appendTo, createElement } from './dom-utils'

export function getInputsMap (formInputs) {
  let map = {};

  formInputs.forEach((input) => {
    let id = input.id;
    let value;
    let type = input.type;

    switch(type) {
      case "checkbox":
        value = input.checked;
        break;
      default:
        value = input.value;
        break;
    }

    map[id] = {
      "id": id,
      "value": value,
      "type": type,
    };
  });

  return map;
}

export function restoreInputsMap (formInputs, map) {
  if (!map) {
    return false;
  }

  formInputs.forEach((input) => {
    let id = input.id;
    let item = map[id];

    if (item) {
      let value = item["value"];
      let type = item["type"];

      // Make it's the same input type as when we saved
      if (type == input.type) {
        switch(input.type) {
          case "checkbox":
            input.checked = value;
            break;
          case "date":
          case "time":
            // Do not restore those fields
            break;
          default:
            input.value = value;
            break;
        }
      }
    }
  });
}

export function browserSave(key, data) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }

  alert("Votre navigateur ne supporte malheureusement pas la sauvegarde");
  return false;
}
export function browserGet(key) {
  if (typeof(Storage) !== "undefined") {
    const item  = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch(e) {
        console.log("Error while deserializing saved item", e);
      }
    }
  } else {
    alert("Votre navigateur ne supporte malheureusement pas la sauvegarde");
  }


  return null;
}


export function handleSave () {
    const form = $('#form-profile');
    const formInputs = $$('#form-profile input');
    const savebar = $('#savebar')
    const profile = "default";
    const mapKey = profile + "_map";

    const existingMap = browserGet(mapKey);
    if (existingMap) {
      restoreInputsMap(formInputs, existingMap);
    }

    $('#save-btn').addEventListener('click', async (event) => {
        event.preventDefault();

        const map = getInputsMap(formInputs);
        if (browserSave(mapKey, map)) {
          savebar.classList.remove('d-none')
          setTimeout(() => savebar.classList.add('show'), 100)

          setTimeout(function () {
            savebar.classList.remove('show')
            setTimeout(() => savebar.classList.add('d-none'), 500)
          }, 6000)
        }

        return;

        /*

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

        console.log(getProfile(formInputs), reasons)

        const pdfBlob = await generatePdf(getProfile(formInputs), reasons, pdfBase)

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
        }, 6000)*/
    });


}
