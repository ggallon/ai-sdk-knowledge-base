import { notFound, redirect } from "next/navigation";
import { Chat as PreviewChat } from "@/components/chat";
import { getChatByPublicId } from "@/drizzle/query/chat";
import { verifySession } from "@/lib/auth/session";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: PageProps) {
  const user = await verifySession();
  if (!user) {
    redirect("/login");
  }

  const { id } = await props.params;
  const chat = await getChatByPublicId({ publicId: id });
  if (!chat) {
    notFound();
  }

  if (chat.ownerId !== user.id) {
    notFound();
  }

  return (
    <PreviewChat
      publicId={chat.publicId}
      initialMessages={chat.messages}
      user={user}
    />
  );
}
