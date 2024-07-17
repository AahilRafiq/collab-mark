ALTER TABLE "Users" RENAME COLUMN "username" TO "name";--> statement-breakpoint
ALTER TABLE "Documents" ALTER COLUMN "parentFolder" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Documents" ALTER COLUMN "public" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Documents" ALTER COLUMN "ownerID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Folders" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Folders" ALTER COLUMN "ownerID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "password" SET NOT NULL;