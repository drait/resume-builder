import { useState, useCallback } from 'react'
import axios from 'axios'
import { ResumeData } from '../types/resume'

type ParserState = 'idle' | 'uploading' | 'parsing' | 'done' | 'error'

interface ParserResult {
  state: ParserState
  resume: ResumeData | null
  error: string | null
  run: (file: File) => void
  reset: () => void
}

export function useResumeParser(): ParserResult {
  const [state, setState] = useState<ParserState>('idle')
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (file: File) => {
    setState('uploading')
    setError(null)
    setResume(null)

    try {
      const form = new FormData()
      form.append('file', file)
      const { data: uploadData } = await axios.post<{ text: string; error?: string }>('/api/upload', form)

      if (!uploadData.text) throw new Error(uploadData.error ?? 'Upload failed')

      setState('parsing')
      const { data: parseData } = await axios.post<{ resume: ResumeData | null; error?: string }>('/api/parse', {
        text: uploadData.text,
      })

      if (parseData.resume) {
        setResume(parseData.resume)
        setState('done')
      } else {
        setError(parseData.error ?? 'AI parsing failed — you can fill in the form manually')
        setState('error')
      }
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? err.message
        : err instanceof Error
        ? err.message
        : 'Unknown error'
      setError(msg)
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setResume(null)
    setError(null)
  }, [])

  return { state, resume, error, run, reset }
}
