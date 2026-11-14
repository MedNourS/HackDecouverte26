import { differenceInMinutes, startOfDay } from "date-fns"

import { START_MINUTE, pxPerMinute } from "./constants"

export default function CurrentTimeLine({ now }) {
  // Minutes since the top of the calendar (START_HOUR), not since midnight
  const nowMinutes = differenceInMinutes(now, startOfDay(now)) - START_MINUTE

  // Before the calendar starts, there is nowhere to draw it
  if (nowMinutes < 0) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-10 flex h-0 items-center"
      style={{ top: nowMinutes * pxPerMinute }}
    >
      <div className="-ml-1.5 size-3 shrink-0 rounded-full bg-red-500" />
      <div className="h-0.5 flex-1 bg-red-500" />
    </div>
  )
}