"use server";

import prisma from "@/app/lib/db";
import { options } from "@/auth";
import { createCampaign, deleteCampaign, deleteChats, editCampaign, getCampaignMessages, getCampaigns, sendChat } from "@/roleplaychatAPI";
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

    await prisma.apiKey.create({
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
    await prisma.apiKey.deleteMany({
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

export async function getServerCampaigns(formdata: FormData) {
    const userId = formdata.get("userId");
    if (!userId || typeof userId !== "string") {
        throw new Error("User ID not found");
    }

    return getCampaigns(userId)
        .then((response) => {
            console.log("Campaigns: ", response);
            revalidatePath("/chat");
            return response; // Ensure the response is returned
        })
        .catch((error) => {
            console.error("Error fetching campaigns: ", error);
            throw error; // Re-throw the error to propagate it
        });
}
export async function createServerCampaign(formdata: FormData) {
    const userId = formdata.get("userId");
    const name = formdata.get("name");
    const book = formdata.get("book");

    if (!userId || typeof userId !== "string") {
        throw new Error("User ID not found");
    }
    if (!name || typeof name !== "string") {
        throw new Error("Name not found");
    }
    if (!book || typeof book !== "string") {
        throw new Error("Book not found");
    }

    return createCampaign(userId, name, book)
        .then((response) => {
            console.log("Campaigns: ", response);
            revalidatePath("/chat");
        }
        )
        .catch((error) => {
            console.error("Error fetching campaigns: ", error);
        }
        );
}
export async function deleteServerCampaign(formdata: FormData) {
    const userId = formdata.get("userId");
    const campaignId = formdata.get("campaignId");

    if (!userId || typeof userId !== "string") {
        throw new Error("User ID not found");
    }
    if (!campaignId || typeof campaignId !== "string") {
        throw new Error("Campaign ID not found");
    }

    return deleteCampaign(userId, campaignId)
        .then((response) => {
            console.log("Campaigns: ", response);
            revalidatePath("/chat");
        }
        )
        .catch((error) => {
            console.error("Error fetching campaigns: ", error);
        }
        );
}
export async function editServerCampaign(formdata: FormData) {
    const userId = formdata.get("userId");
    const campaignId = formdata.get("campaignId");
    const name = formdata.get("name");

    if (!userId || typeof userId !== "string") {
        throw new Error("User ID not found");
    }
    if (!campaignId || typeof campaignId !== "string") {
        throw new Error("Campaign ID not found");
    }
    if (!name || typeof name !== "string") {
        throw new Error("Name not found");
    }

    return editCampaign(userId, campaignId, name)
        .then((response) => {
            console.log("Campaigns: ", response);
            revalidatePath("/chat");
        }
        )
        .catch((error) => {
            console.error("Error fetching campaigns: ", error);
        }
        );
}
export async function getMessages(formdata: FormData) {
    const campaignId = formdata.get("campaignId");
    if (!campaignId || typeof campaignId !== "string") {
        throw new Error("Campaign ID not found");
    }

    return getCampaignMessages(campaignId)
        .then((response) => {
            console.log("Messages: ", response);
            revalidatePath("/chat");
            return response; // Ensure the response is returned
        })
        .catch((error) => {
            console.error("Error fetching messages: ", error);
            throw error; // Re-throw the error to propagate it
        });
}
export async function sendMessage(formdata: FormData) {
    const campaignId = formdata.get("campaignId");
    const message = formdata.get("message");

    if (!campaignId || typeof campaignId !== "string") {
        throw new Error("Campaign ID not found");
    }
    if (!message || typeof message !== "string") {
        throw new Error("Message not found");
    }

    return sendChat(campaignId, message)
        .then((response) => {
            console.log("Messages: ", response);
            revalidatePath("/chat/" + campaignId);
            return response; // Ensure the response is returned
        })
        .catch((error) => {
            console.error("Error fetching messages: ", error);
            throw error; // Re-throw the error to propagate it
        });
}
export async function deleteMessage(formdata: FormData) {
    const messageCount = formdata.get("messageCount");
    const campaignId = formdata.get("campaignId");

    if (!messageCount || typeof messageCount !== "string") {
        throw new Error("Message count not found");
    }
    if (!campaignId || typeof campaignId !== "string") {
        throw new Error("Campaign ID not found");
    }

    return deleteChats(campaignId, Number(messageCount))
        .then((response) => {
            console.log("Messages: ", response);
            revalidatePath("/chat/" + campaignId);
            return response; // Ensure the response is returned
        })
        .catch((error) => {
            console.error("Error fetching messages: ", error);
            throw error; // Re-throw the error to propagate it
        });
}