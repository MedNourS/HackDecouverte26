import { useEffect, useMemo, useRef, useState } from "react"
import { addMinutes, isSameDay, startOfDay, differenceInMinutes } from "date-fns"

import { cn } from "@/lib/utils"

import { MINUTES_IN_DAY, START_HOUR, START_MINUTE, hourHeight, pxPerMinute } from "./constants"
import NewEvent from "./NewEvent"
import CurrentTimeLine from "./CurrentTimeLine"
import DayContainer from "./DayContainer"
import DayEvent from "./DayEvent"
import DayHeader from "./DayHeader"

/**
 * dayStart is midnight of the day, as a timestamp.
 * Clips each event to the visible hours (START_HOUR to midnight) and places overlapping events side by
 * side. Returns { event, start, end, column, columns }, with start and end in minutes.
 */
function layoutEvents(events, dayStart) {
  const items = events
    .map((event) => {
      // Minutes since the top of the calendar (START_HOUR), cut to the visible hours
      const start = Math.max(0, differenceInMinutes(event.start, dayStart) - START_MINUTE)
      const end = Math.min(MINUTES_IN_DAY - START_MINUTE, differenceInMinutes(event.end, dayStart) - START_MINUTE)
      return { event, start, end }
    })
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start || b.end - a.end)

  const placed = []
  let cluster = []
  let clusterEnd = -1

  const closeCluster = () => {
    const columns = Math.max(0, ...cluster.map((item) => item.column + 1))
    for (const item of cluster) placed.push({ ...item, columns })
    cluster = []
  }

  for (const item of items) {
    // A new cluster starts when this event begins after everything so far ends.
    if (item.start >= clusterEnd) {
      closeCluster()
      clusterEnd = -1
    }

    // Use the first column whose last event has already finished.
    let column = 0
    while (cluster.some((other) => other.column === column && other.end > item.start)) {
      column++
    }

    cluster.push({ ...item, column })
    clusterEnd = Math.max(clusterEnd, item.end)
  }
  closeCluster()

  return placed
}

/**
 * The closest ancestor that scrolls vertically, or the page itself.
 */
function getScrollParent(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === "auto" || overflowY === "scroll") return node
  }
  return document.scrollingElement
}

/**
 * A single-day calendar with a fixed-height row for each hour from START_HOUR to midnight.
 * It is always that full height: put it inside a container that scrolls.
 *
 * date: the day to show (defaults to today).
 * events: [{ id, title, start: Date, end: Date, color?: "blue" | "green" | "red" | "amber" | "violet", description? }]
 *
 * Clicking the grid:
 * - on an event: calls onEventClick(event)
 * - on an empty spot: shows a resizable draft event (BlockEvent). Confirming it calls
 *   onCreateEvent({ start: Date, end: Date }) with the chosen times.
 */
export function DayView({
  date: dateProp,
  events = [],
  scrollToHour,
  onEventClick,
  onCreateEvent,
  className,
}) {
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  const [now, setNow] = useState(() => new Date())
  const date = dateProp ?? now

  // Start of the day, as a timestamp
  const dayKey = startOfDay(date).getTime()
  const isToday = isSameDay(date, now)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  // Scroll the outside container to the current time today, otherwise to 8 AM.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const hour = Math.max(START_HOUR, scrollToHour ?? (isToday ? now.getHours() - 1 : 8))
    const container = getScrollParent(grid)
    const isPage = container === document.scrollingElement

    // Where the grid's top is, measured inside the container's scrollable content.
    const containerTop = isPage ? 0 : container.getBoundingClientRect().top
    const gridTop = grid.getBoundingClientRect().top - containerTop + container.scrollTop

    // The header sticks to the top, so leave room for it.
    const headerHeight = headerRef.current?.offsetHeight ?? 0

    container.scrollTop = gridTop + (hour - START_HOUR) * hourHeight - headerHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey, scrollToHour])

  const laidOut = useMemo(() => layoutEvents(events, dayKey), [events, dayKey])

  // The draft event shown after clicking an empty spot. Times are minutes since midnight.
  // It belongs to one day, so it disappears when you switch days.
  const [draft, setDraft] = useState(null)
  const activeDraft = draft?.dayKey === dayKey ? draft : null

  // Escape removes the draft.
  useEffect(() => {
    if (!activeDraft) return
    const onKeyDown = (e) => e.key === "Escape" && setDraft(null)
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeDraft])

  // One click handler for the whole grid: it checks what was clicked.
  const handleGridClick = (e) => {
    // Clicks on the draft's block, handles or buttons are handled by BlockEvent itself.
    if (e.target.closest("[data-block-event]")) return

    // Clicked an event: open it.
    const eventElement = e.target.closest("[data-event-id]")
    if (eventElement) {
      //match the event element to the event
      const event = events.find((ev) => String(ev.id) === eventElement.dataset.eventId)

      //if the draft was previously open -> close it
      setDraft(null)

      if (event) onEventClick?.(event)
      return
    }

    // Clicked an empty spot: put a 1-hour draft there, starting on the 15 minutes clicked.
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top
    const clicked = START_MINUTE + Math.floor(y / pxPerMinute / 15) * 15
    const startTime = Math.min(clicked, MINUTES_IN_DAY - 60)

    setDraft({ id: Date.now(), dayKey, startTime, endTime: startTime + 60 })
  }

  const handleConfirm = ({ startTime, endTime }) => {
    setDraft(null)
    onCreateEvent?.({ start: addMinutes(dayKey, startTime), end: addMinutes(dayKey, endTime) })
  }

  return (
    <div className={cn("flex flex-col bg-card text-card-foreground", className)}>
      <DayHeader ref={headerRef} date={date} />

      <DayContainer gridRef={gridRef} onGridClick={handleGridClick}>

        {/* FOR DECLAN -> UNDERSTAND THE FUCTION GOOD LUCK ! */}
        {laidOut.map(({ event, start, end, column, columns }) => (
          <DayEvent
            key={event.id}
            event={event}
            start={start}
            end={end}
            column={column}
            columns={columns}
          />
        ))}

        {isToday && <CurrentTimeLine now={now} />}

        {activeDraft && (
          <NewEvent
            key={activeDraft.id}
            startTime={activeDraft.startTime}
            endTime={activeDraft.endTime}
            dayStart={START_MINUTE}
            dayEnd={MINUTES_IN_DAY}
            onConfirm={handleConfirm}
            onCancel={() => setDraft(null)}
          />
        )}
      </DayContainer>
    </div>
  )
}

export default DayView
