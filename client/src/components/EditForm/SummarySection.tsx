interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SummarySection({ value, onChange }: Props) {
  const len = value.length
  const colorClass = len >= 400 && len <= 600 ? 'text-green-600' : len > 0 ? 'text-amber-600' : 'text-gray-400'

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-600">Professional Summary *</label>
        <span className={`text-xs ${colorClass}`}>{len} / 400–600 chars</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Results-driven professional with X years of experience…"
      />
    </div>
  )
}
