import { format } from "date-fns"

import { START_HOUR, HOURS, hourHeight } from "./constants"

export default function HourLabels() {
  return (
    <div className="shrink-0 select-none border-r">
      {HOURS.map((hour) => (
        <div key={hour} style={{ height: hourHeight }}>
          {hour > START_HOUR && (
            <span className="relative -top-2 block px-2 text-right text-xs whitespace-nowrap text-muted-foreground">
              {format(new Date(2000, 0, 1, hour - 1), "h a")}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}