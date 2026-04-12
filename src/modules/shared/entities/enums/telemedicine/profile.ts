import z from "zod";

export const Gender = ["MALE", "FEMALE", "OTHER"] as const;
export type Gender = (typeof Gender)[number];

export const ZodEGender = z.enum(Gender);
