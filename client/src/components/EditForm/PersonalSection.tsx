import { ResumeData } from '../../types/resume'

interface Props {
  data: ResumeData['personal']
  onChange: (data: ResumeData['personal']) => void
}

function Field({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function PersonalSection({ data, onChange }: Props) {
  const set = (key: keyof ResumeData['personal']) => (v: string) => onChange({ ...data, [key]: v })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name *" value={data.fullName} onChange={set('fullName')} />
        <Field label="Email *" value={data.email} onChange={set('email')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone *" value={data.phone} onChange={set('phone')} placeholder="(416) 555-0100" hint="Format: (XXX) XXX-XXXX" />
        <Field label="Location *" value={data.location} onChange={set('location')} placeholder="Toronto, ON" hint="City, Province" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="LinkedIn" value={data.linkedIn ?? ''} onChange={set('linkedIn')} placeholder="linkedin.com/in/yourname" />
        <Field label="Portfolio / Website" value={data.portfolio ?? ''} onChange={set('portfolio')} placeholder="yoursite.ca" />
      </div>
    </div>
  )
}
