"use client";
import { getCampaigns } from "@/roleplaychatAPI";
import { useState } from "react";
import { getServerCampaigns } from "@/action/route";

export default function Chat() {
    function handleClick() {
        const formdata: FormData = new FormData();
        formdata.append('userId', '1');
        const campaigns = getServerCampaigns(formdata);
        console.log("Campaigns:", campaigns);
    }

    return (
    <div className="max-w-3xl mx-auto p-6 bg-custom-background-primary shadow-md rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-custom-text-primary">
        Choose your Campaign
      </h1>
    <p className="text-custom-text-secondary mb-8">
      Select one of your available campaigns below to begin an immersive storytelling experience. 
    </p>
      <div className="bg-custom-background-secondary border border-custom-border rounded-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-custom-text-primary">
          Your Campaigns
        </h2>
        <button className="cursor-pointer bg-custom-background-primary size-10 rounded-2xl"
                onClick={(i) => {handleClick()}}>
            getcampaigns
        </button>
      </div>
    </div>
    );
}