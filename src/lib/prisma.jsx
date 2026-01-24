import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

// PrismaClient singleton for serverless environments
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
