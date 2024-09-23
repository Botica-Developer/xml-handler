import * as XLSX from 'xlsx-js-style'
import type { Exemption, ExemptionFlatted } from '@/interfaces'

export const downloadExcel = (exemptions: Exemption[]) => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet([])

  // Title Merge
  const title_text = `Exenciones`
  const title_cell_ref = XLSX.utils.encode_cell({ r: 0, c: 0 })
  worksheet[title_cell_ref] = { t: 's', v: title_text, s: titleStyle }

  const data = parseData(exemptions)
  const headers = Object.keys(data[0])

  // Add the data to the worksheet
  XLSX.utils.sheet_add_json(worksheet, data, {
    header: headers,
    skipHeader: false,
    origin: 'A2'
  })

  const merge_range = { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
  worksheet['!merges'] = [merge_range]

  applyCellStyle(worksheet, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length } }, headerStyle)

  const dataRange = { s: { r: 2, c: 0 }, e: { r: data.length + 1, c: headers.length } }

  applyCellStyle(worksheet, dataRange, dataStyle)

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exenciones')

  XLSX.writeFile(workbook, `Exenciones.xlsx`)
}

const parseData = (reports: Exemption[]): ExemptionFlatted[] => {
  return reports.map((report) => ({
    'Fecha de Emisión': report.emissionDate,
    'Tipo de DTE': report.dteType,
    Autorización: report.authorization,
    Serie: report.series,
    Número: report.number,
    'Gran Total': report.amounts.grandTotal,
    'Total Impuesto': report.amounts.totalTax,
    'Autorización de Factura Afectada': report.affectedInvoice.authorization,
    'Serie de Factura Afectada': report.affectedInvoice.series,
    'Número de Factura Afectada': report.affectedInvoice.number,
    'Fecha Emisión de Factura Afectada': report.affectedInvoice.documentDate
  }))
}

const applyCellStyle = (worksheet: XLSX.WorkSheet, range: any, style: any) => {
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_ref = XLSX.utils.encode_cell({ r: R, c: C })
      if (worksheet[cell_ref]) {
        worksheet[cell_ref].s = style
      }
    }
  }
}

const titleStyle = {
  font: { name: 'Arial', sz: 18, bold: true },
  alignment: { horizontal: 'center' }
}

const headerStyle = {
  font: { name: 'Arial', sz: 14, bold: true, color: { rgb: '000000' } },
  fill: { fgColor: { rgb: '26A72D' } },
  alignment: { horizontal: 'center', vertical: 'center' }
}

const dataStyle = {
  font: { name: 'Arial', sz: 12 }
}
