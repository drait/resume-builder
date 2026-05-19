import { Router, Request, Response } from 'express'
import multer from 'multer'
import { extractText } from '../services/fileExtractor'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are accepted'))
    }
  },
})

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }

  try {
    const text = await extractText(req.file.buffer, req.file.mimetype)
    if (!text.trim()) {
      res.status(422).json({ error: 'Could not extract text from file. The file may be image-based.' })
      return
    }
    res.json({ text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'File extraction failed'
    res.status(422).json({ error: message })
  }
})

export default router
