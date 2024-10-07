import type { Message } from "ai";
import { pgTable } from "drizzle-orm/pg-core";

export const UserTable = pgTable("User", (t) => ({
  email: t.varchar({ length: 64 }).primaryKey().notNull(),
  password: t.varchar({ length: 64 }),
}));

export const ChatTable = pgTable("Chat", (t) => ({
  id: t.text().primaryKey().notNull(),
  createdAt: t.timestamp().notNull(),
  messages: t.json().notNull(),
  author: t
    .varchar({ length: 64 })
    .notNull()
    .references(() => UserTable.email),
}));

export const ChunkTable = pgTable("Chunk", (t) => ({
  id: t.text().primaryKey().notNull(),
  filePath: t.text().notNull(),
  content: t.text().notNull(),
  embedding: t.real().array().notNull(),
}));

export type Chat = Omit<typeof ChatTable.$inferSelect, "messages"> & {
  messages: Message[];
};
export type ChatInsert = Omit<typeof ChatTable.$inferSelect, "createdAt">;

export type Chunk = typeof ChunkTable.$inferSelect;
export type ChunkInsert = typeof ChunkTable.$inferInsert;

export type User = Omit<typeof UserTable.$inferSelect, "password">;
export type UserSelectAll = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;
