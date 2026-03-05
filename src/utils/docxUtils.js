import mammoth from 'mammoth'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx'

/**
 * Parse DOCX file dan extract dengan preserving format
 * @param {File|Blob} docxFile - DOCX file object
 * @returns {Promise<Object>} Document structure
 */
export const parseDocxPreservingFormat = async (docxFile) => {
  try {
    const arrayBuffer = await docxFile.arrayBuffer()
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(arrayBuffer)
    
    // Extract document.xml
    const xmlText = await zip.file('word/document.xml').async('text')
    return xmlText
  } catch (error) {
    console.error('Error parsing DOCX structure:', error)
    throw error
  }
}

/**
 * Replace placeholders dalam XML dokumen (preserves formatting)
 * @param {string} xmlContent - XML content dari DOCX
 * @param {Object} data - Data untuk replace
 * @returns {string} Modified XML
 */
export const replacePlaceholdersInXml = (xmlContent, data) => {
  let result = xmlContent
  
  Object.entries(data).forEach(([key, value]) => {
    // Escape special regex characters
    const escapedValue = String(value || '-').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // Method 1: Direct replacement jika placeholder dalam satu run
    const regex1 = new RegExp(`(<w:t[^>]*>)\\{${key}\\}(</w:t>)`, 'g')
    result = result.replace(regex1, `$1${escapedValue}$2`)
    
    // Method 2: Handle placeholder yang tersebar di multiple runs
    const regex2 = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(regex2, escapedValue)
  })
  
  return result
}

/**
 * Debug: Print XML structure around placeholder
 */
export const debugXmlStructure = (xmlContent, placeholder) => {
  const searchPattern = `{${placeholder}}`
  const index = xmlContent.indexOf(searchPattern)
  
  if (index === -1) {
    console.log(`DEBUG: Placeholder ${searchPattern} not found`)
    return
  }
  
  // Get 500 chars before and after
  const start = Math.max(0, index - 500)
  const end = Math.min(xmlContent.length, index + 500)
  const context = xmlContent.substring(start, end)
  
  console.log('=== XML Context Around Placeholder ===')
  console.log(context)
  console.log('=== End Context ===')
}

/**
 * Escape special XML characters
 */
const escapeXml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generate table XML untuk DOCX
 * @param {Array<Object>} rows - Array of row objects dengan properties: nama, jabatan, peran
 * @returns {string} Table XML
 */
export const generateTableXml = (rows) => {
  if (!rows || rows.length === 0) {
    console.log('[generateTableXml] No rows provided, returning empty table')
    return ''
  }

  console.log(`[generateTableXml] Generating table for ${rows.length} rows`)

  // Build header row
  const headerRow = `<w:tr><w:trPr><w:trHeight w:val="400" w:type="atLeast"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="1440" w:type="dxa"/><w:shd w:fill="4472C4"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>No</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/><w:shd w:fill="4472C4"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Nama</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/><w:shd w:fill="4472C4"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Jabatan</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/><w:shd w:fill="4472C4"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Peran</w:t></w:r></w:p></w:tc></w:tr>`

  // Build data rows
  const dataRows = rows.map((row, index) => {
    const nama = escapeXml(row.nama || '-')
    const jabatan = escapeXml(row.jabatan || '-')
    const peran = escapeXml(row.peran || '-')
    
    console.log(`[generateTableXml] Row ${index + 1}: ${nama}, ${jabatan}, ${peran}`)
    
    return `<w:tr><w:trPr><w:trHeight w:val="300" w:type="atLeast"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="1440" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${index + 1}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${nama}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${jabatan}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${peran}</w:t></w:r></w:p></w:tc></w:tr>`
  }).join('')

  // Build complete table
  const table = `<w:tbl><w:tblPr><w:tblW w:w="10080" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="12" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="12" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="12" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="12" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="12" w:space="0" w:color="000000"/></w:tblBorders></w:tblPr>${headerRow}${dataRows}</w:tbl>`

  console.log(`[generateTableXml] Table generated, length: ${table.length}`)
  return table
}

/**
 * Replace placeholder dengan tabel XML
 * @param {string} xmlContent - Original XML
 * @param {string} placeholder - Placeholder name (e.g., 'DAFTAR_TIM')
 * @param {Array<Object>} rows - Table rows data
 * @returns {string} Modified XML dengan tabel
 */
export const replaceTablePlaceholder = (xmlContent, placeholder, rows) => {
  const tableXml = generateTableXml(rows)
  if (!tableXml) {
    console.warn('[Table] Table XML is empty')
    return xmlContent
  }

  const searchPattern = `{${placeholder}}`
  console.log(`[Table] Searching for placeholder: ${searchPattern}`)
  
  if (!xmlContent.includes(searchPattern)) {
    console.warn(`[Table] Placeholder NOT found`)
    return xmlContent
  }

  console.log(`[Table] Placeholder found!`)
  
  // Strategy: Find paragraph with placeholder, remove placeholder text, then insert table after </w:p>
  // This preserves the paragraph structure above and inserts table right after
  
  // Step 1: Find paragraph containing placeholder
  const paragraphRegex = new RegExp(`(<w:p[^>]*>[\\s\\S]*?\\{${placeholder}\\}[\\s\\S]*?</w:p>)`, 'g')
  
  const match = paragraphRegex.exec(xmlContent)
  if (!match) {
    console.warn(`[Table] Could not find paragraph`)
    return xmlContent
  }
  
  const fullParagraph = match[1]
  console.log(`[Table] Found paragraph, length: ${fullParagraph.length}`)
  
  // Step 2: Remove the placeholder text from paragraph (keep structure, just remove {DAFTAR_TIM})
  const paragraphWithoutPlaceholder = fullParagraph.replace(searchPattern, '')
  console.log(`[Table] Removed placeholder from paragraph`)
  
  // Step 3: Replace paragraph with (paragraph without placeholder + table after it)
  const result = xmlContent.replace(fullParagraph, paragraphWithoutPlaceholder + tableXml)
  
  console.log(`[Table] Injection done successfully`)
  return result
}

/**
 * Generate DOCX dari XML structure
 * @param {string} xmlContent - Modified XML content
 * @param {Blob} originalDocx - Original DOCX for resources
 * @param {string} filename - Output filename
 * @returns {Promise<Blob>}
 */
export const generateDocxFromXml = async (xmlContent, originalDocx, filename = 'document.docx') => {
  try {
    const JSZip = (await import('jszip')).default
    
    // Load original DOCX
    const arrayBuffer = await originalDocx.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    
    // Replace document.xml dengan modified version
    zip.file('word/document.xml', xmlContent)
    
    // Generate new DOCX
    const newDocxBlob = await zip.generateAsync({ type: 'blob' })
    if (filename) {
      downloadBlob(newDocxBlob, filename)
    }
    return newDocxBlob
  } catch (error) {
    console.error('Error generating DOCX from XML:', error)
    throw error
  }
}


/**
 * Download blob as file
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

/**
 * Process existing DOCX template: Parse → Replace → Generate DOCX baru
 * Preserves original formatting dari template
 * @param {File|Blob} templateDocx - Template DOCX file
 * @param {Object} data - Data untuk replace
 * @param {string} filename - Output filename
 * @returns {Promise<Blob>}
 */
export const processDocxTemplate = async (templateDocx, data, filename = 'document.docx') => {
  try {
    // 1. Parse DOCX structure (preserving format)
    const xmlContent = await parseDocxPreservingFormat(templateDocx)
    
    // 2. Replace placeholders dalam XML
    const modifiedXml = replacePlaceholdersInXml(xmlContent, data)
    
    // 3. Generate DOCX baru dengan structure original
    return await generateDocxFromXml(modifiedXml, templateDocx, filename)
  } catch (error) {
    console.error('Error processing DOCX template:', error)
    throw error
  }
}

/**
 * Create a simple DOCX template for Surat Tugas
 * @returns {Promise<Blob>} DOCX file blob
 */
export const createSuratTugasTemplate = async () => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: 'SURAT TUGAS',
          bold: true,
          alignment: 'center',
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `Nomor: {NOMOR_SURAT}`,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: '',
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'Menimbang bahwa untuk melaksanakan kegiatan sebagaimana tersebut di atas, perlu menetapkan tim/panitia melalui surat tugas ini.',
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: '',
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'MENETAPKAN:',
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: '',
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'Kegiatan: {KEGIATAN}',
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: 'Tanggal: {TANGGAL_SURAT}',
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: 'Lokasi: {LOKASI}',
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: 'Tim yang ditunjuk:',
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: '{DAFTAR_TIM}',
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `Penandatangan: {PENANDATANGAN}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Tanggal: {TANGGAL_PENANDATANGAN}`,
          spacing: { after: 400 }
        })
      ]
    }]
  })
  
  return await Packer.toBlob(doc)
}
