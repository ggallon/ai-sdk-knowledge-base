import type { Message } from "ai";
import {
  pgTable,
  index,
  real,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
  json,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const UserTable = pgTable("User", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: varchar("email", { length: 64 }).unique().notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const ChatTable = pgTable("Chat", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  publicId: varchar("publicId", { length: 32 }).unique().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  owner: uuid("owner")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  author: varchar("author", { length: 64 }),
  messages: json("messages").notNull(),
});

export const ChunkTable = pgTable(
  "Chunk",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    chunkRef: text("chunkRef").notNull(),
    filePath: text("filePath").notNull(),
    owner: uuid("owner")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    embedding: real("embedding").array().notNull(),
    embeddingVector: vector("embeddingVector", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingVectorIndex").using(
      "hnsw",
      table.embeddingVector.op("vector_cosine_ops"),
    ),
  }),
);

export type Chat = Omit<typeof ChatTable.$inferSelect, "messages"> & {
  messages: Message[];
};
export type ChatInsert = typeof ChatTable.$inferInsert;

export type Chunk = Omit<typeof ChunkTable.$inferSelect, "embeddingVector">;
export type ChunkInsert = typeof ChunkTable.$inferInsert;

export type User = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;
