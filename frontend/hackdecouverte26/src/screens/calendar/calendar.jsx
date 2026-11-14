
"use client";

import { useState } from "react";
import { addDays } from "date-fns";

import { DayView } from "@/components/layout/day-view/DayView";
import CreateEventDialog from "@/components/layout/create-event";

import { Button } from "@/components/ui/button";

function normalizeEvents(events = []) {
  return events.map((event) => ({
    ...event,
    title: event.title ?? event.name ?? "",
    start: new Date(event.start),
    end: new Date(event.end),
  }));
}

export default function CalendarScreen({
  inputEvents = [],
  courses,
}) {
  const [date, setDate] = useState(() => new Date());

  const [events, setEvents] = useState(
    () => normalizeEvents(inputEvents)
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [initialStartTime, setInitialStartTime] = useState(
    "2026-11-14T09:00"
  );

  const [initialEndTime, setInitialEndTime] = useState(
    "2026-11-14T10:00"
  );

  // Open dialog in create mode.
  const handleOpenCreate = () => {
    setSelectedEvent(null);

    setInitialStartTime("2026-11-14T09:00");
    setInitialEndTime("2026-11-14T10:00");

    setDialogOpen(true);
  };

  // Open dialog in edit mode.
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Create event.
  const handleCreateEvent = (eventData) => {
    setEvents((current) => [
      ...current,
      eventData,
    ]);

    console.log("Created event:", eventData);
  };

  // Update event.
  const handleUpdateEvent = (updatedEvent) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === updatedEvent.id
          ? updatedEvent
          : event
      )
    );

    console.log("Updated event:", updatedEvent);
  };

  // Delete event.
  const handleDeleteEvent = (eventId) => {
    setEvents((current) =>
      current.filter((event) => event.id !== eventId)
    );

    setSelectedEvent(null);

    console.log("Deleted event:", eventId);
  };

  // Callback for clicking an empty calendar time slot.
  // This can later be connected to another component.
  const handleAddEvent = (selectedDate) => {
    console.log("ADD EVENT CALLBACK:", selectedDate);

    // Example for future integration:
    // anotherComponentHandler(selectedDate);
  };

  return (
    <main className="flex h-dvh flex-col">

      {/* Header */}
      <header className="flex flex-col gap-3 border-b px-4 py-3">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Class Social
          </h1>

          <Button onClick={handleOpenCreate}>
            Create Event
          </Button>
        </div>

        {/* Date navigation */}
        <div className="flex gap-2">

          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() =>
              setDate((d) => addDays(d, -1))
            }
          >
            ← Previous
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() =>
              setDate((d) => addDays(d, 1))
            }
          >
            Next →
          </Button>

        </div>
      </header>

      {/* Calendar */}
      <div className="min-h-0 flex-1 overflow-y-auto">

        <DayView
          date={date}
          events={events}

          // Empty time slot clicked.
          onAddEvent={handleAddEvent}

          // Existing event clicked.
          onEventEdit={handleEditEvent}
        />

      </div>

      {/* Shared Create / Edit Dialog */}
      <CreateEventDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedEvent(null);
          }
        }}

        initialEvent={selectedEvent}

        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}

        courses={courses}

        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />

    </main>
  );
}
