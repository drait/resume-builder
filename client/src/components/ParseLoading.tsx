import { useEffect, useState } from 'react'

interface Props {
  state: 'uploading' | 'parsing'
}

export default function ParseLoading({ state }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const steps = [
    { key: 'uploading', label: 'Uploading and reading your file…' },
    { key: 'parsing', label: 'Analysing with AI — extracting structured data…' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Processing your resume…</h2>

        <div className="space-y-3 text-left mb-6">
          {steps.map((step, i) => {
            const stepIndex = steps.findIndex(s => s.key === state)
            const isDone = i < stepIndex
            const isCurrent = i === stepIndex
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${isCurrent ? 'text-gray-800 font-medium' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-3 bg-gray-200 rounded animate-pulse ${i === 1 ? 'w-4/5 mx-auto' : 'w-full'}`} />
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4">Elapsed: {elapsed}s · Typically 3–8 seconds</p>
      </div>
    </div>
  )
}
