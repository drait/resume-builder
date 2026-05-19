import { Router, Request, Response } from 'express'
import { parseResume } from '../services/claudeParser'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { text } = req.body
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'text field is required' })
    return
  }

  try {
    const resume = await parseResume(text)
    res.json({ resume })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Parsing failed'
    res.status(500).json({ resume: null, error: message })
  }
})

export default router
