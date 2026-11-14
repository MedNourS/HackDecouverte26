import { useState } from "react"
import { addDays, format } from "date-fns"

import { DayView } from "@/components/layout/day-view/DayView"
import { Button } from "@/components/ui/button"

export default function CalendarScreen({ inputEvents }) {
  const [date, setDate] = useState(() => new Date())
  const [events, setEvents] = useState(inputEvents)
  const [selected, setSelected] = useState(null)

  const deleteSelected = () => {
    setEvents((current) => current.filter((event) => event.id !== selected.id))
    setSelected(null)
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">DayView test</h1>
        <div className="flex gap-1">
          <Button variant="outline" onClick={() => setDate((d) => addDays(d, -1))}>
            ← Previous
          </Button>
          <Button variant="outline" onClick={() => setDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={() => setDate((d) => addDays(d, 1))}>
            Next →
          </Button>
        </div>
      </header>

      <p className="text-sm text-muted-foreground">
        Click an event to see its details.
      </p>

      {/* The scrolling container lives outside DayView */}
      <div className="h-[520px] overflow-y-auto rounded-xl">
        <DayView
          date={date}
          events={events}
          onEventClick={setSelected}
        />
      </div>

      <section className="min-h-24 rounded-xl border p-4 text-sm">
        {selected ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{selected.title}</div>
              <div className="text-muted-foreground">
                {format(selected.start, "EEE MMM d, h:mm a")} – {format(selected.end, "EEE MMM d, h:mm a")}
              </div>
              {selected.description && <div className="mt-1">{selected.description}</div>}
            </div>
            <Button variant="destructive" onClick={deleteSelected}>
              Delete
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">No event selected.</span>
        )}
      </section>
    </main>
  )
}