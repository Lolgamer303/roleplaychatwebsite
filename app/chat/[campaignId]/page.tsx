import Chatting from "@/app/components/Chatting";
import Header from "@/app/components/Header";

export default async function Page({ params }: { params: { campaignId: string } }) {
    const campaignId = params?.campaignId; // Safely access params

    if (!campaignId) {
        throw new Error("Campaign ID is missing"); // Handle missing campaignId
    }

    return (
        <>
            <Header pathname='/chat' />
            <Chatting campaignId={campaignId} />
        </>
    );
}