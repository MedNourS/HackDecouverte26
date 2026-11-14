import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function BlockEvent({ startTime, endTime, dayStart, dayEnd }) {
  
  const earlyInterval = startTime - dayStart;
  const timeInterval = endTime - startTime;
  const lateInterval = dayEnd - endTime;
  
  return (
    <div className="w-[400px] min-w-[400px] max-w-[400px] flex-none">
      <ResizablePanelGroup
        orientation="vertical"
        className="h-screen w-full min-h-[400px] rounded-lg border"
      >
        <ResizablePanel defaultSize={earlyInterval} />

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={timeInterval} className="overflow-hidden">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Two</span>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={lateInterval} />
      </ResizablePanelGroup>
    </div>
  )
}