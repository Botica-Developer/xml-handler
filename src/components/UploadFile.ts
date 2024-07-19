import type { Exemption } from '@/interfaces'
import { downloadExcel } from '@/utils/download-excel.util'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UploadFile',
  setup() {
    const toast = useToast()
    const exemptions = ref<Exemption[]>([])

    const onUpload = async (event: FileUploadUploaderEvent) => {
      const files = event.files as File[]

      const readPromises = files.map((file) => readFile(file))

      await Promise.all(readPromises)

      downloadExcel(exemptions.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Archivo procesado correctamente' })
    }

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

              exemptions.value.push({ emissionDate, dteType, authorization, series, number, affectedInvoice })
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

    const getGeneralData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('dte:DatosGenerales')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'dte:DatosGenerales'")

      const emissionDate = data.getAttribute('FechaHoraEmision')
      const dteType = data.getAttribute('Tipo')

      if (!emissionDate || !dteType) throw new Error('El XML no tiene los atributos requeridos')

      return { emissionDate, dteType }
    }

    const getExemptionData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('dte:NumeroAutorizacion')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'dte:NumeroAutorizacion'")

      const authorization = data.textContent
      const series = data.getAttribute('Serie')
      const number = data.getAttribute('Numero')

      if (!authorization || !series || !number) throw new Error('El XML no tiene los atributos requeridos')

      return { authorization, series, number }
    }

    const getReferenceData = (xmlDoc: Document) => {
      const data = xmlDoc.getElementsByTagName('crc:ReferenciasConstancia')[0]

      if (!data) throw new Error("El XML no tiene la etiqueta 'crc:ReferenciasConstancia'")

      const authorization = data.getAttribute('NumeroAutorizacionDocumentoOrigen')
      const series = data.getAttribute('SerieDocumentoOrigen')
      const number = data.getAttribute('NumeroDocumentoOrigen')

      if (!authorization || !series || !number) throw new Error('El XML no tiene los atributos requeridos')

      return { authorization, series, number }
    }

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
