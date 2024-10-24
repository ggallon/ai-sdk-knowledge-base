ALTER TABLE "Chat" DROP CONSTRAINT "Chat_author_User_email_fk";
--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "author" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "owner" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Chunk" ADD COLUMN "owner" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
