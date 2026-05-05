import { PrismaClient as PrismaTelemedicineClient } from "./generated/telemedicine-database/index.js";

const globalForPrisma = global as unknown as {
  prismaTelemedicine: PrismaTelemedicineClient | undefined;
};

export const prismaTelemedicine =
  globalForPrisma.prismaTelemedicine ??
  new PrismaTelemedicineClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaTelemedicine = prismaTelemedicine;
}
