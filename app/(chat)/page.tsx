import { generateId } from "ai";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { verifySession } from "@/lib/auth/session";

export default async function Page() {
  const user = await verifySession();
  if (!user) {
    redirect("/login");
  }

  return <Chat publicId={generateId()} initialMessages={[]} user={user} />;
}
