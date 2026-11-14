import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { pxPerMinute } from "./constants"

const EVENT_COLORS = {
  blue: "bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-950 dark:text-blue-100",
  green: "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100",
  red: "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100",
  amber: "bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-950 dark:text-amber-100",
  violet: "bg-violet-100 dark:bg-violet-950 border-violet-500 text-violet-950 dark:text-violet-100",
}

/**
 * One event block on the day grid.
 *
 * event: { id, title, start: Date, end: Date, color?, description? }
 * start, end: minutes from the top of the grid
 * column, columns: which side-by-side column it sits in, out of how many
 */
export default function DayEvent({ event, start, end, column, columns, onClick }) {
  const pixelHeight = Math.max((end - start) * pxPerMinute, 20)
  const compact = pixelHeight < 40

  const startTime = format(event.start, "h:mm a")
  const endTime = format(event.end, "h:mm a")

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(event)
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
      title={`${event.title} · ${startTime} – ${endTime}`}
    >
      <div className={cn("font-medium", compact ? "truncate leading-tight" : "line-clamp-2")}>
        {event.title}
        {compact && <span className="ml-1 font-normal opacity-70">{startTime}</span>}
      </div>
      {!compact && (
        <div className="opacity-70">
          {startTime} – {endTime}
        </div>
      )}
      {!compact && event.description && pixelHeight > 72 && (
        <div className="mt-1 line-clamp-3 opacity-80">{event.description}</div>
      )}
    </button>
  )
}