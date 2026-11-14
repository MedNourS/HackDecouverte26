"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function CreateEventDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Event</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Calendar Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Event name */}
          <div className="space-y-2">
            <label>Event Name</label>
            <Input placeholder="Event name..." />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label>Description</label>
            <Textarea placeholder="Event description..." />
          </div>

          {/* Public / Private */}
          <div className="flex items-center justify-between">
            <label>Public Event</label>
            <Switch />
          </div>

          {/* Start and End */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Start Time</label>
              <Input type="datetime-local" />
            </div>

            <div className="space-y-2">
              <label>End Time</label>
              <Input type="datetime-local" />
            </div>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <label>Course</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="computer-science">
                  Computer Science
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}