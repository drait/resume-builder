import { ResumeData } from '../types/resume'
import { useAtsScore } from '../hooks/useAtsScore'

interface Props {
  resume: ResumeData
}

export default function AtsScorePanel({ resume }: Props) {
  const { total, checks } = useAtsScore(resume)

  const color = total >= 80 ? '#16a34a' : total >= 60 ? '#d97706' : '#dc2626'
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (total / 100) * circ

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-4">
      <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">ATS Score</h3>

      <div className="flex justify-center mb-4">
        <svg width="108" height="108" viewBox="0 0 108 108">
          <circle cx="54" cy="54" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="54" cy="54" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 54 54)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <text x="54" y="54" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="bold" fill={color}>
            {total}
          </text>
          <text x="54" y="70" textAnchor="middle" fontSize="10" fill="#6b7280">/ 100</text>
        </svg>
      </div>

      <ul className="space-y-2">
        {checks.map(c => (
          <li key={c.label} className="flex items-start gap-2 text-xs">
            <span className={`mt-0.5 flex-shrink-0 ${c.pass ? 'text-green-500' : 'text-red-400'}`}>
              {c.pass ? '✓' : '✗'}
            </span>
            <span className={c.pass ? 'text-gray-700' : 'text-gray-500'}>
              {c.label}
              {c.detail && <span className="text-gray-400"> ({c.detail})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
