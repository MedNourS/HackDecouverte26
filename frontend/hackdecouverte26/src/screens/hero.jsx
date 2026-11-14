import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

// Same colours as the real calendar events, so the preview looks like the app.
const PREVIEW_COLORS = {
  blue: "bg-blue-100 border-blue-500 text-blue-950 dark:bg-blue-950 dark:text-blue-100",
  green: "bg-emerald-100 border-emerald-500 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100",
  amber: "bg-amber-100 border-amber-500 text-amber-950 dark:bg-amber-950 dark:text-amber-100",
  violet: "bg-violet-100 border-violet-500 text-violet-950 dark:bg-violet-950 dark:text-violet-100",
}

// A made-up day for the preview. Times are in hours (9.5 = 9:30).
const PREVIEW_HOURS = [9, 10, 11, 12, 13, 14]
const PREVIEW_EVENTS = [
  { title: "Calculus", time: "9:00 – 10:30 AM", start: 9, end: 10.5, color: "blue", column: 0, columns: 2 },
  { title: "Study group", time: "9:30 – 10:30 AM", start: 9.5, end: 10.5, color: "green", column: 1, columns: 2 },
  { title: "Lunch on the terrace", time: "12:00 – 1:00 PM", start: 12, end: 13, color: "amber", column: 0, columns: 1 },
  { title: "Biology lab", time: "1:15 – 3:00 PM", start: 13.25, end: 15, color: "violet", column: 0, columns: 1 },
]
const PREVIEW_NOW = 11.3
const ROW = 48 // px per hour in the preview

/**
 * A small, static picture of the day view. Decorative only.
 */
function DayPreview() {
  const top = (hour) => (hour - PREVIEW_HOURS[0]) * ROW

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-2xl border bg-card p-4 shadow-[0_24px_60px_-30px_rgb(30_41_59/0.35)]"
    >
      <div className="mb-3 flex items-baseline gap-2 px-1">
        <span className="text-base font-semibold">Tuesday</span>
        <span className="text-xs text-muted-foreground">March 3</span>
      </div>

      <div className="relative flex" style={{ height: PREVIEW_HOURS.length * ROW }}>
        <div className="shrink-0 border-r pr-2">
          {PREVIEW_HOURS.map((hour) => (
            <div key={hour} style={{ height: ROW }}>
              <span className="relative -top-2 block text-right text-[0.625rem] text-muted-foreground">
                {hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex-1">
          {PREVIEW_HOURS.map((hour) => (
            <div key={hour} className="border-t border-border/70" style={{ height: ROW }} />
          ))}

          {PREVIEW_EVENTS.map((event, i) => (
            <div
              key={event.title}
              className={cn(
                "absolute overflow-hidden rounded-md border-l-4 px-2 py-1 text-[0.6875rem] leading-tight",
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500",
                PREVIEW_COLORS[event.color]
              )}
              style={{
                top: top(event.start) + 1,
                height: (event.end - event.start) * ROW - 2,
                left: `calc(${(event.column / event.columns) * 100}% + 4px)`,
                width: `calc(${100 / event.columns}% - 6px)`,
                animationDelay: `${150 + i * 120}ms`,
              }}
            >
              <div className="truncate font-medium">{event.title}</div>
              <div className="truncate opacity-70">{event.time}</div>
            </div>
          ))}

          <div className="absolute inset-x-0 z-10 flex h-0 items-center" style={{ top: top(PREVIEW_NOW) }}>
            <div className="-ml-1 size-2 shrink-0 rounded-full bg-red-500" />
            <div className="h-px flex-1 bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Landing screen with a button that goes to the login page.
 *
 * loginHref: where the Log in button goes (defaults to "/login").
 */
export default function HeroScreen({ loginHref = "/login" }) {
  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="mx-auto w-full max-w-6xl px-6 py-5 sm:px-10">
        <span className="text-base font-semibold tracking-tight">Class Social</span>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 pb-12 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <h1 className="max-w-[12ch] text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Your class, on one calendar.
          </h1>

          <p className="max-w-[42ch] text-lg leading-relaxed text-muted-foreground">
            Classes, study sessions and lunch plans in a single day view, so you always know
            what’s next and who’ll be there.
          </p>

          <Link href={loginHref} className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-sm")}>
            Log in
          <Link/>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DayPreview />
        </div>
      </section>
    </main>
  )
}
