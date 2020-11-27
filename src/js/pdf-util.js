import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function generatePdf(profile, pdfBase) {
  const creationInstant = new Date()
  const creationDate = creationInstant.toLocaleDateString('fr-FR')
  const creationHour = creationInstant
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    lastnameAgent,
    firstnameAgent,
    telAgent,
    mandate,
    card,
    agency,
    address,
    zipcode,
    city,
    datesortie,
    heuresortie,
  } = profile

  const data = [
    `Cree le: ${creationDate} a ${creationHour}`,
    `Nom: ${lastname}`,
    `Prenom: ${firstname}`,
    `Nom de l'agent: ${lastnameAgent}`,
    `Prenom de l'agent: ${firstnameAgent}`,
    `Tel de l'agent: ${telAgent}`,
    `Mandat: ${mandate}`,
    `Carte: ${card}`,
    `Agence: ${agency}`,
    `Adresse: ${address} ${zipcode} ${city}`,
    `Sortie: ${datesortie} a ${heuresortie}`,
    '', // Pour ajouter un ; aussi au dernier élément
  ].join(';\n')

  const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('COVID-19 - Justificatif de déplacement')
  pdfDoc.setSubject(
    'Justificatif de déplacement pour la visite d un bien immobilier'
  )
  pdfDoc.setKeywords([
    'covid19',
    'covid-19',
    'attestation',
    'déclaration',
    'déplacement',
    'officielle',
    'gouvernement',
  ])
  pdfDoc.setProducer('DNUM/SDIT')
  pdfDoc.setCreator('')
  pdfDoc.setAuthor('Proprioo')

  const page1 = pdfDoc.getPages()[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${address} ${zipcode} ${city}`, 162, 702)
  drawText(`le ${datesortie} à ${heuresortie}`, 168, 688)
  drawText(`${agency}`, 179, 674)
  drawText(`${card}`, 244, 659)
  drawText(`${firstnameAgent} ${lastnameAgent} ${telAgent}`, 167, 645)
  drawText(`${mandate}`, 177, 630)
  drawText(`${firstname} ${lastname}`, 119, 616)

  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], { type: 'application/pdf' })
}
