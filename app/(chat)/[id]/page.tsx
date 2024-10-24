import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/chat";
import { getChatByPublicId } from "@/drizzle/query/chat";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await props.params;
  const chat = await getChatByPublicId({ publicId: id });
  if (!chat) {
    notFound();
  }

  if (chat.author !== session.user?.email) {
    notFound();
  }

  return (
    <PreviewChat
      publicId={chat.publicId}
      initialMessages={chat.messages}
      session={session}
    />
  );
}
