import { format } from "date-fns"

import { HOURS, START_HOUR, hourHeight } from "./constants"

export default function HourLabels() {
  return (
    <div className="shrink-0 select-none border-r">
      {HOURS.map((hour) => (
        <div key={hour} style={{ height: hourHeight }}>
          {/* the hour number */}
          {hour > START_HOUR && (
            <span className="relative -top-2 block px-2 text-right text-xs whitespace-nowrap text-muted-foreground">
              {format(new Date(2000, 0, 1, hour), "h a")}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}