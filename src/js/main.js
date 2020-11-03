import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import './icons'
import './check-updates'
import { prepareForm } from './form-util'
import { warnFacebookBrowserUserIfNecessary } from './facebook-util'
import { addVersion } from './util'
import { createForm } from './form'
import WindowStorage, { LOCAL_STORAGE } from './storage-helper'

const storage = new WindowStorage('attestation_ministere', LOCAL_STORAGE)
warnFacebookBrowserUserIfNecessary()
createForm(storage)
prepareForm(storage)
addVersion(process.env.VERSION)
