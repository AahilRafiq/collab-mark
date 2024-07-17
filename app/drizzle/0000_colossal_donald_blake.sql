CREATE TABLE IF NOT EXISTS "Documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"parentFolder" integer,
	"public" boolean,
	"ownerID" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"parentFolder" integer,
	"ownerID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"email" text,
	"password" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Documents" ADD CONSTRAINT "Documents_parentFolder_Folders_id_fk" FOREIGN KEY ("parentFolder") REFERENCES "public"."Folders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parentFolder_Folders_id_fk" FOREIGN KEY ("parentFolder") REFERENCES "public"."Folders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Folders" ADD CONSTRAINT "Folders_ownerID_Users_id_fk" FOREIGN KEY ("ownerID") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
