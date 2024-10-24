import { list } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";
import { AuthError } from "@/utils/functions";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user) {
      throw new AuthError("Unauthorized");
    }

    const { user } = req.auth;
    const { blobs } = await list({ prefix: user.email! });

    return Response.json(
      blobs.map((blob) => ({
        pathname: blob.pathname.replace(`${user.email!}/`, ""),
        url: blob.url,
      })),
    );
  } catch (error) {
    console.error(
      "API Error handling files list:",
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof AuthError) {
      return new Response(null, { status: 401 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
});
