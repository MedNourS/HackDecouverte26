import { HOURS, hourHeight } from "./constants"
import HourLabels from "./HourLabels"
import HourLines from "./HourLines"

export default function DayContainer({ gridRef, children }) {
  return (
    <div className="relative flex" style={{ height: hourHeight * HOURS.length }}>
      <HourLabels />

      {/* Grid and events */}
      <div ref={gridRef} className="relative flex-1">
        <HourLines />
        {children}
      </div>
    </div>
  )
}