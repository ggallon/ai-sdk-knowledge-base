import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { ChatTable, type Chat, type ChatInsert } from "@/drizzle/schema";

export async function createChatMessage({
  publicId,
  owner,
  messages,
}: ChatInsert) {
  let existingChat: Chat | undefined = undefined;

  if (publicId) {
    existingChat = await getChatByPublicId({ publicId });
  }

  if (publicId && existingChat) {
    return await db
      .update(ChatTable)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(ChatTable.id, existingChat.id));
  }

  return await db.insert(ChatTable).values({
    publicId,
    owner,
    messages: JSON.stringify(messages),
  });
}

export async function getChatByPublicId({
  publicId,
}: {
  publicId: Chat["publicId"];
}): Promise<Chat | undefined> {
  return (await db.query.ChatTable.findFirst({
    where: eq(ChatTable.publicId, publicId),
  })) as unknown as Chat | undefined;
}

export async function getChatsByUserId({
  userId,
}: {
  userId: Chat["owner"];
}): Promise<Chat[] | undefined> {
  return (await db.query.ChatTable.findMany({
    where: eq(ChatTable.owner, userId),
    orderBy: desc(ChatTable.createdAt),
  })) as unknown as Chat[] | undefined;
}
