import { embedMany } from "ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { put } from "@vercel/blob";
import { registry } from "@/ai/setup-registry";
import { auth } from "@/app/(auth)/auth";
import { insertChunks } from "@/drizzle/query/chunk";
import { AuthError, ASKError } from "@/utils/functions";
import { getPdfContentFromUrl } from "@/utils/pdf";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new AuthError("Unauthorized");
    }

    if (request.body === null) {
      throw new ASKError("Request body is empty");
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const { user } = session;
    const { downloadUrl, pathname, url } = await put(
      `${user.email}/${filename}`,
      request.body,
      {
        access: "public",
      },
    );
    const content = await getPdfContentFromUrl(downloadUrl);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const chunkedContent = await textSplitter.createDocuments([content]);
    const { embeddings } = await embedMany({
      model: registry.textEmbeddingModel("openai:text-embedding-3-small"),
      values: chunkedContent.map((chunk) => chunk.pageContent),
    });

    await insertChunks({
      chunks: chunkedContent.map((chunk, i) => ({
        chunkRef: `${user.email}/${filename}/${i}`,
        filePath: `${user.email}/${filename}`,
        content: chunk.pageContent,
        embedding: embeddings[i],
        embeddingVector: embeddings[i],
      })),
    });

    return Response.json({ pathname, url });
  } catch (error) {
    console.error(
      "API Error handling files upload:",
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
