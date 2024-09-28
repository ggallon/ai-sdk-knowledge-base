import type { Message } from "ai";
import type { Chat } from "@/drizzle/schema";
import { getChatById } from "@/app/db";
import { notFound } from "next/navigation";
import { Chat as PreviewChat } from "@/components/chat";
import { auth } from "@/app/(auth)/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const chatFromDb = await getChatById({ id: params.id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: Chat = {
    ...chatFromDb,
    messages: chatFromDb.messages as Message[],
  };

  const session = await auth();

  if (chat.author !== session?.user?.email) {
    notFound();
  }

  return (
    <PreviewChat
      id={chat.id}
      initialMessages={chat.messages}
      session={session}
    />
  );
}
