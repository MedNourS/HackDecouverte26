import { Avatar } from "../ui/avatar";

export default function DayHeader({ date, ref }) {
  return (
    <div
      ref={ref}
      className="sticky top-0 z-20 flex items-baseline gap-2 rounded-t-xl border-b bg-card px-4 py-3"
    >
      <Avatar></Avatar>
    </div>
  )
}