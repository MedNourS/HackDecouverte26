import { z } from "zod";
import type { getByIdParamsSchema } from "./users.controller";
import { db } from "../../config/db";
import { classes, classesUsers, classEvents, userEvents, users } from "../../config/schema";
import { eq } from "drizzle-orm";

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

type User = {
  id: number,
  courseId: number | null,
  studentId: string | null,
  fullName: string,
  email: string,
  password: string,
  schoolCycleDays: number,
  classes: Class[],
  events: Event[]
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function getById(params: z.infer<typeof getByIdParamsSchema>) {
  const events: Event[] = [];
  const user_classes: Class[] = [];

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  const classesThatUserHas = await db
    .select()
    .from(classes)
    .innerJoin(classesUsers, eq(classesUsers.classId, classes.id))
    .innerJoin(users, eq(users.id, classesUsers.userId))
    .where(eq(users.id, user.id));

  const user_events = await db
    .select()
    .from(userEvents)
    .where(eq(userEvents.userId, user.id));

  user_events.forEach(event => {
    events.push({
      id: event.id,
      type: "userEvent",
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    })
  })

  classesThatUserHas.forEach(async function (classs) {
    user_classes.push(classs.classes);

    const class_events = await db
      .select()
      .from(classEvents)
      .where(eq(classEvents.classId, classs.classes.id));

    class_events.forEach(event => {
      events.push({
        id: event.id,
        type: "classEvent",
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
      })
    })
  })

  const final_user = {
    id: user.id,
    courseId: user.courseId,
    studentId: user.studentId,
    fullName: user.fullName,
    email: user.email,
    password: user.password,
    schoolCycleDays: user.schoolCycleDays,
    classes: user_classes,
    events: user_events
  }

  return final_user; // TODO: fetch the real record
}

