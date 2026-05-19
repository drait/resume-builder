export interface ResumeData {
  personal: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn?: string
    portfolio?: string
  }
  summary: string
  skills: {
    technical: string[]
    soft: string[]
  }
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    bullets: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location: string
    graduationYear: string
    honours?: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    year: string
  }>
  languages?: Array<{
    language: string
    proficiency: string
  }>
  volunteering?: Array<{
    role: string
    organization: string
    period: string
    description: string
  }>
}

export const emptyResume = (): ResumeData => ({
  personal: { fullName: '', email: '', phone: '', location: '' },
  summary: '',
  skills: { technical: [], soft: [] },
  experience: [],
  education: [],
  certifications: [],
  languages: [],
  volunteering: [],
})
