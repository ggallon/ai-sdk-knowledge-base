import { drizzle } from "drizzle-orm/connect";
import * as schema from "./schema";

export const db = drizzle("vercel-postgres", {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export default db;

export type DrizzleClient = typeof db;
