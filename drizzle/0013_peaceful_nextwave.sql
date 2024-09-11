ALTER TABLE "users" ALTER COLUMN "github_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "github_id" DROP NOT NULL;