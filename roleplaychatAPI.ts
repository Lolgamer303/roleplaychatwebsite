'use server';
import axios from "axios";
import 'dotenv/config'

export async function getCampaigns(userId: string) {
    const url = process.env.API_URL;
    if (!url) {
        throw new Error("No API_URL provided in environment variables.");
    }

    const token = process.env.API_PRODUCTION_KEY;
    if (!token) {
        throw new Error("No API_KEY provided in environment variables.");
    }

    try {
        const response = await axios.get(url + '/campaigns', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error(`Request failed with status code: ${response.status} + ${response.data}`);
        }
    } catch (error: any) {
        console.error(`Error fetching campaigns: ${error.message}`);
        throw error;
    }
}