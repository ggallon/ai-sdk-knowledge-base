import type { Message } from "ai";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { chat, chunk, type Chat, type Chunk } from "@/drizzle/schema";

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

export async function insertChunks({ chunks }: { chunks: Chunk[] }) {
  return await db.insert(chunk).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: string[];
}) {
  return await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath));
}
