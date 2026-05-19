import { useState } from 'react'
import { ResumeData } from '../../types/resume'

type Education = ResumeData['education'][number]

function emptyEdu(): Education {
  return { degree: '', institution: '', location: '', graduationYear: '' }
}

interface Props {
  data: ResumeData['education']
  onChange: (data: ResumeData['education']) => void
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

function EduEntry({ entry, index, onUpdate, onRemove }: {
  entry: Education; index: number
  onUpdate: (e: Education) => void; onRemove: () => void
}) {
  const [open, setOpen] = useState(true)
  const set = <K extends keyof Education>(key: K, val: Education[K]) => onUpdate({ ...entry, [key]: val })

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span className="flex-1 font-medium text-sm text-gray-800">
          {entry.degree || `Education ${index + 1}`}
          {entry.institution ? <span className="font-normal text-gray-500"> — {entry.institution}</span> : null}
        </span>
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="text-xs text-red-400 hover:text-red-600 px-2">Remove</button>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree / Certificate" value={entry.degree} onChange={v => set('degree', v)} placeholder="Bachelor of Computer Science" />
            <Field label="Institution" value={entry.institution} onChange={v => set('institution', v)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Location" value={entry.location} onChange={v => set('location', v)} placeholder="Toronto, ON" />
            <Field label="Graduation Year" value={entry.graduationYear} onChange={v => set('graduationYear', v)} placeholder="2020" />
            <Field label="Honours (optional)" value={entry.honours ?? ''} onChange={v => set('honours', v)} placeholder="Dean's Honour List" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EducationSection({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      {data.map((entry, i) => (
        <EduEntry
          key={i}
          entry={entry}
          index={i}
          onUpdate={updated => { const next = [...data]; next[i] = updated; onChange(next) }}
          onRemove={() => onChange(data.filter((_, j) => j !== i))}
        />
      ))}
      <button
        onClick={() => onChange([...data, emptyEdu()])}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Education
      </button>
    </div>
  )
}
