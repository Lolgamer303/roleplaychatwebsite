"use server";

import prisma from "@/app/lib/db";
import { options } from "@/auth";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createApikey(formdata: FormData) {
    const session = await getServerSession(options);
    console.log("Session in createApikey:", session);

    const keyName = formdata.get("name");
    if (!keyName || typeof keyName !== "string") {
        throw new Error("Key name not found");
    }

    if (!session || !session.user) {
        throw new Error("User not authenticated");
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "number") {
        throw new Error(`Invalid user ID, ${userId}, session: ${JSON.stringify(session)}`);
    }

    const apiKey = await prisma.apiKey.create({
        data: {
            key: generateKey(),
            name: keyName,
            userId: userId,
        },
    });

    revalidatePath("/keys");
}

export async function deleteApikey(formdata: FormData) {
    const session = await getServerSession(options);
    const key = formdata.get("key");
    if (!key || typeof key !== "string") {
        throw new Error("Key not found");
    }

    if (!session || !session.user) {
        throw new Error("User not authenticated");
    }
    const userId = session.user.id;
    if (!userId || typeof userId !== "number") {
        throw new Error(`Invalid user ID, ${userId}, session: ${JSON.stringify(session)}`);
    }
    const apiKey = await prisma.apiKey.deleteMany({
        where: {
            key: key,
            userId: userId,
        },
    });
    revalidatePath("/keys");
}

function generateKey(): string {
    const uuid = crypto.randomUUID(); // Generate a UUID
    const hash = crypto.createHash('sha256').update(uuid).digest('base64'); // Hash the UUID and encode it in base64
    return hash;
}