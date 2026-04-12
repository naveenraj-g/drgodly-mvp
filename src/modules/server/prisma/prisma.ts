import { PrismaClient as PrismaMainClient } from "./generated/main-database/index.js";
import { PrismaClient as PrismaTelemedicineClient } from "./generated/telemedicine-database/index.js";
import { PrismaClient as PrismaFilenestClient } from "./generated/filenest/index.js";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaMainClient | undefined;
  prismaTelemedicine: PrismaTelemedicineClient | undefined;
  prismaFilenest: PrismaFilenestClient | undefined;
};

export const prismaMain =
  globalForPrisma.prismaMain ??
  new PrismaMainClient({
    log: ["error", "warn"],
  });

export const prismaTelemedicine =
  globalForPrisma.prismaTelemedicine ??
  new PrismaTelemedicineClient({
    log: ["error", "warn"],
  });

export const prismaFilenest =
  globalForPrisma.prismaFilenest ??
  new PrismaFilenestClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaMain = prismaMain;
  globalForPrisma.prismaTelemedicine = prismaTelemedicine;
  globalForPrisma.prismaFilenest = prismaFilenest;
}
