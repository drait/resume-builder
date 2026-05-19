# Resume Builder

AI-powered resume builder that parses uploaded resumes, lets you edit the content, and exports a polished PDF or DOCX.

## Features

- Upload a PDF or DOCX resume and have it parsed automatically by Gemini AI
- Edit all fields in a structured form (personal info, summary, skills, experience, education, certifications, languages, volunteering)
- Live preview that matches the exported document exactly
- Download as PDF (Puppeteer) or DOCX
- Client-side ATS score with improvement suggestions

## Tech Stack

| Layer | Stack |
|---|---|
| Client | React 18, Vite, TypeScript, Tailwind CSS |
| Server | Express, TypeScript, ts-node-dev |
| AI | Google Gemini (`gemini-2.5-flash`) |
| PDF | Puppeteer (headless Chrome) |
| DOCX | `docx` npm package |
| Parsing | `pdf-parse`, `mammoth` |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)

### Setup

```bash
# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Start client + server
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

### Build

```bash
npm run build
```

## Project Structure

```
/client       React + Vite frontend
/server       Express API
  routes/     upload, parse, generate
  services/   fileExtractor, claudeParser (Gemini), pdfGenerator, docxGenerator
```
