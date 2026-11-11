import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Reaproveita a mesma instância durante o hot reload do `next dev`.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function criarCliente() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? criarCliente();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
