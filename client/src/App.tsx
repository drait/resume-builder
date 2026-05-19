import { useState, useEffect } from 'react'
import { ResumeData, emptyResume } from './types/resume'
import { useResumeParser } from './hooks/useResumeParser'
import Upload from './components/Upload'
import ParseLoading from './components/ParseLoading'
import AtsScorePanel from './components/AtsScorePanel'
import ResumePreview from './components/ResumePreview'
import DownloadButtons from './components/DownloadButtons'
import PersonalSection from './components/EditForm/PersonalSection'
import SummarySection from './components/EditForm/SummarySection'
import SkillsSection from './components/EditForm/SkillsSection'
import ExperienceSection from './components/EditForm/ExperienceSection'
import EducationSection from './components/EditForm/EducationSection'
import OptionalSections from './components/EditForm/OptionalSections'

type AppStep = 'upload' | 'loading' | 'edit' | 'preview'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function ValidationBanner({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
      <strong>Please fix the following before generating:</strong>
      <ul className="mt-1 list-disc list-inside">
        {errors.map(e => <li key={e}>{e}</li>)}
      </ul>
    </div>
  )
}

function validate(r: ResumeData): string[] {
  const errors: string[] = []
  if (!r.personal.fullName.trim()) errors.push('Full name is required')
  if (!r.personal.email.trim()) errors.push('Email is required')
  if (!r.personal.phone.trim()) errors.push('Phone is required')
  if (!r.personal.location.trim()) errors.push('Location is required')
  if (!r.summary.trim()) errors.push('Professional summary is required')
  if (r.experience.length === 0) errors.push('At least one work experience is required')
  else if (!r.experience.some(e => e.bullets.filter(Boolean).length >= 1)) {
    errors.push('At least one experience must have a bullet point')
  }
  return errors
}

export default function App() {
  const [step, setStep] = useState<AppStep>('upload')
  const [resume, setResume] = useState<ResumeData>(emptyResume())
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [parseError, setParseError] = useState<string | null>(null)

  const parser = useResumeParser()

  function onFile(file: File) {
    setStep('loading')
    parser.run(file)
  }

  useEffect(() => {
    if (step !== 'loading') return
    if (parser.state === 'done' && parser.resume) {
      setResume(parser.resume)
      setStep('edit')
    } else if (parser.state === 'error') {
      setParseError(parser.error)
      setResume(emptyResume())
      setStep('edit')
    }
  }, [parser.state, parser.resume, parser.error, step])

  function tryGenerate() {
    const errors = validate(resume)
    setValidationErrors(errors)
    if (errors.length === 0) setStep('preview')
  }

  function startOver() {
    setStep('upload')
    setResume(emptyResume())
    setValidationErrors([])
    setParseError(null)
    parser.reset()
  }

  if (step === 'upload') {
    return <Upload onFile={onFile} />
  }

  if (step === 'loading' && (parser.state === 'uploading' || parser.state === 'parsing')) {
    return <ParseLoading state={parser.state} />
  }

  if (step === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-gray-900">Canadian Resume Builder</h1>
          <button onClick={startOver} className="text-sm text-gray-400 hover:text-gray-600 underline">Start over</button>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {parseError && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                AI parsing encountered an issue — please fill in the form manually. ({parseError})
              </div>
            )}

            <ValidationBanner errors={validationErrors} />

            <SectionCard title="Personal Information">
              <PersonalSection data={resume.personal} onChange={personal => setResume(r => ({ ...r, personal }))} />
            </SectionCard>

            <SectionCard title="Professional Summary">
              <SummarySection value={resume.summary} onChange={summary => setResume(r => ({ ...r, summary }))} />
            </SectionCard>

            <SectionCard title="Skills">
              <SkillsSection data={resume.skills} onChange={skills => setResume(r => ({ ...r, skills }))} />
            </SectionCard>

            <SectionCard title="Work Experience">
              <ExperienceSection data={resume.experience} onChange={experience => setResume(r => ({ ...r, experience }))} />
            </SectionCard>

            <SectionCard title="Education">
              <EducationSection data={resume.education} onChange={education => setResume(r => ({ ...r, education }))} />
            </SectionCard>

            <SectionCard title="Optional Sections">
              <OptionalSections data={resume} onChange={setResume} />
            </SectionCard>

            <button
              onClick={tryGenerate}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-base"
            >
              Generate Resume →
            </button>
          </div>

          <div className="col-span-1">
            <AtsScorePanel resume={resume} />
          </div>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-bold text-gray-900">Resume Preview</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setStep('edit')} className="text-sm text-gray-500 hover:text-gray-700 underline">← Back to edit</button>
            <div className="w-64">
              <DownloadButtons resume={resume} onStartOver={startOver} />
            </div>
          </div>
        </header>
        <div className="py-8 px-4">
          <ResumePreview resume={resume} />
        </div>
      </div>
    )
  }

  return null
}
