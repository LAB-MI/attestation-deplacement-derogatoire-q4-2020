import { generateQR } from './util'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generatePdf (profile, pdfBase) {
  const creationInstant = new Date()
  const creationDate = creationInstant.toLocaleDateString('fr-FR')
  const creationHour = creationInstant
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    tel,
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
    `Tel: ${tel}`,
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
  pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
  pdfDoc.setSubject('Attestation de déplacement dérogatoire')
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
  pdfDoc.setAuthor("Ministère de l'intérieur")

  const page1 = pdfDoc.getPages()[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  // drawText(`${firstname} ${lastname}`, 107, 657)
  // drawText(birthday, 107, 627)
  // drawText(placeofbirth, 240, 627)
  drawText(`${address} ${zipcode} ${city}`, 162, 702)
  drawText(`le ${datesortie} à ${heuresortie}`, 168, 688)
  drawText(`${agency}`, 179, 674)
  drawText(`${card}`, 244, 659)
  drawText(`${firstnameAgent} ${lastnameAgent} ${telAgent}`, 167, 645)
  drawText(`${mandate}`, 177, 630)
  drawText(`${firstname} ${lastname} ${tel}`, 119, 616)

  // const shortCreationDate = `${creationDate.split('/')[0]}/${
  //   creationDate.split('/')[1]
  // }`
  // drawText(shortCreationDate, 314, 189, locationSize)

  // // Date création
  // drawText('Date de création:', 479, 130, 6)
  // drawText(`${creationDate} à ${creationHour}`, 470, 124, 6)

  const qrTitle1 = 'QR-code contenant les informations '
  const qrTitle2 = 'de votre attestation numérique'

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  page1.drawText(qrTitle1 + '\n' + qrTitle2, { x: 415, y: 135, size: 9, font, lineHeight: 10, color: rgb(1, 1, 1) })

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 156,
    y: 25,
    width: 92,
    height: 92,
  })

  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], { type: 'application/pdf' })
}
