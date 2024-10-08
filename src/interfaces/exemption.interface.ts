export interface Exemption {
  emissionDate: string
  dteType: string
  authorization: string
  series: string
  number: string
  affectedInvoice: AffectedInvoice
  amounts: Amounts
}

interface AffectedInvoice {
  series: string
  number: string
  authorization: string
  documentDate: string
}

interface Amounts {
  grandTotal: string
  totalTax: string
}

export interface ExemptionFlatted {
  'Fecha de Emisión': string
  'Tipo de DTE': string
  Autorización: string
  Serie: string
  Número: string
  'Serie de Factura Afectada': string
  'Número de Factura Afectada': string
  'Autorización de Factura Afectada': string
}
