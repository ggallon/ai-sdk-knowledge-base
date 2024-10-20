import { list } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";
import { AuthError } from "@/utils/functions";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new AuthError("Unauthorized");
    }

    const { user } = session;
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
}
