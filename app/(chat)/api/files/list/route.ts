import { list } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";
import { AuthError } from "@/utils/functions";
import { ASK_BLOB_FOLDER_NAME } from "../constants";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthError("Unauthorized");
    }

    const prefix = `${ASK_BLOB_FOLDER_NAME}/${session.user.id}`;
    const { blobs } = await list({ prefix });

    return Response.json(
      blobs.map((blob) => ({
        pathname: blob.pathname.replace(`${prefix}/`, ""),
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
