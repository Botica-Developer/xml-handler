import * as XLSX from 'xlsx-js-style'
import type { Exemption, ExemptionFlatted } from '@/interfaces'

/**
 * Genera y descarga un archivo Excel con los datos de exenciones.
 *
 * Crea un nuevo libro de Excel, define el título y los estilos, agrega
 * la información de exenciones, y finalmente guarda el archivo como
 * "Exenciones.xlsx".
 *
 * @param exemptions Lista de objetos de tipo Exemption para incluir en el archivo Excel.
 */
export const downloadExcel = (exemptions: Exemption[]) => {
  const workbook = XLSX.utils.book_new() // Crear un nuevo libro de trabajo
  const worksheet = XLSX.utils.aoa_to_sheet([]) // Crear una nueva hoja de trabajo

  // Título y fusión de celdas
  const title_text = `Exenciones`
  const title_cell_ref = XLSX.utils.encode_cell({ r: 0, c: 0 })
  worksheet[title_cell_ref] = { t: 's', v: title_text, s: titleStyle }

  const data = parseData(exemptions) // Parsear los datos de las exenciones
  const headers = Object.keys(data[0]) // Obtener los encabezados de las columnas

  // Agregar los datos a la hoja de trabajo
  XLSX.utils.sheet_add_json(worksheet, data, {
    header: headers,
    skipHeader: false,
    origin: 'A2'
  })

  // Rango de fusión para el título
  const merge_range = { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
  worksheet['!merges'] = [merge_range]

  // Aplicar estilo a los encabezados
  applyCellStyle(worksheet, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length } }, headerStyle)

  // Rango de datos
  const dataRange = { s: { r: 2, c: 0 }, e: { r: data.length + 1, c: headers.length } }

  // Aplicar estilo a los datos
  applyCellStyle(worksheet, dataRange, dataStyle)

  // Agregar la hoja de trabajo al libro de trabajo
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exenciones')

  // Escribir el archivo Excel
  XLSX.writeFile(workbook, `Exenciones.xlsx`)
}

/**
 * Genera un arreglo de objetos de tipo ExemptionFlatted a partir de un arreglo
 * de objetos Exemption, transformando y mapeando los datos al formato deseado.
 *
 * @param reports - Arreglo de objetos de tipo Exemption que se desea transformar.
 * @returns Un arreglo de objetos de tipo ExemptionFlatted con los datos flateados.
 */
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

/**
 * Aplica un estilo a un rango de celdas en una hoja de cálculo.
 *
 * @param {XLSX.WorkSheet} worksheet - La hoja de cálculo a la que se aplicará el estilo.
 * @param {Object} range - El rango de celdas al que se aplicará el estilo. Debe tener las propiedades `s` (inicio) y `e` (fin), cada una con las propiedades `r` (fila) y `c` (columna).
 * @param {Object} style - El estilo que se aplicará a las celdas. Debe ser un objeto de estilo compatible con XLSX.
 *
 * @example
 * const worksheet = XLSX.utils.aoa_to_sheet([['A1', 'B1'], ['A2', 'B2']]);
 * const range = { s: { r: 0, c: 0 }, e: { r: 1, c: 1 } };
 * const style = { font: { bold: true } };
 * applyCellStyle(worksheet, range, style);
 */
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

// Estilo para el título
const titleStyle = {
  font: { name: 'Arial', sz: 18, bold: true },
  alignment: { horizontal: 'center' }
}

// Estilo para los encabezados
const headerStyle = {
  font: { name: 'Arial', sz: 14, bold: true, color: { rgb: '000000' } },
  fill: { fgColor: { rgb: '26A72D' } },
  alignment: { horizontal: 'center', vertical: 'center' }
}

// Estilo para los datos
const dataStyle = {
  font: { name: 'Arial', sz: 12 }
}
