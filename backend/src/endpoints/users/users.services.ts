import { z } from "zod";
import type { getByIdParamsSchema } from "./users.controller";
import { db } from "../../config/db";
import { classes, classesUsers, classEvents, userEvents, users } from "../../config/schema";
import { eq, inArray } from "drizzle-orm";

type Event = {
  id: number,
  type: string,
  name: string,
  description: string | null,
  startDate: Date,
  endDate: Date | null,
}

type Class = {
  id: number;
  name: string;
  section: number;
  courseNumber: string;
  teacher: string;
}

export async function getById(params: z.infer<typeof getByIdParamsSchema>) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  if (!user) {
    return null; // or throw a not-found error, depending on your controller
  }

  // The users join is redundant: classesUsers already has the userId
  const classesThatUserHas = await db
    .select({ class: classes })
    .from(classes)
    .innerJoin(classesUsers, eq(classesUsers.classId, classes.id))
    .where(eq(classesUsers.userId, user.id));

  const userClasses: Class[] = classesThatUserHas.map(row => row.class);
  const classIds = userClasses.map(c => c.id);

  // Fetch user events and class events concurrently
  const [userEventRows, classEventRows] = await Promise.all([
    db.select().from(userEvents).where(eq(userEvents.userId, user.id)),
    classIds.length > 0
      ? db.select().from(classEvents).where(inArray(classEvents.classId, classIds))
      : Promise.resolve([]),
  ]);

  const allEvents: Event[] = [
    ...userEventRows.map(event => ({
      id: event.id,
      type: "userEvent",
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    })),
    ...classEventRows.map(event => ({
      id: event.id,
      type: "classEvent",
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    })),
  ];

  return {
    id: user.id,
    courseId: user.courseId,
    studentId: user.studentId,
    fullName: user.fullName,
    email: user.email,
    schoolCycleDays: user.schoolCycleDays,
    classes: userClasses,
    events: allEvents,
  };
}