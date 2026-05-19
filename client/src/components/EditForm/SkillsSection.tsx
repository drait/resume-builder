import { useState } from 'react'
import { ResumeData } from '../../types/resume'

interface Props {
  data: ResumeData['skills']
  onChange: (data: ResumeData['skills']) => void
}

function TagInput({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed])
    }
    setInput('')
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-8">
        {items.map(item => (
          <span key={item} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {item}
            <button onClick={() => onChange(items.filter(i => i !== item))} className="hover:text-red-600 leading-none">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type and press Enter…"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={add} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg border border-gray-300">Add</button>
      </div>
    </div>
  )
}

export default function SkillsSection({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TagInput
        label="Technical Skills"
        items={data.technical}
        onChange={technical => onChange({ ...data, technical })}
      />
      <TagInput
        label="Core Competencies / Soft Skills"
        items={data.soft}
        onChange={soft => onChange({ ...data, soft })}
      />
    </div>
  )
}
