import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generatePdf (e) {
  e.stopPropagation()

  const pdfBase = document.getElementById('file').files[0]
  const buffer = await pdfBase.arrayBuffer()

  const pdfDoc = await PDFDocument.load(buffer)

  const pages = pdfDoc.getPages()

  const page1 = pages[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  let x
  let y
  for (x = 25; x < 1000; x += 25) {
    for (y = 25; y < 1000; y += 25) {
      drawText('.', {
        x: x,
        y: y,
        size: 11,
        font: font,
        color: rgb(0.95, 0.1, 0.1),
      })
      drawText(`${x}`, {
        x: x + 3,
        y: y,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      })
      drawText(`${y}`, {
        x: x + 3,
        y: y - 6,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  }

  pdfDoc.addPage()

  const pdfBytes = await pdfDoc.save()

  // Trigger the browser to download the PDF document

  const pdfAsBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  downloadBlob(pdfAsBlob, 'grid.pdf', 'application/pdf')
}

function downloadBlob (blob, fileName) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
}

document.querySelector('#file').addEventListener('change', generatePdf)
