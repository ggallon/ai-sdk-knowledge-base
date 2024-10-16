import { embedMany } from "ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { put } from "@vercel/blob";
import { registry } from "@/ai/setup-registry";
import { auth } from "@/app/(auth)/auth";
import { insertChunks } from "@/drizzle/query/chunk";
import { getPdfContentFromUrl } from "@/utils/pdf";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  const session = await auth();

  if (!session) {
    return Response.redirect("/login");
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

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
}
