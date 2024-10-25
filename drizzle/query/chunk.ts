import { and, eq, inArray } from "drizzle-orm";
import { ASK_BLOB_FOLDER_NAME } from "@/app/(chat)/api/files/constants";
import { db } from "@/drizzle/db";
import { ChunkTable, type Chunk, type ChunkInsert } from "@/drizzle/schema";

export async function insertChunks({ chunks }: { chunks: ChunkInsert[] }) {
  return await db.insert(ChunkTable).values(chunks);
}

export async function getChunksByFilePaths({
  ownerId,
  filePaths,
}: {
  ownerId: Chunk["owner"];
  filePaths: Chunk["filePath"][];
}): Promise<Pick<Chunk, "content" | "embedding">[]> {
  const ownerFilePaths = filePaths.map(
    (path) => `${ASK_BLOB_FOLDER_NAME}/${ownerId}/${path}`,
  );
  return await db.query.ChunkTable.findMany({
    columns: { content: true, embedding: true },
    where: and(
      eq(ChunkTable.owner, ownerId),
      inArray(ChunkTable.filePath, ownerFilePaths),
    ),
  });
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: Chunk["filePath"];
}) {
  return await db.delete(ChunkTable).where(eq(ChunkTable.filePath, filePath));
}
