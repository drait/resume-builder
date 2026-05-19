import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are a professional resume parser. Extract all information from the provided resume text and return a valid JSON object matching this schema exactly. Follow these rules:
- Standardize phone numbers to Canadian format: (XXX) XXX-XXXX
- Standardize dates to "MMM YYYY" format (e.g. "Jan 2022")
- Rewrite experience bullets using strong action verbs (Led, Built, Increased, Reduced, etc.)
- Add quantifiable metrics where they can be reasonably inferred from context
- Ensure the summary is 3-4 sentences, written in third-person-free style (no "I")
- Extract all skills mentioned anywhere in the document
- Return ONLY valid JSON, no markdown, no commentary

The JSON must match this TypeScript interface:
{
  personal: { fullName: string; email: string; phone: string; location: string; linkedIn?: string; portfolio?: string };
  summary: string;
  skills: { technical: string[]; soft: string[] };
  experience: Array<{ title: string; company: string; location: string; startDate: string; endDate: string; bullets: string[] }>;
  education: Array<{ degree: string; institution: string; location: string; graduationYear: string; honours?: string }>;
  certifications?: Array<{ name: string; issuer: string; year: string }>;
  languages?: Array<{ language: string; proficiency: string }>;
  volunteering?: Array<{ role: string; organization: string; period: string; description: string }>;
}`

export async function parseResume(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const result = await model.generateContent(`Parse this resume:\n\n${text}`)
  const responseText = result.response.text()

  const cleaned = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Gemini returned invalid JSON. Raw response: ' + responseText.slice(0, 200))
  }
}
