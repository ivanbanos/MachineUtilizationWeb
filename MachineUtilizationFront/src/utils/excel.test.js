import * as XLSX from 'xlsx'
import { buildWorkbook, exportExcel, readExcelRows, rowsFromSheet } from './excel'

const sheetFrom = (cells) => XLSX.utils.aoa_to_sheet(cells, { cellDates: true })

describe('buildWorkbook', () => {
  it('writes the headers in the first row and the data below', () => {
    const workbook = buildWorkbook('Data', ['a', 'b'], [[1, 'x']])

    expect(workbook.SheetNames).toEqual(['Data'])
    expect(XLSX.utils.sheet_to_json(workbook.Sheets.Data, { header: 1 })).toEqual([
      ['a', 'b'],
      [1, 'x'],
    ])
  })

  it('keeps only the header row when there are no rows', () => {
    const workbook = buildWorkbook('Data', ['a'], [])

    expect(XLSX.utils.sheet_to_json(workbook.Sheets.Data, { header: 1 })).toEqual([['a']])
  })
})

describe('rowsFromSheet', () => {
  it('maps each data row to an object keyed by the trimmed headers', () => {
    const sheet = sheetFrom([
      [' name ', 'count'],
      ['m1', 3],
    ])

    expect(rowsFromSheet(sheet)).toEqual([{ name: 'm1', count: 3 }])
  })

  it('omits empty rows', () => {
    const sheet = sheetFrom([['name'], ['m1'], [null], ['  '], ['m2']])

    expect(rowsFromSheet(sheet)).toEqual([{ name: 'm1' }, { name: 'm2' }])
  })

  it('normalizes date cells to YYYY-MM-DD', () => {
    const sheet = sheetFrom([['day'], [new Date(2024, 0, 5)]])

    expect(rowsFromSheet(sheet)).toEqual([{ day: '2024-01-05' }])
  })

  it('normalizes MM-DD-YYYY and YYYY-MM-DD texts to YYYY-MM-DD', () => {
    const sheet = sheetFrom([['day'], ['03-25-2024'], ['2024-03-26'], ['other']])

    expect(rowsFromSheet(sheet)).toEqual([
      { day: '2024-03-25' },
      { day: '2024-03-26' },
      { day: 'other' },
    ])
  })
})

describe('exportExcel and readExcelRows', () => {
  it('writes the workbook with the file name', () => {
    const writeSpy = jest.spyOn(XLSX, 'writeFile').mockImplementation(() => undefined)

    exportExcel('report.xlsx', 'Data', ['a'], [[1]])

    expect(writeSpy.mock.calls[0][1]).toBe('report.xlsx')
    expect(writeSpy.mock.calls[0][0].SheetNames).toEqual(['Data'])
    writeSpy.mockRestore()
  })

  it('reads the first sheet of a file', async () => {
    const bytes = XLSX.write(buildWorkbook('Data', ['name', 'day'], [['m1', '03-25-2024']]), {
      type: 'array',
      bookType: 'xlsx',
    })
    const file = { arrayBuffer: async () => bytes }

    await expect(readExcelRows(file)).resolves.toEqual([{ name: 'm1', day: '2024-03-25' }])
  })
})
