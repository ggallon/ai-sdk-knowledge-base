import type { Message } from "ai";
import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { chat, type Chat } from "@/drizzle/schema";

export async function createMessage({
  id,
  messages,
  author,
}: {
  id: string;
  messages: Message[];
  author: string;
}) {
  const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

  if (selectedChats.length > 0) {
    return await db
      .update(chat)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(chat.id, id));
  }

  return await db.insert(chat).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author,
  });
}

export async function getChatsByUser({
  email,
}: {
  email: string;
}): Promise<Chat[] | undefined> {
  return (await db.query.chat.findMany({
    where: eq(chat.author, email),
    orderBy: desc(chat.createdAt),
  })) as unknown as Chat[] | undefined;
}

export async function getChatById({
  id,
}: {
  id: string;
}): Promise<Chat | undefined> {
  return (await db.query.chat.findFirst({
    where: eq(chat.id, id),
  })) as unknown as Chat | undefined;
}
