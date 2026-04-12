import z from "zod";

export const IsEmailSchema = z.string().email();
