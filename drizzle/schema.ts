import type { Message } from "ai";
import {
  pgTable,
  varchar,
  text,
  real,
  timestamp,
  uuid,
  json,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable("User", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: varchar("email", { length: 64 }).unique().notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const ChatTable = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  author: varchar("author", { length: 64 })
    .notNull()
    .references(() => UserTable.email),
});

export const ChunkTable = pgTable("Chunk", {
  id: text("id").primaryKey().notNull(),
  filePath: text("filePath").notNull(),
  content: text("content").notNull(),
  embedding: real("embedding").array().notNull(),
});

export type Chat = Omit<typeof ChatTable.$inferSelect, "messages"> & {
  messages: Message[];
};
export type ChatInsert = Omit<typeof ChatTable.$inferSelect, "createdAt">;

export type Chunk = typeof ChunkTable.$inferSelect;
export type ChunkInsert = typeof ChunkTable.$inferInsert;

export type User = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;
