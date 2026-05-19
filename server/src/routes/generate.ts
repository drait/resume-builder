import { Router, Request, Response } from 'express'
import { generatePdf, getPdfFilename } from '../services/pdfGenerator'
import { generateDocx, getDocxFilename } from '../services/docxGenerator'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { resume, format } = req.body
  if (!resume) {
    res.status(400).json({ error: 'resume field is required' })
    return
  }

  try {
    if (format === 'pdf') {
      const buffer = await generatePdf(resume)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${getPdfFilename(resume)}"`)
      res.send(buffer)
    } else if (format === 'docx') {
      const buffer = await generateDocx(resume)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', `attachment; filename="${getDocxFilename(resume)}"`)
      res.send(buffer)
    } else if (format === 'both') {
      const [pdfBuf, docxBuf] = await Promise.all([generatePdf(resume), generateDocx(resume)])
      res.json({
        pdf: pdfBuf.toString('base64'),
        pdfFilename: getPdfFilename(resume),
        docx: docxBuf.toString('base64'),
        docxFilename: getDocxFilename(resume),
      })
    } else {
      res.status(400).json({ error: 'format must be "pdf", "docx", or "both"' })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    res.status(500).json({ error: message })
  }
})

export default router
