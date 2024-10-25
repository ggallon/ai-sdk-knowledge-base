import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/drizzle/query/chat";
import { AuthError } from "@/utils/functions";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user?.id) {
      throw new AuthError("Unauthorized");
    }

    const chats = await getChatsByUserId({ userId: req.auth.user.id });
    return Response.json(chats);
  } catch (error) {
    console.error(
      "API Error handling history:",
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof AuthError) {
      return new Response(null, { status: 401 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
});
