import { eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { ChunkTable, type Chunk, type ChunkInsert } from "@/drizzle/schema";

export async function insertChunks({ chunks }: { chunks: ChunkInsert[] }) {
  return await db.insert(ChunkTable).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: Chunk["filePath"][];
}): Promise<Pick<Chunk, "content" | "embedding">[]> {
  return await db.query.ChunkTable.findMany({
    columns: { content: true, embedding: true },
    where: inArray(ChunkTable.filePath, filePaths),
  });
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: Chunk["filePath"];
}) {
  return await db.delete(ChunkTable).where(eq(ChunkTable.filePath, filePath));
}
