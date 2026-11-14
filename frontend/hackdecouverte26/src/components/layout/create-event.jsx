
"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toLocalDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

export default function CreateEventDialog({
  open,
  onOpenChange,
  initialEvent = null,
  initialStartTime = "2026-11-14T09:00",
  initialEndTime = "2026-11-14T10:00",
  courses = [
    {
      value: "Linear Algebra (CSM-406)",
      label: "Linear Algebra",
    },
  ],
  onCreate,
  onUpdate,
  onDelete,
}) {
  const isEditing = Boolean(initialEvent);

  const [isPublic, setIsPublic] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");

  // Populate the form whenever the dialog opens or the selected event changes.
  useEffect(() => {
    if (!open) return;

    if (initialEvent) {
      setEventName(initialEvent.name ?? initialEvent.title ?? "");
      setDescription(initialEvent.description ?? "");

      setStartTime(toLocalDateTime(initialEvent.start));
      setEndTime(toLocalDateTime(initialEvent.end));

      setIsPublic(initialEvent.isPublic ?? true);
      setSelectedCourse(initialEvent.course ?? "");
    } else {
      setEventName("");
      setDescription("");

      setStartTime(initialStartTime);
      setEndTime(initialEndTime);

      setIsPublic(true);
      setSelectedCourse("");
    }
  }, [open, initialEvent, initialStartTime, initialEndTime]);

  const handleCreate = () => {
    if (!eventName.trim()) {
      return;
    }

    if (!startTime || !endTime) {
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return;
    }

    const eventData = {
      id: initialEvent?.id ?? crypto.randomUUID(),

      name: eventName.trim(),
      title: eventName.trim(),

      description,

      start,
      end,

      isPublic,
      course: isPublic ? selectedCourse : null,

      color: initialEvent?.color ?? "blue",
    };

    if (isEditing) {
      onUpdate?.(eventData);
    } else {
      onCreate?.(eventData);
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!initialEvent) return;

    onDelete?.(initialEvent.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Calendar Event" : "Create Calendar Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Event name */}
          <div className="space-y-2">
            <label>Event Name</label>

            <Input
              placeholder="Event name..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label>Description</label>

            <Textarea
              placeholder="Event description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Start and End */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Start Time</label>

              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label>End Time</label>

              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Public / Private */}
          <div className="flex items-center justify-between">
            <label>Public Event</label>

            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <label>Course</label>

            {isPublic ? (
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>

                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem
                      key={course.value}
                      value={course.value}
                    >
                      {course.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value="Private" disabled readOnly />
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">

          {isEditing && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete Event
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleCreate}>
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
