import {generatePdf} from './pdf-util.js'
import {downloadBlob} from './dom-utils.js'

const autoPdf = async (infos, reasonFlags, hour) => {
    console.debug('CREATING AUTO PDF', {infos, reasonFlags, hour})

    const hourStr = hour
        .toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
        .replace(':', '-')


    const profile = {
        firstname: infos.firstname,
        lastname: infos.lastname,
        address: infos.address,
        birthday: infos.birthday,
        placeofbirth: infos.placeofbirth,
        city: infos.city,
        zipcode: infos.zipcode,
        heuresortie: hourStr,
        datesortie: new Date().toLocaleDateString('fr-CA'),
        'ox-achats': 'achats',
        'ox-convocation': 'convocation',
        'ox-enfants': 'enfants',
        'ox-famille': 'famille',
        'ox-handicap': 'handicap',
        'ox-missions': 'missions',
        'ox-sante': 'sante',
        'ox-sport_animaux': 'sport_animaux',
        'ox-travail': 'travail',

    }

    const reasons = []
    if (reasonFlags.achats) reasons.push('achats')
    if (reasonFlags.convocation) reasons.push('convocation')
    if (reasonFlags.enfants) reasons.push('enfants')
    if (reasonFlags.famille) reasons.push('famille')
    if (reasonFlags.handicap) reasons.push('handicap')
    if (reasonFlags.missions) reasons.push('missions')
    if (reasonFlags.sante) reasons.push('sante')
    if (reasonFlags.sport_animaux) reasons.push('sport_animaux')
    if (reasonFlags.travail) reasons.push('travail')

    const pdfBase = '/certificate.9e278a37.pdf'

    const pdfBlob = await generatePdf(profile, reasons.join(', '), pdfBase)

    const creationInstant = new Date()
    const creationDate = creationInstant.toLocaleDateString('fr-CA')
    const creationHour = creationInstant
        .toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
        .replace(':', '-')

    downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`)
}


const infos = {
    firstname: 'Régis',
    lastname: 'Canioncq',
    address: '11 rue Deloye',
    city: 'Nice',
    birthday: '25/01/1981',
    placeofbirth: 'Nice',
    zipcode: '06000'
}

const flags = {
    achats: true,
    convocation: false,
    enfants: false,
    famille: false,
    handicap: false,
    missions: false,
    sante: false,
    sport_animaux: false,
    travail: false,
}

const hour = new Date()


autoPdf(infos, flags, hour)
