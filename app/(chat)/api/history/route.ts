import { auth } from "@/app/(auth)/auth";
import { getChatsByUser } from "@/drizzle/query/chat";
import { AuthError } from "@/utils/functions";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user) {
      throw new AuthError("Unauthorized");
    }

    const chats = await getChatsByUser({ email: req.auth.user.email! });
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
