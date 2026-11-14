import { useEffect, useMemo, useRef, useState } from "react"
import { isSameDay, startOfDay, differenceInMinutes } from "date-fns"

import { cn } from "@/lib/utils"

import { MINUTES_IN_DAY, START_HOUR, START_MINUTE, hourHeight } from "./constants"
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
 */
export function DayView({
  date: dateProp,
  events = [],
  scrollToHour,
  onEventClick,
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

  return (
    <div className={cn("flex flex-col bg-card text-card-foreground", className)}>
      <DayHeader ref={headerRef} date={date} />

      <DayContainer gridRef={gridRef}>

        {/* FOR DECLAN -> UNDERSTAND THE FUCTION GOOD LUCK ! */}
        {laidOut.map(({ event, start, end, column, columns }) => (
          <DayEvent
            key={event.id}
            event={event}
            start={start}
            end={end}
            column={column}
            columns={columns}
            onClick={onEventClick}
          />
        ))}

        {isToday && <CurrentTimeLine now={now} />}
      </DayContainer>
    </div>
  )
}

export default DayView