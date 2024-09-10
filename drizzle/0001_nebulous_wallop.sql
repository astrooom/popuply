ALTER TABLE "sites" ADD COLUMN "domain" varchar(2048) NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN IF EXISTS "url";