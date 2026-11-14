CREATE TABLE "class_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	CONSTRAINT "timestamps" CHECK ("class_events"."start_date" < "class_events"."end_date")
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	CONSTRAINT "timestamps" CHECK ("user_events"."start_date" < "user_events"."end_date")
);
--> statement-breakpoint
DROP TABLE "classes_events" CASCADE;--> statement-breakpoint
DROP TABLE "events" CASCADE;--> statement-breakpoint
DROP TABLE "users_events" CASCADE;--> statement-breakpoint
ALTER TABLE "class_events" ADD CONSTRAINT "class_events_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;