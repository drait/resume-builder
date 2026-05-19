import puppeteer from 'puppeteer'

interface ResumeData {
  personal: { fullName: string; email: string; phone: string; location: string; linkedIn?: string; portfolio?: string }
  summary: string
  skills: { technical: string[]; soft: string[] }
  experience: Array<{ title: string; company: string; location: string; startDate: string; endDate: string; bullets: string[] }>
  education: Array<{ degree: string; institution: string; location: string; graduationYear: string; honours?: string }>
  certifications?: Array<{ name: string; issuer: string; year: string }>
  languages?: Array<{ language: string; proficiency: string }>
  volunteering?: Array<{ role: string; organization: string; period: string; description: string }>
}

function esc(str: string | undefined | null): string {
  return (str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sectionHeader(title: string): string {
  return `
    <div class="section-header">
      <div class="section-bar"></div>
      <span class="section-title">${esc(title)}</span>
      <div class="section-rule"></div>
    </div>`
}

function buildHtml(r: ResumeData): string {
  const contactParts = [r.personal.email, r.personal.phone, r.personal.location]
  if (r.personal.linkedIn) contactParts.push(r.personal.linkedIn)
  if (r.personal.portfolio) contactParts.push(r.personal.portfolio)

  const experienceHtml = (r.experience ?? []).map(e => `
    <div class="entry">
      <div class="row">
        <span class="entry-title">${esc(e.title)}</span>
        <span class="dates">${esc(e.startDate)} &ndash; ${esc(e.endDate)}</span>
      </div>
      <div class="sub">${esc(e.company)}${e.location ? ' &middot; ' + esc(e.location) : ''}</div>
      <ul>${(e.bullets ?? []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>`).join('')

  const educationHtml = (r.education ?? []).map(e => `
    <div class="entry">
      <div class="row">
        <span class="entry-title">${esc(e.degree)}</span>
        <span class="dates">${esc(e.graduationYear)}</span>
      </div>
      <div class="sub">${esc(e.institution)}${e.location ? ' &middot; ' + esc(e.location) : ''}</div>
      ${e.honours ? `<div class="dates">${esc(e.honours)}</div>` : ''}
    </div>`).join('')

  const skillsHtml = `
    ${(r.skills?.technical ?? []).length ? `<p><strong>Technical:</strong> ${r.skills.technical.map(esc).join(', ')}</p>` : ''}
    ${(r.skills?.soft ?? []).length ? `<p style="margin-top:2px"><strong>Core Competencies:</strong> ${r.skills.soft.map(esc).join(', ')}</p>` : ''}`

  const certsHtml = (r.certifications ?? []).map(c =>
    `<p>${esc(c.name)} &mdash; ${esc(c.issuer)} (${esc(c.year)})</p>`).join('')

  const langsHtml = (r.languages ?? []).map(l =>
    `<p>${esc(l.language)}: ${esc(l.proficiency)}</p>`).join('')

  const volHtml = (r.volunteering ?? []).map(v => `
    <div class="entry">
      <div class="entry-title">${esc(v.role)} &mdash; ${esc(v.organization)}</div>
      <div class="dates">${esc(v.period)}</div>
      <p>${esc(v.description)}</p>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #1f2937; }
  .name { font-size: 22pt; font-weight: bold; line-height: 1.2; margin-bottom: 4px; color: #111827; }
  .contact { font-size: 10pt; color: #374151; margin-bottom: 8px; }
  hr { border: none; border-top: 1px solid #d1d5db; margin-bottom: 4px; }
  .section-header { display: flex; align-items: center; gap: 8px; margin-top: 20px; margin-bottom: 8px; }
  .section-bar { width: 4px; height: 20px; background: #0A2342; border-radius: 2px; flex-shrink: 0; }
  .section-title { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #0A2342; white-space: nowrap; }
  .section-rule { flex: 1; border-top: 1px solid #e5e7eb; }
  .entry { margin-bottom: 12px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: bold; color: #111827; }
  .sub { color: #374151; margin-bottom: 3px; }
  .dates { font-size: 10pt; color: #6b7280; }
  ul { margin-left: 16px; line-height: 1.5; }
  ul li { list-style-type: disc; margin-bottom: 2px; }
  p { margin-bottom: 4px; }
  .footer { margin-top: 24px; font-size: 10pt; color: #9ca3af; font-style: italic; }
</style>
</head>
<body>
  <div class="name">${esc(r.personal.fullName)}</div>
  <div class="contact">${contactParts.filter(Boolean).map(esc).join(' | ')}</div>
  <hr/>
  ${r.summary ? sectionHeader('Professional Summary') + `<p style="line-height:1.4;color:#1f2937">${esc(r.summary)}</p>` : ''}
  ${skillsHtml.trim() ? sectionHeader('Skills') + skillsHtml : ''}
  ${experienceHtml ? sectionHeader('Work Experience') + experienceHtml : ''}
  ${educationHtml ? sectionHeader('Education') + educationHtml : ''}
  ${certsHtml ? sectionHeader('Certifications') + certsHtml : ''}
  ${langsHtml ? sectionHeader('Languages') + langsHtml : ''}
  ${volHtml ? sectionHeader('Volunteering') + volHtml : ''}
  <p class="footer">References available upon request</p>
</body>
</html>`
}

export async function generatePdf(resume: ResumeData): Promise<Buffer> {
  const html = buildHtml(resume)
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'Letter',
      margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
      printBackground: false,
    })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

export function getPdfFilename(resume: ResumeData): string {
  const parts = resume.personal.fullName.trim().split(/\s+/)
  const first = parts[0] ?? 'Resume'
  const last = parts[parts.length - 1] ?? ''
  return `${first}-${last}-Resume.pdf`
}
