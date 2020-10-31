import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import './icons'
import './check-updates'
import {prepareForm} from './form-util'
import {warnFacebookBrowserUserIfNecessary} from './facebook-util'
import {addVersion} from './util'
import {createForm} from './form'
import {generatePdf} from './pdf-util.js'
import {downloadBlob} from './dom-utils.js'

warnFacebookBrowserUserIfNecessary()
createForm()
prepareForm()
addVersion(process.env.VERSION)
