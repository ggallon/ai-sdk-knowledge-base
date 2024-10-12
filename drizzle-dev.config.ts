import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  schemaFilter: ["public", "auth"],
  dbCredentials: {
    url: process.env.POSTGRES_URL_DEV!,
  },
});
