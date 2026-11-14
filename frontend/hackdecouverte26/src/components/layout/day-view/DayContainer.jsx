import { HOURS, hourHeight } from "./constants"
import HourLabels from "./HourLabels"
import HourLines from "./HourLines"

export default function DayContainer({ gridRef, onGridClick, children }) {
  return (
    <div className="relative flex" style={{ height: HOURS.length * hourHeight }}>
      <HourLabels />

      {/* Grid and events */}
      <div ref={gridRef} className="relative flex-1 cursor-pointer" onClick={onGridClick}>
        <HourLines />
        {children}
      </div>
    </div>
  )
}