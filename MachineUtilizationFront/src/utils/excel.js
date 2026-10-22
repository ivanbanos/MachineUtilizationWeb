import * as XLSX from 'xlsx'

const TEXT_DATE = /^(\d{2})-(\d{2})-(\d{4})$|^(\d{4})-(\d{2})-(\d{2})/

/**
 * Rellena con ceros a la izquierda hasta dos dígitos.
 * @param {number} number Número a formatear.
 * @returns {string} Texto de al menos dos caracteres.
 */
const pad = (number) => String(number).padStart(2, '0')

/**
 * Normaliza una celda: fechas y textos de fecha pasan a 'YYYY-MM-DD'.
 * @param {unknown} value Valor leído de la celda.
 * @returns {unknown} Fecha como 'YYYY-MM-DD' si el valor es una fecha o un texto 'MM-DD-YYYY' o 'YYYY-MM-DD'; el valor original en otro caso.
 */
const normalizeCell = (value) => {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
  }
  if (typeof value !== 'string') {
    return value
  }
  const match = TEXT_DATE.exec(value.trim())
  if (!match) {
    return value
  }
  return match[1] ? `${match[3]}-${match[1]}-${match[2]}` : `${match[4]}-${match[5]}-${match[6]}`
}

/**
 * Indica si una fila no tiene ninguna celda con contenido.
 * @param {Record<string, unknown>} row Fila ya leída.
 * @returns {boolean} true si todas las celdas son nulas, indefinidas o texto en blanco.
 */
const isEmptyRow = (row) =>
  Object.values(row).every(
    (value) => value === null || value === undefined || String(value).trim() === '',
  )

/**
 * Construye un libro de una hoja con los encabezados en la primera fila.
 * @param {string} sheetName Nombre de la hoja.
 * @param {unknown[]} headers Encabezados de las columnas.
 * @param {unknown[][]} rows Filas de datos; si está vacío la hoja solo tiene el encabezado.
 * @returns {object} Libro de SheetJS listo para escribir.
 */
export const buildWorkbook = (sheetName, headers, rows) => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([headers, ...rows]), sheetName)
  return workbook
}

/**
 * Lee las filas de una hoja usando la primera fila como encabezados.
 * @param {object} sheet Hoja de SheetJS leída con cellDates.
 * @returns {Record<string, unknown>[]} Objetos con las claves de los encabezados recortadas, sin filas vacías y con las fechas como 'YYYY-MM-DD'.
 */
export const rowsFromSheet = (sheet) => {
  const [headerCells = [], ...dataCells] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    raw: true,
  })
  const keys = headerCells.map((header) => String(header ?? '').trim())
  return dataCells
    .map((cells) =>
      keys.reduce(
        (row, key, column) => (key ? { ...row, [key]: normalizeCell(cells[column]) } : row),
        {},
      ),
    )
    .filter((row) => !isEmptyRow(row))
}

/**
 * Descarga un libro de una hoja como archivo .xlsx.
 * @param {string} fileName Nombre del archivo descargado.
 * @param {string} sheetName Nombre de la hoja.
 * @param {unknown[]} headers Encabezados de las columnas.
 * @param {unknown[][]} rows Filas de datos.
 * @returns {void}
 */
export const exportExcel = (fileName, sheetName, headers, rows) => {
  XLSX.writeFile(buildWorkbook(sheetName, headers, rows), fileName)
}

/**
 * Lee la primera hoja de un archivo Excel.
 * @param {File} file Archivo .xlsx seleccionado por el usuario.
 * @returns {Promise<Record<string, unknown>[]>} Filas como objetos; arreglo vacío si el libro no tiene hojas.
 */
export const readExcelRows = async (file) => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return sheet ? rowsFromSheet(sheet) : []
}
