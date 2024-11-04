import type { Message } from "ai";
import {
  index,
  json,
  pgSchema,
  real,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const publicSchema = pgSchema("public");

export const userTable = publicSchema.table("User", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: varchar("email", { length: 64 }).unique().notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const chatTable = publicSchema.table("Chat", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  publicId: varchar("publicId", { length: 32 }).unique().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  messages: json("messages").$type<Message[]>().notNull(),
});

export const chunkTable = publicSchema.table(
  "Chunk",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    filePath: text("filePath").notNull(),
    chunkRef: text("chunkRef").notNull(),
    content: text("content").notNull(),
    embedding: real("embedding").array().notNull(),
    embeddingVector: vector("embeddingVector", { dimensions: 1536 }),
  },
  (table) => [
    index("embeddingVectorIndex").using(
      "hnsw",
      table.embeddingVector.op("vector_cosine_ops"),
    ),
  ],
);

export type Chat = typeof chatTable.$inferSelect;
export type ChatInsert = typeof chatTable.$inferInsert;

export type Chunk = Omit<typeof chunkTable.$inferSelect, "embeddingVector">;
export type ChunkInsert = typeof chunkTable.$inferInsert;

export type User = typeof userTable.$inferSelect;
export type UserInsert = typeof userTable.$inferInsert;
