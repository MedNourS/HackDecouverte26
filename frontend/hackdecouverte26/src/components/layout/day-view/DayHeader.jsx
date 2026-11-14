import { format } from "date-fns"

export default function DayHeader({ date, ref }) {
  return (
    <div
      ref={ref}
      className="sticky top-0 z-20 flex items-baseline gap-2 rounded-t-xl border-b bg-card px-4 py-3"
    >
      <span className="text-lg font-semibold">{format(date, "EEEE")}</span>
      <span className="text-sm text-muted-foreground">{format(date, "MMMM d, yyyy")}</span>
    </div>
  )
}