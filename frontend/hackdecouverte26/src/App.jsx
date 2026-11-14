import { createBrowserRouter, Link, redirect, useRouteError } from "react-router"
import { RouterProvider } from "react-router/dom"
import { addDays, addHours } from "date-fns"

import CalendarScreen from "./screens/calendar.jsx"
import HeroScreen from "./screens/hero.jsx"
import LoginScreen from "./screens/login.jsx"
import SignupScreen from "./screens/singup.jsx"

// Backend address. Set VITE_API_URL in .env (e.g. the deployed backend URL) to change it.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

// Makes a Date for `daysFromToday` days from now, at hour:minute.
function at(daysFromToday, hour, minute = 0) {
  const date = addDays(new Date(), daysFromToday)
  date.setHours(hour, minute, 0, 0)
  return date
}

// Sample events: today has overlapping ones, tomorrow has one that crosses midnight.
// Used in development while the backend has no "events for a user" endpoint (see loadEvents).
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

const router = createBrowserRouter([
  { path: "/", element: <HeroScreen /> },
  { path: "/login", element: <LoginScreen />, action: loginAction },
  { path: "/signup", element: <SignupScreen />, action: signupAction },
  {
    path: "/calendar",
    element: <CalendarScreen />,
    loader: loadEvents,
    errorElement: <RouteError />,
  },
  { path: "*", loader: () => redirect("/") },
])

export default function App() {
  return <RouterProvider router={router} />
}

/**
 * Asks the backend who is logged in (the `sub` from /auth/me).
 * Returns the user id, or null if nobody is logged in.
 */
async function getCurrentUserId(signal) {
  const res = await fetch(`${API_URL}/auth/me`, { signal, credentials: "include" })
  if (!res.ok) return null
  
  const me = await res.json()
  return me?.sub ?? null
}

/**
 * Loads the logged-in user's events before /calendar shows.
 * CalendarScreen reads them with useLoaderData().events.
 */
async function loadEvents({ request }) {
  const userId = await getCurrentUserId(request.signal)
  if (userId == null) return redirect("/login")

  const res = await fetch(`${API_URL}/user-events/user/${userId}`, {
    signal: request.signal,
    credentials: "include",
  })

  // The endpoint doesn't exist on the backend yet: use the sample events while developing.
  // Remove this once GET /user-events/user/:userId is deployed.
  if (res.status === 404 && import.meta.env.DEV) {
    console.warn("GET /user-events/user/:userId not found, showing sample events")
    return { events: SAMPLE_EVENTS }
  }

  if (!res.ok) throw new Response("Couldn't load your events", { status: res.status })

  const rows = await res.json()
  return { events: rows.map(toCalendarEvent) }
}

/**
 * Backend row (user_events table) → the shape DayView uses.
 * { id, userId, name, description, startDate, endDate } → { id, title, description, start, end, color }
 */
function toCalendarEvent(row) {
  const start = new Date(row.startDate)
  // endDate can be empty in the database: show those as 1 hour long.
  const end = row.endDate ? new Date(row.endDate) : addHours(start, 1)

  return {
    id: row.id,
    title: row.name,
    description: row.description ?? undefined,
    start,
    end,
    color: "blue",
  }
}

async function loginAction({ request }) {
  const form = await request.formData()
  const body = {
    email: String(form.get("email")).trim(),
    password: String(form.get("password")),
  }

  const res = await postJson("/auth/login", body)
  if (!res) return { error: "Couldn't reach the server. Try again." }
  if (!res.ok) return { error: "Wrong email or password." }

  // Check the login worked before going to the calendar.
  const id = await getCurrentUserId(request.signal)
  if (id == null) return { error: "Logged in, but couldn't load your account. Try again." }

  return redirect("/calendar")
}

async function signupAction({ request }) {
  const form = await request.formData()
  const body = {
    fullName: String(form.get("fullName")).trim(),
    email: String(form.get("email")).trim(),
    password: String(form.get("password")),
  }

  const res = await postJson("/auth/register", body)
  if (!res) return { error: "Couldn't reach the server. Try again." }
  if (!res.ok) return { error: "Couldn't create your account. Try again." }

  return redirect("/login")
}

// POSTs JSON to the backend. Returns the Response, or null if the server can't be reached.
async function postJson(path, body) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error(`POST ${path} failed:`, err)
    return null
  }
}

function RouteError() {
  const error = useRouteError()
  const message = typeof error?.data === "string" ? error.data : "Something went wrong."

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{message}</h1>
      <p className="text-sm text-muted-foreground">Check your connection, then try again.</p>
      <Link to="/" className="text-sm font-medium underline underline-offset-4">
        Back to home
      </Link>
    </main>
  )
}