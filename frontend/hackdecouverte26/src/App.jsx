import CalendarScreen from "./screens/calendar/calendar"
import { addDays } from "date-fns"

// Makes a Date for `daysFromToday` days from now, at hour:minute.
function at(daysFromToday, hour, minute = 0) {
  const date = addDays(new Date(), daysFromToday)
  date.setHours(hour, minute, 0, 0)
  return date
}

// Sample events: today has overlapping ones, tomorrow has one that crosses midnight.
const SAMPLE_EVENTS = [
  { id: 1, title: "Opening ceremony", start: at(0, 9), end: at(0, 10), color: "violet" },
  { id: 2, title: "Team standup", start: at(0, 9, 30), end: at(0, 9, 45), color: "green" },
  { id: 3, title: "Workshop: React", start: at(0, 9, 30), end: at(0, 11), color: "blue", description: "Hands-on intro to components and hooks" },
  { id: 4, title: "Lunch", start: at(0, 12), end: at(0, 13), color: "amber" },
  { id: 5, title: "Hacking time", start: at(0, 13), end: at(0, 18), color: "red", description: "Build the thing!" },
  { id: 6, title: "Mentor office hours", start: at(0, 14), end: at(0, 15, 30), color: "green" },
  { id: 7, title: "Pizza", start: at(0, 19), end: at(0, 19, 20), color: "amber" },
  { id: 8, title: "Breakfast", start: at(1, 8), end: at(1, 9), color: "amber" },
  { id: 9, title: "Final demos", start: at(1, 13), end: at(1, 16), color: "violet", description: "3 minutes per team" },
  { id: 10, title: "Overnight hacking", start: at(1, 22), end: at(2, 6), color: "red", description: "Crosses midnight" },
]

export default function App() {
  return (
    <CalendarScreen inputEvents={SAMPLE_EVENTS} />
  )
}