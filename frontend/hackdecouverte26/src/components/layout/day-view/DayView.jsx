
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  format,
  isSameDay,
  startOfDay,
  differenceInMinutes,
} from "date-fns";

import { cn } from "@/lib/utils";

import {
  MINUTES_IN_DAY,
  hourHeight,
  pxPerMinute,
} from "./constants";



import CurrentTimeLine from "./CurrentTimeLine";
import DayContainer from "./DayContainer";
import DayHeader from "./DayHeader";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

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
      const start = Math.max(
        0,
        differenceInMinutes(event.start, dayStart)
      );

      const end = Math.min(
        MINUTES_IN_DAY,
        differenceInMinutes(event.end, dayStart)
      );

      return { event, start, end };
    })
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start || b.end - a.end);

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
  onEventEdit,
  onAddEvent,
  className,
}) {
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [now, setNow] = useState(() => new Date());

  const date = dateProp ?? now;

  const dayKey = startOfDay(date).getTime();
  const isToday = isSameDay(date, now);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Scroll to the current time or 8 AM.
  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const hour =
      scrollToHour ??
      (isToday ? Math.max(0, now.getHours() - 1) : 8);

    const container = getScrollParent(grid);

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

  const laidOut = useMemo(
    () => layoutEvents(events, dayKey),
    [events, dayKey]
  );

  // Clicking an empty time slot calls the parent component.
  const handleGridClick = (e) => {
    const grid = gridRef.current;

    if (!grid || !grid.contains(e.target)) return;

    const rect = grid.getBoundingClientRect();

    const y = e.clientY - rect.top;

    if (y < 0 || y >= MINUTES_IN_DAY * pxPerMinute) {
      return;
    }

    const minutes = Math.floor(y / pxPerMinute);

    const selectedDate = new Date(dayKey);

    selectedDate.setMinutes(minutes);

    onAddEvent?.(selectedDate);
  };

  const handleEventClick = (event) => {
    if (onEventEdit) {
      onEventEdit(event);
    } else {
      onEventClick?.(event);
    }
  };

  
return (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div
        className={cn(
          "flex flex-col rounded-xl border bg-card text-card-foreground",
          className
        )}
      >
        <DayHeader ref={headerRef} date={date} />

        <DayContainer gridRef={gridRef}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                  onContextMenu={(e) => e.stopPropagation()}
                  className={cn(
                    "absolute flex flex-col items-stretch overflow-hidden rounded-md border-l-4 px-2 text-left text-xs shadow-sm transition hover:brightness-95",
                    compact ? "justify-center py-0" : "justify-start py-1",
                    EVENT_COLORS[event.color] ?? EVENT_COLORS.blue
                  )}
                  style={{
                    top: start * pxPerMinute,
                    height: pixelHeight - 2,
                    left: `calc(${(column / columns) * 100}% + 2px)`,
                    width: `calc(${100 / columns}% - 4px)`,
                  }}
                >
                  <div className="font-medium">
                    {event.title}
                  </div>

                  {!compact && (
                    <div className="opacity-70">
                      {format(event.start, "h:mm a")} –{" "}
                      {format(event.end, "h:mm a")}
                    </div>
                  )}
                </button>
              );
            }
          )}

          {isToday && <CurrentTimeLine now={now} />}
        </DayContainer>
      </div>
    </ContextMenuTrigger>

    <ContextMenuContent>
      <ContextMenuItem
        onSelect={() => {
          const selectedDate = new Date(date);

          onAddEvent?.(selectedDate);
        }}
      >
        Add Event
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

}

export default DayView;
