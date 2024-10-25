CREATE TABLE IF NOT EXISTS "Chat" (
	"id" uuid PRIMARY KEY NOT NULL,
	"publicId" varchar(32) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"ownerId" uuid NOT NULL,
	"messages" json NOT NULL,
	CONSTRAINT "Chat_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Chunk" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"ownerId" uuid NOT NULL,
	"filePath" text NOT NULL,
	"chunkRef" text NOT NULL,
	"content" text NOT NULL,
	"embedding" real[] NOT NULL,
	"embeddingVector" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingVectorIndex" ON "Chunk" USING hnsw ("embeddingVector" vector_cosine_ops);
