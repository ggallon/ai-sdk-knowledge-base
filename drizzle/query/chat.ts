import type { Message } from "ai";
import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { chatTable, type Chat, type ChatInsert } from "@/drizzle/schema";

export async function createChatMessage({
  publicId,
  ownerId,
  messages,
}: ChatInsert) {
  let existingChat: Chat | undefined = undefined;

  if (publicId) {
    existingChat = await getChatByPublicId({ publicId });
  }

  if (publicId && existingChat) {
    return await db
      .update(chatTable)
      .set({
        messages: JSON.stringify(messages) as unknown as Message[],
      })
      .where(eq(chatTable.id, existingChat.id));
  }

  return await db.insert(chatTable).values({
    publicId,
    ownerId,
    messages: JSON.stringify(messages) as unknown as Message[],
  });
}

export async function getChatByPublicId({
  publicId,
}: {
  publicId: Chat["publicId"];
}): Promise<Chat | undefined> {
  return (await db.query.chatTable.findFirst({
    where: eq(chatTable.publicId, publicId),
  })) as unknown as Chat | undefined;
}

export async function getChatsByUserId({
  userId,
}: {
  userId: Chat["ownerId"];
}): Promise<Chat[] | undefined> {
  return (await db.query.chatTable.findMany({
    where: eq(chatTable.ownerId, userId),
    orderBy: desc(chatTable.createdAt),
  })) as unknown as Chat[] | undefined;
}
