'use server';

import axios from "axios";
import 'dotenv/config';

export async function getCampaigns(userId: string) {
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_PRODUCTION_KEY;

    if (!apiUrl) {
        throw new Error("Environment variable 'API_URL' is not set.");
    }

    if (!apiKey) {
        throw new Error("Environment variable 'API_PRODUCTION_KEY' is not set.");
    }

    try {
        const body = {
            userId: userId,
        };
        const response = await axios.get(`${apiUrl}/campaigns`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            params: body,
        });

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            console.log(response.data + ' ' + response.status);
            return response.data;
        }

        throw new Error(`Request failed with status code: ${response.status}, Response: ${response.data}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching campaigns: ${errorMessage}`);
        throw error;
    }
}
export async function createCampaign(userId: string, name: string, book: string) {
    const apiUrl = process.env.API_URL
    const apiKey = process.env.API_PRODUCTION_KEY;

    if (!apiUrl) {
        throw new Error("Environment variable 'API_URL' is not set.");
    }

    if (!apiKey) {
        throw new Error("Environment variable 'API_PRODUCTION_KEY' is not set.");
    }

    try {
        const body = {
            userId: userId,
            name: name,
            book: book,
        };
        const response = await axios.post(`${apiUrl}/campaigns`, body, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            console.log(response.data + ' ' + response.status);
            return response.data;
        }

        throw new Error(`Request failed with status code: ${response.status}, Response: ${response.data}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error creating campaign: ${errorMessage}`);
        throw error;
    }
}
export async function deleteCampaign(userId: string, campaignId: string) {
    const apiUrl = process.env.API_URL
    const apiKey = process.env.API_PRODUCTION_KEY;

    if (!apiUrl) {
        throw new Error("Environment variable 'API_URL' is not set.");
    }

    if (!apiKey) {
        throw new Error("Environment variable 'API_PRODUCTION_KEY' is not set.");
    }

    try {
        const body = {
            userId: userId,
        };
        const response = await axios.delete(`${apiUrl}/campaigns/${campaignId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            data: body,
        });

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            console.log(response.data + ' ' + response.status);
            return response.data;
        }

        throw new Error(`Request failed with status code: ${response.status}, Response: ${response.data}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error deleting campaign: ${errorMessage}`);
        throw error;
    }
}
export async function editCampaign(userId: string, campaignId: string, name: string) {
    const apiUrl = process.env.API_URL
    const apiKey = process.env.API_PRODUCTION_KEY;

    if (!apiUrl) {
        throw new Error("Environment variable 'API_URL' is not set.");
    }

    if (!apiKey) {
        throw new Error("Environment variable 'API_PRODUCTION_KEY' is not set.");
    }

    try {
        const body = {
            userId: userId,
            name: name,
        };
        const response = await axios.put(`${apiUrl}/campaigns/${campaignId}`, body, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200 || response.status === 201 || response.status === 204) {
            console.log(response.data + ' ' + response.status);
            return response.data;
        }

        throw new Error(`Request failed with status code: ${response.status}, Response: ${response.data}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error editing campaign: ${errorMessage}`);
        throw error;
    }
}