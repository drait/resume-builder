import { useState } from 'react'
import axios from 'axios'
import { ResumeData } from '../types/resume'

interface Props {
  resume: ResumeData
  onStartOver: () => void
}

function triggerDownload(base64: string, filename: string, mime: string) {
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DownloadButtons({ resume, onStartOver }: Props) {
  const [loading, setLoading] = useState<'pdf' | 'docx' | 'both' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function download(format: 'pdf' | 'docx') {
    setLoading(format)
    setError(null)
    try {
      const { data } = await axios.post<{ pdf?: string; pdfFilename?: string; docx?: string; docxFilename?: string }>(
        '/api/generate',
        { resume, format: 'both' }
      )
      if (format === 'pdf' && data.pdf && data.pdfFilename) {
        triggerDownload(data.pdf, data.pdfFilename, 'application/pdf')
      } else if (format === 'docx' && data.docx && data.docxFilename) {
        triggerDownload(data.docx, data.docxFilename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      }
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Download failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={() => download('pdf')}
          disabled={!!loading}
          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading === 'pdf' ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '↓'}
          Download PDF
        </button>
        <button
          onClick={() => download('docx')}
          disabled={!!loading}
          className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading === 'docx' ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '↓'}
          Download DOCX
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={onStartOver}
        className="text-sm text-gray-400 hover:text-gray-600 underline text-center"
      >
        Start over
      </button>
    </div>
  )
}
