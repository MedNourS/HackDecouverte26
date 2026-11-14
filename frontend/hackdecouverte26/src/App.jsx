import { useState } from "react"
import { addDays, format } from "date-fns"

import { DayView } from "@/components/layout/day-view/DayView"
import { Button } from "@/components/ui/button"

// Makes a Date for `daysFromToday` days from now, at hour:minute.
function at(daysFromToday, hour, minute = 0) {
  const date = addDays(new Date(), daysFromToday)
  date.setHours(hour, minute, 0, 0)
  return date
}

// Sample events: today has overlapping ones, tomorrow has one that crosses midnight.
const SAMPLE_EVENTS = [
  { id: 1, title: "Opening ceremony", start: at(0, 9), end: at(0, 10), color: "violet" },
  { id: 2, title: "Team standup", start: at(0, 9, 30), end: at(0, 9, 45), color: "green" },
  { id: 3, title: "Workshop: React", start: at(0, 9, 30), end: at(0, 11), color: "blue", description: "Hands-on intro to components and hooks" },
  { id: 4, title: "Lunch", start: at(0, 12), end: at(0, 13), color: "amber" },
  { id: 5, title: "Hacking time", start: at(0, 13), end: at(0, 18), color: "red", description: "Build the thing!" },
  { id: 6, title: "Mentor office hours", start: at(0, 14), end: at(0, 15, 30), color: "green" },
  { id: 7, title: "Pizza", start: at(0, 19), end: at(0, 19, 20), color: "amber" },
  { id: 8, title: "Breakfast", start: at(1, 8), end: at(1, 9), color: "amber" },
  { id: 9, title: "Final demos", start: at(1, 13), end: at(1, 16), color: "violet", description: "3 minutes per team" },
  { id: 10, title: "Overnight hacking", start: at(1, 22), end: at(2, 6), color: "red", description: "Crosses midnight" },
]

function App() {
  const [date, setDate] = useState(() => new Date())
  const [events, setEvents] = useState(SAMPLE_EVENTS)
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

export default App