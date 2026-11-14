import { differenceInMinutes, startOfDay } from "date-fns"

import { pxPerMinute } from "./constants"

export default function CurrentTimeLine({ now }) {
  const nowMinutes = differenceInMinutes(now, startOfDay(now))

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
      style={{ top: nowMinutes * pxPerMinute }}
    >
      <div className="-ml-1.5 size-3 rounded-full bg-red-500" />
      <div className="h-0.5 flex-1 bg-red-500" />
    </div>
  )
}
