DO $$ BEGIN
 CREATE TYPE "public"."page_rule_type" AS ENUM('whitelist', 'blacklist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "page_rule_type" "page_rule_type" DEFAULT 'blacklist' NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "page_rule_patterns" json DEFAULT '[]'::json NOT NULL;