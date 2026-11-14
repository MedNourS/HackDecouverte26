import { HOURS, hourHeight } from "./constants"

export default function HourLines() {
  return HOURS.map((hour) => (
    <div
      key={hour}
      className={hour < 23 ? "border-b border-border/70" : undefined}
      style={{ height: hourHeight }}
    >
      <div className="border-b border-dashed border-border/40" style={{ height: hourHeight / 2 }} />
    </div>
  ))
}