// import "dotenv/config";
import assert from "node:assert";
import { defineConfig } from "drizzle-kit";

assert(process.env.DATABASE_URL, "DATABASE_URL 未设置");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
