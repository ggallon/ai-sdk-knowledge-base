import { head, del } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";
import { deleteChunksByFilePath } from "@/drizzle/query/chunk";
import { ASK_BLOB_FOLDER_NAME } from "@/lib/constants";
import { AuthError, ASKError } from "@/utils/functions";

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthError("Unauthorized");
    }

    if (req.body === null) {
      throw new ASKError("Request body is empty");
    }

    const { searchParams } = new URL(req.url);
    const fileurl = searchParams.get("fileurl");
    if (fileurl === null) {
      throw new ASKError("File url not provided");
    }

    const { pathname } = await head(fileurl);
    const prefix = `${ASK_BLOB_FOLDER_NAME}/${session.user.id}`;
    if (!pathname.startsWith(prefix)) {
      throw new AuthError("Forbidden");
    }

    await del(fileurl);
    await deleteChunksByFilePath({ filePath: pathname });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(
      "API Error handling files delete:",
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof AuthError) {
      return new Response(null, {
        status: error.message === "Forbidden" ? 403 : 401,
      });
    }

    if (error instanceof ASKError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
