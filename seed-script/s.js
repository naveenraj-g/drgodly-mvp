"use server"

import { prismaMain } from "../src/modules/server/prisma/prisma";
import { prismaTelemedicine } from "../src/modules/server/prisma/prisma";
import { prismaFilenest } from "../src/modules/server/prisma/prisma";
import { hashPassword } from "better-auth/crypto";

import { doctorUsers, patientUsers } from "./data";

export async function seed() {
    try {
        await Promise.all(
            doctorUsers.map(async (user) => {
                await prismaMain.user.create({
                    data: user
                })
            })
        )
    } catch (err) {
        console.log("Failed to seed data", err)
    }
}
export async function userForPatientSeed() {
    try {
        await Promise.all(
            patientUsers.map(async (user) => {
                await prismaMain.user.create({
                    data: user
                })
            })
        )
    } catch (err) {
        console.log("Failed to seed data", err)
    }
}

export async function setPasswordForUsers() {
    const users = await prismaMain.user.findMany({
        where: {
            accounts: {
                none: {}
            }
        }
    });

    await Promise.all(
        users.map(async (user) => {
            const pass = await hashPassword("12345678");
            await prismaMain.account.create({
                data: {
                    accountId: user.id,
                    userId: user.id,
                    providerId: "credential",
                    password: pass,
                }
            })
        })
    )
}