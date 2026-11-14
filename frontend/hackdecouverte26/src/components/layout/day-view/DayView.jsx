import { useEffect, useMemo, useRef, useState } from "react"
import { format, isSameDay, startOfDay, differenceInMinutes } from "date-fns"

import { cn } from "@/lib/utils"

import { MINUTES_IN_DAY, hourHeight, pxPerMinute } from "./constants"
import CurrentTimeLine from "./CurrentTimeLine"
import DayContainer from "./DayContainer"
import DayHeader from "./DayHeader"

const EVENT_COLORS = {
  blue: "bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-950 dark:text-blue-100",
  green: "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100",
  red: "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100",
  amber: "bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-950 dark:text-amber-100",
  violet: "bg-violet-100 dark:bg-violet-950 border-violet-500 text-violet-950 dark:text-violet-100",
}

/**
 * dayStart is midnight of the day, as a timestamp.
 * Clips each event to the given day and places overlapping events side by
 * side. Returns { event, start, end, column, columns }, with start and end in minutes.
 */
function layoutEvents(events, dayStart) {
  const items = events
    .map((event) => {
      const start = Math.max(0, differenceInMinutes(event.start, dayStart))
      const end = Math.min(MINUTES_IN_DAY, differenceInMinutes(event.end, dayStart))
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
 * A single-day calendar with a fixed-height row for each of the 24 hours.
 * It is always the full 24 hours tall: put it inside a container that scrolls.
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

    const hour = scrollToHour ?? (isToday ? Math.max(0, now.getHours() - 1) : 8)
    const container = getScrollParent(grid)
    const isPage = container === document.scrollingElement

    // Where the grid's top is, measured inside the container's scrollable content.
    const containerTop = isPage ? 0 : container.getBoundingClientRect().top
    const gridTop = grid.getBoundingClientRect().top - containerTop + container.scrollTop

    // The header sticks to the top, so leave room for it.
    const headerHeight = headerRef.current?.offsetHeight ?? 0

    container.scrollTop = gridTop + hour * hourHeight - headerHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey, scrollToHour])

  const laidOut = useMemo(() => layoutEvents(events, dayKey), [events, dayKey])

  return (
    <div className={cn("flex flex-col rounded-xl border bg-card text-card-foreground", className)}>
      <DayHeader ref={headerRef} date={date} />

      <DayContainer gridRef={gridRef}>

        {/* FOR DECLAN -> UNDERSTAND THE FUCTION GOOD LUCK ! */}
        {laidOut.map(({ event, start, end, column, columns }) => {
          const pixelHeight = Math.max((end - start) * pxPerMinute, 20)
          const compact = pixelHeight < 40

          return (
            <button
              key={event.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEventClick?.(event)
              }}
              className={cn(
                "absolute flex flex-col items-stretch overflow-hidden rounded-md border-l-4 px-2 text-left text-xs shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                compact ? "justify-center py-0" : "justify-start py-1",
                EVENT_COLORS[event.color] ?? EVENT_COLORS.blue
              )}
              style={{
                top: start * pxPerMinute,
                height: pixelHeight - 2,
                left: `calc(${(column / columns) * 100}% + 2px)`,
                width: `calc(${100 / columns}% - 4px)`,
              }}
              title={`${event.title} · ${format(event.start, "h:mm a")} – ${format(event.end, "h:mm a")}`}
            >
              <div className={cn("font-medium", compact ? "truncate leading-tight" : "line-clamp-2")}>
                {event.title}
                {compact && (
                  <span className="ml-1 font-normal opacity-70">{format(event.start, "h:mm a")}</span>
                )}
              </div>
              {!compact && (
                <div className="opacity-70">
                  {format(event.start, "h:mm a")} – {format(event.end, "h:mm a")}
                </div>
              )}
              {!compact && event.description && pixelHeight > 72 && (
                <div className="mt-1 line-clamp-3 opacity-80">{event.description}</div>
              )}
            </button>
          )
        })}

        {isToday && <CurrentTimeLine now={now} />}
      </DayContainer>
    </div>
  )
}

export default DayView