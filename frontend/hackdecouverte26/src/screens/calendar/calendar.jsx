import { useState } from "react"
import { addDays } from "date-fns"

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
    <main className="flex h-dvh flex-col">
      <header className="flex flex-col gap-3 border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Class Social</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setDate((d) => addDays(d, -1))}>
            ← Previous
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setDate((d) => addDays(d, 1))}>
            Next →
          </Button>
        </div>
      </header>

      {/* The scrolling container lives outside DayView */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DayView date={date} events={events} onEventClick={setSelected} />
      </div>
    </main>
  )
}
