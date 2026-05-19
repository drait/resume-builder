import { useMemo } from 'react'
import { ResumeData } from '../types/resume'

const DATE_RE = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/
const PHONE_RE = /^\(\d{3}\)\s\d{3}-\d{4}$/
const LOCATION_RE = /^.+,\s[A-Z]{2}$/

const ACTION_VERBS = [
  'led', 'built', 'increased', 'reduced', 'managed', 'developed', 'implemented',
  'launched', 'designed', 'improved', 'delivered', 'created', 'established',
  'streamlined', 'drove', 'achieved', 'coordinated', 'negotiated', 'optimized',
]

export interface AtsCheck {
  label: string
  pass: boolean
  detail?: string
}

export interface AtsScore {
  total: number
  checks: AtsCheck[]
}

export function useAtsScore(resume: ResumeData): AtsScore {
  return useMemo(() => {
    const checks: AtsCheck[] = []
    let total = 0

    // Summary 400-600 chars (15 pts)
    const summaryLen = resume.summary.length
    const summaryPass = summaryLen >= 400 && summaryLen <= 600
    checks.push({ label: 'Summary is 400–600 characters', pass: summaryPass, detail: `${summaryLen} chars` })
    if (summaryPass) total += 15
    else if (summaryLen > 0) total += 5 // partial

    // ≥3 technical skills (10 pts)
    const techPass = resume.skills.technical.length >= 3
    checks.push({ label: '3+ technical skills listed', pass: techPass, detail: `${resume.skills.technical.length} skills` })
    if (techPass) total += 10

    // ≥1 experience (10 pts)
    const expPass = resume.experience.length >= 1
    checks.push({ label: 'At least one work experience', pass: expPass })
    if (expPass) total += 10

    // Each experience has ≥3 bullets (15 pts — up to 3 entries)
    const expWithBullets = resume.experience.filter(e => e.bullets.length >= 3).length
    const bulletTarget = Math.min(resume.experience.length, 3)
    const bulletPass = bulletTarget > 0 && expWithBullets >= bulletTarget
    checks.push({
      label: 'Experiences have 3+ bullet points',
      pass: bulletPass,
      detail: `${expWithBullets}/${bulletTarget} entries`,
    })
    if (bulletPass) total += 15
    else if (expWithBullets > 0) total += Math.round((expWithBullets / Math.max(bulletTarget, 1)) * 15)

    // Dates formatted correctly (10 pts)
    const allDates = resume.experience.flatMap(e => [e.startDate, e.endDate === 'Present' ? 'Jan 2000' : e.endDate])
    const badDates = allDates.filter(d => !DATE_RE.test(d))
    const datesPass = allDates.length > 0 && badDates.length === 0
    checks.push({ label: 'Dates use "MMM YYYY" format', pass: datesPass })
    if (datesPass) total += 10

    // Phone format (10 pts)
    const phonePass = PHONE_RE.test(resume.personal.phone)
    checks.push({ label: 'Phone in (XXX) XXX-XXXX format', pass: phonePass })
    if (phonePass) total += 10

    // Location format (5 pts)
    const locationPass = LOCATION_RE.test(resume.personal.location)
    checks.push({ label: 'Location is "City, Province"', pass: locationPass })
    if (locationPass) total += 5

    // No forbidden fields (15 pts) — we check summary/bullets for forbidden keywords
    const allText = [
      resume.summary,
      ...resume.experience.flatMap(e => e.bullets),
    ].join(' ').toLowerCase()
    const forbidden = ['date of birth', 'age:', 'marital status', 'sin:', 'nationality:', 'religion:', 'photo:']
    const foundForbidden = forbidden.filter(f => allText.includes(f))
    const forbiddenPass = foundForbidden.length === 0
    checks.push({ label: 'No forbidden personal info (age, SIN, etc.)', pass: forbiddenPass })
    if (forbiddenPass) total += 15

    // Action verb keyword density (10 pts)
    const bulletText = resume.experience.flatMap(e => e.bullets).join(' ').toLowerCase()
    const verbsFound = ACTION_VERBS.filter(v => bulletText.includes(v)).length
    const verbPass = verbsFound >= 5
    checks.push({ label: 'Strong action verbs in bullets', pass: verbPass, detail: `${verbsFound} action verbs` })
    if (verbPass) total += 10
    else if (verbsFound > 0) total += Math.round((verbsFound / 5) * 10)

    return { total: Math.min(total, 100), checks }
  }, [resume])
}
