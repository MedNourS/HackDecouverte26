
"use client";

import { useState } from "react";
import { addDays } from "date-fns";

import { DayView } from "@/components/layout/day-view/DayView";
import CreateEventDialog from "@/components/layout/create-event";
import { Button } from "@/components/ui/button";

// Convert a Date to the format required by datetime-local inputs.
function toLocalDateTime(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

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
  courses = [],
}) {
  const [date, setDate] = useState(() => new Date());

  const [events, setEvents] = useState(() =>
    normalizeEvents(inputEvents)
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [initialStartTime, setInitialStartTime] = useState("");
  const [initialEndTime, setInitialEndTime] = useState("");

  // Open the dialog with default times for the selected calendar day.
  const handleOpenCreate = () => {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);

    const end = new Date(start);
    end.setHours(10, 0, 0, 0);

    setSelectedEvent(null);
    setInitialStartTime(toLocalDateTime(start));
    setInitialEndTime(toLocalDateTime(end));
    setDialogOpen(true);
  };

  // Open the dialog to edit an existing event.
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Called when the resizable draft event is confirmed in DayView.
  // The chosen times are passed into the Create Event dialog.
  const handleCreateFromDraft = ({ start, end }) => {
    setSelectedEvent(null);
    setInitialStartTime(toLocalDateTime(new Date(start)));
    setInitialEndTime(toLocalDateTime(new Date(end)));
    setDialogOpen(true);
  };

  // Add a new event after the dialog is submitted.
  const handleCreateEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: eventData.id ?? crypto.randomUUID(),
      title: eventData.title ?? eventData.name ?? "",
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    };

    setEvents((current) => [...current, newEvent]);
    setDialogOpen(false);
  };

  // Update an existing event.
  const handleUpdateEvent = (updatedEvent) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === updatedEvent.id
          ? {
              ...updatedEvent,
              start: new Date(updatedEvent.start),
              end: new Date(updatedEvent.end),
            }
          : event
      )
    );

    setDialogOpen(false);
  };

  // Delete an existing event.
  const handleDeleteEvent = (eventId) => {
    setEvents((current) =>
      current.filter((event) => event.id !== eventId)
    );

    setSelectedEvent(null);
    setDialogOpen(false);
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
            onClick={() => setDate((d) => addDays(d, -1))}
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
            onClick={() => setDate((d) => addDays(d, 1))}
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
          onEventClick={handleEditEvent}
          onCreateEvent={handleCreateFromDraft}
        />
      </div>

      {/* Create / Edit Dialog */}
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
