import type { Exemption } from '@/interfaces'
import { downloadExcel } from '@/utils/download-excel.util'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { defineComponent, ref } from 'vue'

/**
 * Componente para la carga y procesamiento de archivos XML.
 */
export default defineComponent({
  name: 'UploadFile',
  setup() {
    /**
     * Muestra notificaciones al usuario.
     */
    const toast = useToast()

    /**
     * Lista de exenciones procesadas desde los archivos XML.
     */
    const exemptions = ref<Exemption[]>([])

    /**
     * Maneja el evento de carga de archivos.
     *
     * @param event - Evento de carga de archivos.
     */
    const onUpload = async (event: FileUploadUploaderEvent) => {
      const files = event.files as File[]

      const readPromises = files.map((file) => readFile(file))

      await Promise.all(readPromises)

      downloadExcel(exemptions.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Archivo procesado correctamente' })
    }

    /**
     * Lee y procesa un archivo XML.
     *
     * @param file - Archivo a leer.
     * @returns Promesa que se resuelve cuando el archivo ha sido leído y procesado.
     */
    const readFile = (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            if (e.target && e.target.result) {
              const parser = new DOMParser()
              const xmlDoc = parser.parseFromString(e.target.result as string, 'application/xml')

              const { emissionDate, dteType } = getGeneralData(xmlDoc)
              const { authorization, series, number } = getExemptionData(xmlDoc)
              const affectedInvoice = getReferenceData(xmlDoc)
              const amounts = getAmountsData(xmlDoc)

              exemptions.value.push({ emissionDate, dteType, authorization, series, number, affectedInvoice, amounts })
            }
            resolve()
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = () => reject(reader.error)

        reader.readAsText(file)
      })
    }

    /**
     * Obtiene los datos generales del XML.
     *
     * @param xmlDoc - Documento XML.
     * @returns Datos generales del XML.
     * @throws Error si el XML no contiene los datos requeridos.
     */
    const getGeneralData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('dte:DatosGenerales')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'dte:DatosGenerales'")

      const emissionDate = data.getAttribute('FechaHoraEmision')
      const dteType = data.getAttribute('Tipo')

      if (!emissionDate || !dteType) throw new Error('El XML no tiene los atributos requeridos')

      return { emissionDate: emissionDate.split('T')[0], dteType }
    }

    /**
     * Obtiene los datos de exención del XML.
     *
     * @param xmlDoc - Documento XML.
     * @returns Datos de exención del XML.
     * @throws Error si el XML no contiene los datos requeridos.
     */
    const getExemptionData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('dte:NumeroAutorizacion')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'dte:NumeroAutorizacion'")

      const authorization = data.textContent
      const series = data.getAttribute('Serie')
      const number = data.getAttribute('Numero')

      if (!authorization || !series || !number) throw new Error('El XML no tiene los atributos requeridos')

      return { authorization, series, number }
    }

    /**
     * Obtiene los datos de referencia del XML.
     *
     * @param xmlDoc - Documento XML.
     * @returns Datos de referencia del XML.
     * @throws Error si el XML no contiene los datos requeridos.
     */
    const getReferenceData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('crc:ReferenciasConstancia')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'crc:ReferenciasConstancia'")

      const authorization = data.getAttribute('NumeroAutorizacionDocumentoOrigen')
      const series = data.getAttribute('SerieDocumentoOrigen')
      const number = data.getAttribute('NumeroDocumentoOrigen')
      const documentDate = data.getAttribute('FechaEmisionDocumentoOrigen')

      if (!authorization || !series || !number || !documentDate)
        throw new Error('El XML no tiene los atributos requeridos')

      return { authorization, series, number, documentDate }
    }

    /**
     * Obtiene los datos de montos del XML.
     *
     * @param xmlDoc - Documento XML.
     * @returns Datos de montos del XML.
     * @throws Error si el XML no contiene los datos requeridos.
     */
    const getAmountsData = (xmlDoc: Document) => {
      const totalTax = xmlDoc.getElementsByTagName('dte:TotalImpuesto')[0]
      const grandTotal = xmlDoc.getElementsByTagName('dte:GranTotal')[0]

      if (!totalTax || !grandTotal) throw new Error('El XML no tiene los atributos requeridos')

      const totalTaxValue = totalTax.getAttribute('TotalMontoImpuesto')
      const grandTotalValue = grandTotal.textContent

      if (!totalTaxValue || !grandTotalValue) throw new Error('El XML no tiene los atributos requeridos')

      return { grandTotal: grandTotalValue, totalTax: totalTaxValue }
    }

    /**
     * Limpia la lista de exenciones.
     */
    const onClear = () => {
      exemptions.value = []
    }

    return {
      //* Props
      exemptions,
      //! Getters
      //? Methods
      onUpload,
      onClear
    }
  }
})
