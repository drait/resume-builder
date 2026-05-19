import React, { useRef, useState } from 'react'

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

const MAX_SIZE = 10 * 1024 * 1024

export default function Upload({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [selected, setSelected] = useState<File | null>(null)

  function validate(file: File): string | null {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      return 'Only PDF and DOCX files are accepted'
    }
    if (file.size > MAX_SIZE) return 'File must be under 10 MB'
    return null
  }

  function handleFile(file: File) {
    const err = validate(file)
    if (err) { setFileError(err); return }
    setFileError(null)
    setSelected(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  function submit() {
    if (selected) onFile(selected)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Canadian Resume Builder</h1>
        <p className="text-gray-500 mb-6 text-sm">ATS-optimized • Canadian standards • Instant download</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-sm text-blue-700">
          Your CV is processed in memory only and never stored.
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div className="text-4xl mb-3">📄</div>
          {selected ? (
            <div>
              <p className="font-semibold text-gray-800">{selected.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(selected.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse — PDF or DOCX, max 10 MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={onInputChange}
          />
        </div>

        {fileError && <p className="text-red-600 text-sm mt-2">{fileError}</p>}

        <button
          onClick={submit}
          disabled={!selected || disabled}
          className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Analyse with AI
        </button>
      </div>
    </div>
  )
}
