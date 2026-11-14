import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const SNAP = 15 // minutes
const TOOLBAR_SPACE = 48 // minutes needed below the block to fit the buttons there

const snap = (minutes) => Math.round(minutes / SNAP) * SNAP
const percent = (part, total) => `${(part / total) * 100}%`
const timeLabel = (minutes) => format(new Date(2000, 0, 1, 0, minutes), "h:mm a")

/**
 * A draft event the user can resize by dragging its top and bottom edges.
 * It covers the whole grid, but only the block, the handles and the buttons catch clicks.
 *
 * All times are minutes since midnight.
 * startTime, endTime: where the block starts
 * dayStart, dayEnd: the first and last minute shown on the grid
 * onConfirm({ startTime, endTime }): times rounded to 15 minutes
 */
export default function NewEvent({ startTime, endTime, dayStart, dayEnd, onConfirm, onCancel }) {
  const total = dayEnd - dayStart
  const [range, setRange] = useState({ startTime, endTime })

  // The library reports each panel's size as a percentage of the grid.
  const handleLayoutChange = (layout) => {
    const start = snap(dayStart + (layout.before / 100) * total)
    const end = snap(dayStart + ((layout.before + layout.event) / 100) * total)
    setRange({ startTime: start, endTime: Math.max(end, start + SNAP) })
  }

  // Buttons go under the block, or above it when it reaches the bottom of the grid.
  const toolbarBelow = dayEnd - range.endTime >= TOOLBAR_SPACE

  const toolbar = (
    <div className="pointer-events-auto flex gap-1.5 p-1.5 drop-shadow-sm">
      <Button size="sm" onClick={() => onConfirm(range)}>
        Confirm
      </Button>
      <Button size="sm" variant="outline" className="bg-card" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )

  return (
    <div data-block-event className="pointer-events-none absolute inset-0 z-[15]">
      <ResizablePanelGroup orientation="vertical" onLayoutChange={handleLayoutChange}>
        <ResizablePanel id="before" defaultSize={percent(startTime - dayStart, total)} minSize="0%">
          {!toolbarBelow && <div className="flex h-full items-end justify-end">{toolbar}</div>}
        </ResizablePanel>

        <ResizableHandle withHandle className="pointer-events-auto bg-transparent [&>div]:h-8 [&>div]:w-1.5 [&>div]:bg-primary" />

        <ResizablePanel
          id="event"
          defaultSize={percent(endTime - startTime, total)}
          minSize={percent(SNAP, total)}
          className="pointer-events-auto overflow-hidden"
        >
          <div className="mx-0.5 flex h-full flex-col justify-start overflow-hidden rounded-md border-2 border-primary bg-card px-2 py-1 text-xs shadow-lg">
            <span className="font-medium">New event</span>
            <span className="text-muted-foreground">
              {timeLabel(range.startTime)} – {timeLabel(range.endTime)}
            </span>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="pointer-events-auto bg-transparent [&>div]:h-8 [&>div]:w-1.5 [&>div]:bg-primary" />

        <ResizablePanel id="after" defaultSize={percent(dayEnd - endTime, total)} minSize="0%">
          {toolbarBelow && <div className="flex justify-end">{toolbar}</div>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}