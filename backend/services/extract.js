import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import Papa from 'papaparse'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

// ── URL scraping ──────────────────────────────────────────────────
export async function extractFromUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HearBot/1.0)' },
      timeout: 10000,
    })
    if (!res.ok) return ''
    const html = await res.text()
    const $ = cheerio.load(html)

    // Remove noise
    $('script, style, nav, footer, header, aside, [aria-hidden="true"]').remove()

    // Grab meaningful text: meta description + headings + paragraphs
    const metaDesc = $('meta[name="description"]').attr('content') ?? ''
    const title    = $('title').text().trim()
    const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get().join(' · ')
    const body     = $('main, article, section, .content, #content, body')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000)  // cap to avoid token overflow

    return [title, metaDesc, headings, body].filter(Boolean).join('\n\n')
  } catch (err) {
    console.warn('[extract] URL scrape failed:', err.message)
    return ''
  }
}

// ── File parsing ──────────────────────────────────────────────────
export async function extractFromFile(buffer, mimetype, originalname) {
  try {
    const ext = originalname.split('.').pop().toLowerCase()

    if (ext === 'pdf' || mimetype === 'application/pdf') {
      const data = await pdfParse(buffer)
      return data.text.slice(0, 6000)
    }

    if (ext === 'csv' || mimetype === 'text/csv') {
      const text = buffer.toString('utf-8')
      const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
      const headers  = Object.keys(data[0] ?? {}).join(', ')
      const sample   = data.slice(0, 5).map(r => Object.values(r).join(' | ')).join('\n')
      return `Columns: ${headers}\n\nSample rows:\n${sample}`
    }

    if (['txt', 'md', 'json', 'yaml', 'yml'].includes(ext)) {
      return buffer.toString('utf-8').slice(0, 6000)
    }

    // docx: return a note — full parsing needs mammoth, skip for now
    return `[${originalname} — content extraction coming soon]`
  } catch (err) {
    console.warn('[extract] file parse failed:', err.message)
    return ''
  }
}
