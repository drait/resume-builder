import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ResumeData } from '../../types/resume'

type Experience = ResumeData['experience'][number]

function emptyExp(): Experience {
  return { title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

interface SortableEntryProps {
  id: string
  entry: Experience
  index: number
  onUpdate: (entry: Experience) => void
  onRemove: () => void
}

function SortableEntry({ id, entry, index, onUpdate, onRemove }: SortableEntryProps) {
  const [open, setOpen] = useState(true)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  function setField<K extends keyof Experience>(key: K, val: Experience[K]) {
    onUpdate({ ...entry, [key]: val })
  }

  function setBullet(i: number, val: string) {
    const bullets = [...entry.bullets]
    bullets[i] = val
    onUpdate({ ...entry, bullets })
  }

  function addBullet() { onUpdate({ ...entry, bullets: [...entry.bullets, ''] }) }
  function removeBullet(i: number) {
    onUpdate({ ...entry, bullets: entry.bullets.filter((_, j) => j !== i) })
  }

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <button
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
        >⠿</button>
        <span className="flex-1 font-medium text-sm text-gray-800">
          {entry.title || `Experience ${index + 1}`}
          {entry.company ? <span className="font-normal text-gray-500"> — {entry.company}</span> : null}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="text-xs text-red-400 hover:text-red-600 px-2"
        >Remove</button>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job Title" value={entry.title} onChange={v => setField('title', v)} placeholder="Software Engineer" />
            <Field label="Company" value={entry.company} onChange={v => setField('company', v)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Location" value={entry.location} onChange={v => setField('location', v)} placeholder="Toronto, ON" />
            <Field label="Start Date" value={entry.startDate} onChange={v => setField('startDate', v)} placeholder="Jan 2022" />
            <Field label="End Date" value={entry.endDate} onChange={v => setField('endDate', v)} placeholder="Present" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Bullet Points</label>
            <div className="space-y-2">
              {entry.bullets.map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2 text-gray-400 text-xs flex-shrink-0">•</span>
                  <textarea
                    value={b}
                    onChange={e => setBullet(i, e.target.value)}
                    rows={2}
                    className="flex-1 border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder="Led a team of 5 engineers to deliver…"
                  />
                  <button
                    onClick={() => removeBullet(i)}
                    disabled={entry.bullets.length === 1}
                    className="mt-1 text-xs text-red-400 hover:text-red-600 disabled:opacity-30"
                  >&times;</button>
                </div>
              ))}
            </div>
            <button onClick={addBullet} className="mt-2 text-xs text-blue-600 hover:underline">+ Add bullet</button>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  data: ResumeData['experience']
  onChange: (data: ResumeData['experience']) => void
}

export default function ExperienceSection({ data, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = data.findIndex((_, i) => String(i) === active.id)
      const to = data.findIndex((_, i) => String(i) === over.id)
      onChange(arrayMove(data, from, to))
    }
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={data.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
          {data.map((entry, i) => (
            <SortableEntry
              key={i}
              id={String(i)}
              entry={entry}
              index={i}
              onUpdate={updated => {
                const next = [...data]
                next[i] = updated
                onChange(next)
              }}
              onRemove={() => onChange(data.filter((_, j) => j !== i))}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={() => onChange([...data, emptyExp()])}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  )
}
