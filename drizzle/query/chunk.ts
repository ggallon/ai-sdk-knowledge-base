import { and, eq, inArray } from "drizzle-orm";
import { ASK_BLOB_FOLDER_NAME } from "@/lib/constants";
import { db } from "@/drizzle/db";
import { chunkTable, type Chunk, type ChunkInsert } from "@/drizzle/schema";

export async function insertChunks({ chunks }: { chunks: ChunkInsert[] }) {
  return await db.insert(chunkTable).values(chunks);
}

export async function getChunksByFilePaths({
  ownerId,
  filePaths,
}: {
  ownerId: Chunk["ownerId"];
  filePaths: Chunk["filePath"][];
}): Promise<Pick<Chunk, "content" | "embedding">[]> {
  const ownerFilePaths = filePaths.map(
    (path) => `${ASK_BLOB_FOLDER_NAME}/${ownerId}/${path}`,
  );
  return await db.query.chunkTable.findMany({
    columns: { content: true, embedding: true },
    where: and(
      eq(chunkTable.ownerId, ownerId),
      inArray(chunkTable.filePath, ownerFilePaths),
    ),
  });
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: Chunk["filePath"];
}) {
  return await db.delete(chunkTable).where(eq(chunkTable.filePath, filePath));
}
