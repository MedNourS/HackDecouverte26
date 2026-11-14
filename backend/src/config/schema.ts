import { pgTable, serial, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  courseId: integer("courseId"),
  studentId: text("studentId"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  schoolCycleDays: integer("school_cycle_days").default(5).notNull()
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  semester: integer("semester").notNull(),
  section: integer("section").notNull(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseNumber: text("course_number").notNull().unique(),
  section: integer("section").notNull(),
  teacher: text("teacher").notNull(),
});

export const coursesClasses = pgTable("courses_classes", {
  courseId: integer("course_id").references(() => courses.id),
  classId: integer("class_id").references(() => classes.id),
}, (table) => [
  primaryKey({ columns: [table.courseId, table.classId] })
]);

export const usersEvents = pgTable("users_events", {
  userId: integer("user_id").references(() => users.id),
  eventId: integer("event_id").references(() => events.id),
}, (table) => [
  primaryKey({ columns: [table.userId, table.eventId] })
]);

export const classesUsers = pgTable("classes_users", {
  classId: integer("class_id").references(() => classes.id),
  userId: integer("user_id").references(() => users.id),
}, (table) => [
  primaryKey({ columns: [table.classId, table.userId] })
]);

export const classesEvents = pgTable("classes_events", {
  classId: integer("class_id").references(() => classes.id),
  eventId: integer("event_id").references(() => events.id),
}, (table) => [
  primaryKey({ columns: [table.classId, table.eventId] })
]);

export const timeBlocks = pgTable("time_blocks", {
  id: serial("id").primaryKey(),
  dayInCycle: integer("day_in_cycle").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
});

export const classesTimeBlocks = pgTable("classes_time_blocks", {
  classId: integer("class_id").references(() => classes.id),
  timeBlockId: integer("time_block_id").references(() => timeBlocks.id),
}, (table) => [
  primaryKey({ columns: [table.classId, table.timeBlockId] })
]);
