import { eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { chunk, type Chunk } from "@/drizzle/schema";

export async function insertChunks({ chunks }: { chunks: Chunk[] }) {
  return await db.insert(chunk).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: string[];
}) {
  return await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath));
}
