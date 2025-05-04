import Chatting from "@/app/components/Chatting";
import Header from "@/app/components/Header";

export default function Page({ params }: { params: { campaignId: string } }) {
    const campaignId = params.campaignId;

    return (
        <>
            <Header pathname='/chat' />
            <Chatting campaignId={campaignId} />
        </>
    );
}