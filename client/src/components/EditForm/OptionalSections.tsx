import { useState } from 'react'
import { ResumeData } from '../../types/resume'

interface Props {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
    </div>
  )
}

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {title}
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 pt-3">{children}</div>}
    </div>
  )
}

export default function OptionalSections({ data, onChange }: Props) {
  const certs = data.certifications ?? []
  const langs = data.languages ?? []
  const vols = data.volunteering ?? []

  function setCerts(certifications: ResumeData['certifications']) { onChange({ ...data, certifications }) }
  function setLangs(languages: ResumeData['languages']) { onChange({ ...data, languages }) }
  function setVols(volunteering: ResumeData['volunteering']) { onChange({ ...data, volunteering }) }

  return (
    <div className="space-y-3">
      <Collapsible title={`Certifications (${certs.length})`}>
        <div className="space-y-3">
          {certs.map((c, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <Field label="Name" value={c.name} onChange={v => { const n = [...certs]; n[i] = { ...c, name: v }; setCerts(n) }} />
              <Field label="Issuer" value={c.issuer} onChange={v => { const n = [...certs]; n[i] = { ...c, issuer: v }; setCerts(n) }} />
              <div className="flex gap-2">
                <Field label="Year" value={c.year} onChange={v => { const n = [...certs]; n[i] = { ...c, year: v }; setCerts(n) }} />
                <button onClick={() => setCerts(certs.filter((_, j) => j !== i))} className="mb-0.5 text-red-400 hover:text-red-600 text-xs self-end pb-2">&times;</button>
              </div>
            </div>
          ))}
          <button onClick={() => setCerts([...certs, { name: '', issuer: '', year: '' }])} className="text-xs text-blue-600 hover:underline">+ Add certification</button>
        </div>
      </Collapsible>

      <Collapsible title={`Languages (${langs.length})`}>
        <div className="space-y-3">
          {langs.map((l, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Field label="Language" value={l.language} onChange={v => { const n = [...langs]; n[i] = { ...l, language: v }; setLangs(n) }} />
              </div>
              <div className="flex-1">
                <Field label="Proficiency" value={l.proficiency} onChange={v => { const n = [...langs]; n[i] = { ...l, proficiency: v }; setLangs(n) }} placeholder="Native, Fluent, Conversational" />
              </div>
              <button onClick={() => setLangs(langs.filter((_, j) => j !== i))} className="pb-2 text-red-400 hover:text-red-600 text-xs">&times;</button>
            </div>
          ))}
          <button onClick={() => setLangs([...langs, { language: '', proficiency: '' }])} className="text-xs text-blue-600 hover:underline">+ Add language</button>
        </div>
      </Collapsible>

      <Collapsible title={`Volunteering (${vols.length})`}>
        <div className="space-y-4">
          {vols.map((v, i) => (
            <div key={i} className="space-y-2 border-b border-gray-100 pb-3 last:border-0">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Role" value={v.role} onChange={val => { const n = [...vols]; n[i] = { ...v, role: val }; setVols(n) }} />
                <Field label="Organization" value={v.organization} onChange={val => { const n = [...vols]; n[i] = { ...v, organization: val }; setVols(n) }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Period" value={v.period} onChange={val => { const n = [...vols]; n[i] = { ...v, period: val }; setVols(n) }} />
                <Field label="Description" value={v.description} onChange={val => { const n = [...vols]; n[i] = { ...v, description: val }; setVols(n) }} />
              </div>
              <button onClick={() => setVols(vols.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => setVols([...vols, { role: '', organization: '', period: '', description: '' }])} className="text-xs text-blue-600 hover:underline">+ Add volunteering</button>
        </div>
      </Collapsible>
    </div>
  )
}
