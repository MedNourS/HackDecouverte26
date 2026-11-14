"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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

import { useState } from "react";

export default function CreateEventDialog({
  initialStartTime = "2026-11-14T09:00",
  initialEndTime = "2026-11-14T10:00",
  courses = [{ value: "Linear Algebra (CSM-406)", label: "Linear Algebra"}],
  onCreate,
  defaultCourse = ""
}) {
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse);

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const eventData = {
      name: eventName,
      description,
      startTime,
      endTime,
      isPublic,
      course: isPublic ? selectedCourse : null,
    };

    onCreate?.(eventData);
  };

  return (
    <Dialog>
      <DialogTrigger className="fixed bottom-6 left-1/2 z-50 inline-flex -translate-x-1/2 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
        Create Event
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Calendar Event</DialogTitle>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handleCreate}>
              Create Event
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}