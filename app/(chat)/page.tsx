import { generateId } from "ai";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Chat publicId={generateId()} initialMessages={[]} session={session} />
  );
}
