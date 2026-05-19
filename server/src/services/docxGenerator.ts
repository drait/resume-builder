import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
} from 'docx'

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

const HR = new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
  spacing: { after: 100 },
})

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24 })],
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' } },
  })
}

function s(str: string | undefined | null): string {
  return str ?? ''
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text: s(text), size: 22 })],
    spacing: { after: 40 },
  })
}

function entryHeader(title: string, rest: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: s(title), bold: true, size: 22 }),
      new TextRun({ text: ` — ${s(rest)}`, size: 22 }),
    ],
    spacing: { after: 40 },
  })
}

function plain(text: string): Paragraph {
  return new Paragraph({ children: [new TextRun({ text: s(text), size: 22 })], spacing: { after: 40 } })
}

export async function generateDocx(r: ResumeData): Promise<Buffer> {
  const contactParts = [r.personal.email, r.personal.phone, r.personal.location].map(s)
  if (r.personal.linkedIn) contactParts.push(r.personal.linkedIn)
  if (r.personal.portfolio) contactParts.push(r.personal.portfolio)

  const children: Paragraph[] = []

  children.push(
    new Paragraph({
      children: [new TextRun({ text: s(r.personal.fullName), bold: true, size: 36 })],
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 20 })],
      spacing: { after: 100 },
    }),
    HR,
    sectionHeading('Professional Summary'),
    plain(r.summary),
    sectionHeading('Skills'),
  )

  if (r.skills.technical.length) children.push(plain(`Technical: ${r.skills.technical.join(', ')}`))
  if (r.skills.soft.length) children.push(plain(`Core Competencies: ${r.skills.soft.join(', ')}`))

  children.push(sectionHeading('Work Experience'))
  for (const e of r.experience) {
    children.push(
      entryHeader(s(e.title), `${s(e.company)}, ${s(e.location)}`),
      plain(`${s(e.startDate)} – ${s(e.endDate)}`),
      ...e.bullets.map(bullet),
    )
  }

  children.push(sectionHeading('Education'))
  for (const e of r.education) {
    children.push(
      entryHeader(s(e.degree), `${s(e.institution)}, ${s(e.location)}`),
      plain(e.honours ? `${s(e.graduationYear)} — ${s(e.honours)}` : s(e.graduationYear)),
    )
  }

  if ((r.certifications ?? []).length) {
    children.push(sectionHeading('Certifications'))
    for (const c of r.certifications!) {
      children.push(plain(`${c.name} — ${c.issuer} (${c.year})`))
    }
  }

  if ((r.languages ?? []).length) {
    children.push(sectionHeading('Languages'))
    for (const l of r.languages!) {
      children.push(plain(`${l.language}: ${l.proficiency}`))
    }
  }

  if ((r.volunteering ?? []).length) {
    children.push(sectionHeading('Volunteering'))
    for (const v of r.volunteering!) {
      children.push(
        entryHeader(v.role, v.organization),
        plain(v.period),
        plain(v.description),
      )
    }
  }

  children.push(new Paragraph({
    children: [new TextRun({ text: 'References available upon request', italics: true, size: 20 })],
    spacing: { before: 200 },
  }))

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.75),
            right: convertInchesToTwip(0.75),
          },
        },
      },
      children,
    }],
  })

  return await Packer.toBuffer(doc)
}

export function getDocxFilename(resume: ResumeData): string {
  const parts = resume.personal.fullName.trim().split(/\s+/)
  const first = parts[0] ?? 'Resume'
  const last = parts[parts.length - 1] ?? ''
  return `${first}-${last}-Resume.docx`
}
