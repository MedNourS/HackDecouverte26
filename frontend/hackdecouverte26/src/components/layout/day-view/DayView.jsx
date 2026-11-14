
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMinutes,
  format,
  isSameDay,
  startOfDay,
  differenceInMinutes,
} from "date-fns";

import { cn } from "@/lib/utils";

import {
  MINUTES_IN_DAY,
  START_HOUR,
  START_MINUTE,
  hourHeight,
  pxPerMinute,
} from "./constants";

import NewEvent from "./NewEvent";
import CurrentTimeLine from "./CurrentTimeLine";
import DayContainer from "./DayContainer";
import DayHeader from "./DayHeader";

const EVENT_COLORS = {
  blue: "bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-950 dark:text-blue-100",
  green: "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100",
  red: "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100",
  amber: "bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-950 dark:text-amber-100",
  violet: "bg-violet-100 dark:bg-violet-950 border-violet-500 text-violet-950 dark:text-violet-100",
};

function layoutEvents(events, dayStart) {
  const items = events
    .map((event) => {
      const start =
        differenceInMinutes(event.start, dayStart) -
        START_MINUTE;

      const end =
        differenceInMinutes(event.end, dayStart) -
        START_MINUTE;

      return {
        event,
        start: Math.max(0, start),
        end: Math.min(
          MINUTES_IN_DAY - START_MINUTE,
          end
        ),
      };
    })
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  // Keep the rest of your existing column-layout logic unchanged.
  const placed = [];

  let cluster = [];
  let clusterEnd = -1;

  const closeCluster = () => {
    if (cluster.length === 0) return;

    const columns = Math.max(
      1,
      ...cluster.map((item) => item.column + 1)
    );

    for (const item of cluster) {
      placed.push({ ...item, columns });
    }

    cluster = [];
  };

  for (const item of items) {
    if (item.start >= clusterEnd) {
      closeCluster();
      clusterEnd = -1;
    }

    let column = 0;

    while (
      cluster.some(
        (other) =>
          other.column === column &&
          other.end > item.start
      )
    ) {
      column++;
    }

    cluster.push({ ...item, column });
    clusterEnd = Math.max(clusterEnd, item.end);
  }

  closeCluster();

  return placed;
}

function getScrollParent(element) {
  for (
    let node = element?.parentElement;
    node;
    node = node.parentElement
  ) {
    const { overflowY } = getComputedStyle(node);

    if (overflowY === "auto" || overflowY === "scroll") {
      return node;
    }
  }

  return document.scrollingElement;
}

export function DayView({
  date: dateProp,
  events = [],
  scrollToHour,
  onEventClick,
  onCreateEvent,
  className,
}) {
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [now, setNow] = useState(() => new Date());
  const [draft, setDraft] = useState(null);

  const date = dateProp ?? now;

  const dayKey = startOfDay(date).getTime();
  const isToday = isSameDay(date, now);

  const activeDraft =
    draft?.dayKey === dayKey ? draft : null;

  // Update the current-time indicator.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Cancel the draft when Escape is pressed.
  useEffect(() => {
    if (!activeDraft) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDraft(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDraft]);

  // Scroll to the current time or 8 AM.
  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const hour =
      scrollToHour ??
      (isToday ? Math.max(0, now.getHours() - 1) : 8);

    const container = getScrollParent(grid);

    if (!container) return;

    const isPage = container === document.scrollingElement;

    const containerTop = isPage
      ? 0
      : container.getBoundingClientRect().top;

    const gridTop =
      grid.getBoundingClientRect().top -
      containerTop +
      container.scrollTop;

    const headerHeight =
      headerRef.current?.offsetHeight ?? 0;

    container.scrollTop =
      gridTop + hour * hourHeight - headerHeight;
  }, [dayKey, scrollToHour]);

  // Calculate event positions and overlapping columns.
  const laidOut = useMemo(
    () => layoutEvents(events, dayKey),
    [events, dayKey]
  );

  // Handle clicks on the calendar grid.
  const handleGridClick = (event) => {
    const grid = gridRef.current;

    if (!grid) return;

    // Ignore clicks inside the draft event or its controls.
    if (event.target.closest("[data-block-event]")) {
      return;
    }

    // If an existing event was clicked, open it.
    const eventElement = event.target.closest("[data-event-id]");

    if (eventElement) {
      const selectedEvent = events.find(
        (item) =>
          String(item.id) === eventElement.dataset.eventId
      );

      if (selectedEvent) {
        setDraft(null);
        onEventClick?.(selectedEvent);
      }

      return;
    }

    // Calculate the clicked time relative to the calendar grid.
    const rect = grid.getBoundingClientRect();
    const y = event.clientY - rect.top;

    if (y < 0 || y >= MINUTES_IN_DAY * pxPerMinute) {
      return;
    }

    // Round the starting time to the nearest 15-minute interval.
    const clickedMinutes =
      START_MINUTE +
      Math.floor((y / pxPerMinute) / 15) * 15;

    // Start with a one-hour draft.
    const startTime = Math.min(
      clickedMinutes,
      MINUTES_IN_DAY - 60
    );

    setDraft({
      id: Date.now(),
      dayKey,
      startTime,
      endTime: startTime + 60,
    });
  };

  // Confirm the resized draft and send its times to CalendarScreen.
  const handleConfirm = ({ startTime, endTime }) => {
    const start = addMinutes(
      new Date(dayKey),
      startTime
    );

    const end = addMinutes(
      new Date(dayKey),
      endTime
    );

    setDraft(null);

    onCreateEvent?.({ start, end });
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card text-card-foreground",
        className
      )}
    >
      <DayHeader
        ref={headerRef}
        date={date}
      />

      <DayContainer
        gridRef={gridRef}
        onGridClick={handleGridClick}
      >
        {/* Existing events */}
        {laidOut.map(
          ({ event, start, end, column, columns }) => {
            const pixelHeight = Math.max(
              (end - start) * pxPerMinute,
              20
            );

            const compact = pixelHeight < 40;

            return (
              <button
                key={event.id}
                type="button"
                data-event-id={event.id}
                className={cn(
                  "absolute flex flex-col items-stretch overflow-hidden rounded-md border-l-4 px-2 text-left text-xs shadow-sm transition hover:brightness-95",
                  compact
                    ? "justify-center py-0"
                    : "justify-start py-1",
                  EVENT_COLORS[event.color] ??
                    EVENT_COLORS.blue
                )}
                style={{
                  top: start * pxPerMinute,
                  height: pixelHeight - 2,
                  left: `calc(${(column / columns) * 100}% + 2px)`,
                  width: `calc(${100 / columns}% - 4px)`,
                }}
              >
                <div className="font-large">
                  {event.title}
                </div>

                {!compact && (
                  <div className="opacity-70">
                    {format(event.start, "h:mm a")} –{" "}
                    {format(event.end, "h:mm a")}
                  </div>
                )}

                <div>
                  {event.description}
                </div>
              </button>
            );
          }
        )}

        {/* Current time indicator */}
        {isToday && (
          <CurrentTimeLine now={now} />
        )}

        {/* Resizable draft event */}
        {activeDraft && (
          <NewEvent
            key={activeDraft.id}
            startTime={activeDraft.startTime}
            endTime={activeDraft.endTime}
            dayStart={START_MINUTE}
            dayEnd={MINUTES_IN_DAY}
            onConfirm={handleConfirm}
            onCancel={() => setDraft(null)}
          />
        )}
      </DayContainer>
    </div>
  );
}

export default DayView;
