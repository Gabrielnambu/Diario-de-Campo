import "dotenv/config";
import { defineConfig } from "prisma/config";

// O CLI do Prisma (migrate, studio) precisa de uma conexão de sessão.
// No Supabase isso é a DIRECT_URL (porta 5432); o app em execução usa a
// DATABASE_URL do pooler (porta 6543) — veja src/lib/prisma.ts.
// Sem DIRECT_URL (ex.: banco local do `prisma dev`), usa a DATABASE_URL.
// (`prisma generate` não precisa de URL, por isso não exigimos aqui.)
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
