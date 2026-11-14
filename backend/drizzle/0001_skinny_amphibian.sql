CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"course_number" text NOT NULL,
	"section" integer NOT NULL,
	"teacher" text NOT NULL,
	CONSTRAINT "classes_course_number_unique" UNIQUE("course_number")
);
--> statement-breakpoint
CREATE TABLE "classes_events" (
	"class_id" integer,
	"event_id" integer,
	CONSTRAINT "classes_events_class_id_event_id_pk" PRIMARY KEY("class_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "classes_time_blocks" (
	"class_id" integer,
	"time_block_id" integer,
	CONSTRAINT "classes_time_blocks_class_id_time_block_id_pk" PRIMARY KEY("class_id","time_block_id")
);
--> statement-breakpoint
CREATE TABLE "classes_users" (
	"class_id" integer,
	"user_id" integer,
	CONSTRAINT "classes_users_class_id_user_id_pk" PRIMARY KEY("class_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"semester" integer NOT NULL,
	"section" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses_classes" (
	"course_id" integer,
	"class_id" integer,
	CONSTRAINT "courses_classes_course_id_class_id_pk" PRIMARY KEY("course_id","class_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "time_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_in_cycle" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_events" (
	"user_id" integer,
	"event_id" integer,
	CONSTRAINT "users_events_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "courseId" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "studentId" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school_cycle_days" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "classes_events" ADD CONSTRAINT "classes_events_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_events" ADD CONSTRAINT "classes_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_time_blocks" ADD CONSTRAINT "classes_time_blocks_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_time_blocks" ADD CONSTRAINT "classes_time_blocks_time_block_id_time_blocks_id_fk" FOREIGN KEY ("time_block_id") REFERENCES "public"."time_blocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_users" ADD CONSTRAINT "classes_users_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_users" ADD CONSTRAINT "classes_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_classes" ADD CONSTRAINT "courses_classes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_classes" ADD CONSTRAINT "courses_classes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_events" ADD CONSTRAINT "users_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_events" ADD CONSTRAINT "users_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;