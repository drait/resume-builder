import { ResumeData } from '../types/resume'

interface Props {
  resume: ResumeData
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2 mt-5">
      <div className="w-1 h-5 rounded" style={{ backgroundColor: '#0A2342' }} />
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0A2342' }}>{title}</h2>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  )
}

export default function ResumePreview({ resume }: Props) {
  const { personal, summary, skills, experience, education, certifications, languages, volunteering } = resume
  const contactParts = [personal.email, personal.phone, personal.location]
  if (personal.linkedIn) contactParts.push(personal.linkedIn)
  if (personal.portfolio) contactParts.push(personal.portfolio)

  return (
    <div
      className="bg-white shadow-sm border border-gray-100 font-resume"
      style={{ padding: '0.75in', maxWidth: '8.5in', margin: '0 auto', minHeight: '11in', fontSize: 11 }}
    >
      {/* Header */}
      <div className="mb-3">
        <h1 style={{ fontSize: 22, fontWeight: 'bold', lineHeight: 1.2 }}>{personal.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{contactParts.filter(Boolean).join(' | ')}</p>
      </div>
      <hr className="border-gray-300 mb-1" />

      {summary && (
        <>
          <SectionHeader title="Professional Summary" />
          <p style={{ lineHeight: 1.4, color: '#1f2937' }}>{summary}</p>
        </>
      )}

      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <>
          <SectionHeader title="Skills" />
          {skills.technical.length > 0 && (
            <p><strong>Technical:</strong> {skills.technical.join(', ')}</p>
          )}
          {skills.soft.length > 0 && (
            <p style={{ marginTop: 2 }}><strong>Core Competencies:</strong> {skills.soft.join(', ')}</p>
          )}
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHeader title="Work Experience" />
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="flex justify-between items-baseline">
                <span style={{ fontWeight: 'bold' }}>{e.title}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{e.startDate} – {e.endDate}</span>
              </div>
              <div style={{ color: '#374151', marginBottom: 3 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
              <ul style={{ marginLeft: 16, lineHeight: 1.5 }}>
                {e.bullets.filter(Boolean).map((b, j) => (
                  <li key={j} style={{ listStyleType: 'disc', marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHeader title="Education" />
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div className="flex justify-between items-baseline">
                <span style={{ fontWeight: 'bold' }}>{e.degree}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{e.graduationYear}</span>
              </div>
              <div style={{ color: '#374151' }}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
              {e.honours && <div style={{ fontSize: 10, color: '#6b7280' }}>{e.honours}</div>}
            </div>
          ))}
        </>
      )}

      {(certifications ?? []).length > 0 && (
        <>
          <SectionHeader title="Certifications" />
          {certifications!.map((c, i) => (
            <p key={i}>{c.name} — {c.issuer} ({c.year})</p>
          ))}
        </>
      )}

      {(languages ?? []).length > 0 && (
        <>
          <SectionHeader title="Languages" />
          {languages!.map((l, i) => (
            <p key={i}>{l.language}: {l.proficiency}</p>
          ))}
        </>
      )}

      {(volunteering ?? []).length > 0 && (
        <>
          <SectionHeader title="Volunteering" />
          {volunteering!.map((v, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{v.role} — {v.organization}</div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>{v.period}</div>
              <p>{v.description}</p>
            </div>
          ))}
        </>
      )}

      <p style={{ marginTop: 24, fontSize: 10, color: '#9ca3af', fontStyle: 'italic' }}>
        References available upon request
      </p>
    </div>
  )
}
