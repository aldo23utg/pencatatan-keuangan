import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

// Ambil URL dari environment
let dbUrl = process.env["POSTGRES_URL_NON_POOLING"] || "";

// Jika URL-nya ada tapi belum punya 'verify-full', kita tempelkan otomatis
if (dbUrl && !dbUrl.includes("sslmode=verify-full")) {
  dbUrl += dbUrl.includes("?") ? "&sslmode=verify-full" : "?sslmode=verify-full";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});