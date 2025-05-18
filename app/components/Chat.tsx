"use client";
import { createServerCampaign, getServerCampaigns, editServerCampaign, deleteServerCampaign } from "@/action/route";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Campaign {
    id: string;
    name: string;
}

export default function Chat() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [newCampaignName, setNewCampaignName] = useState<string>("");
    const [isReloading, setIsReloading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
    const [editedCampaignName, setEditedCampaignName] = useState<string>("");

    useEffect(() => {
        fetchCampaigns();
    }, []);

    function fetchCampaigns() {
        setIsReloading(true); // Start animation
        getServerCampaigns()
            .then((response) => {
                if (Array.isArray(response)) {
                    setCampaigns(response as Campaign[]);
                } else if (response && Array.isArray(response.campaigns)) {
                    setCampaigns(response.campaigns as Campaign[]);
                } else if (response == '') {
                    setCampaigns([]);
                } else {
                    console.error("Unexpected response format: ", response);
                }
                setIsReloading(false); // Stop animation
            })
            .catch((error) => {
                console.error("Error fetching campaigns: ", error);
                setIsReloading(false); // Stop animation
            });
    }

    function createCampaign() {
        if (!newCampaignName.trim()) {
            console.error("Campaign name cannot be empty");
            return; // Prevent submission if the name is empty
        }
        setIsCreating(true); 

        const formdata: FormData = new FormData();
        formdata.append("name", newCampaignName);
        formdata.append("book", "test book");
        setNewCampaignName(""); // Clear the input field

        createServerCampaign(formdata)
            .then(() => {
                console.log("Campaign created successfully");
                fetchCampaigns(); // Reload campaigns after creation
                setIsCreating(false);
            })  
            .catch((error) => {
                console.error("Error creating campaign: ", error);
            });
        
    }

    function deleteCampaign(campaignId: string) {
        const formdata: FormData = new FormData();
        formdata.append("campaignId", campaignId);

        deleteServerCampaign(formdata)
            .then(() => {
                console.log("Campaign deleted successfully");
                fetchCampaigns(); // Reload campaigns after deletion
            })
            .catch((error) => {
                console.error("Error deleting campaign: ", error);
            });
    }

    function startEditingCampaign(campaignId: string, currentName: string) {
        if (editingCampaignId === null) {
            setEditingCampaignId(campaignId);
            setEditedCampaignName(currentName);
        }
        else {
            setEditingCampaignId(null);
            setEditedCampaignName("");
        }
    }

    function saveEditedCampaign() {
        if (!editedCampaignName.trim()) {
            console.error("Campaign name cannot be empty");
            return;
        }

        const formdata: FormData = new FormData();
        formdata.append("campaignId", editingCampaignId!);
        formdata.append("name", editedCampaignName);

        editServerCampaign(formdata)
            .then(() => {
                console.log("Campaign updated successfully");
                setEditingCampaignId(null);
                setEditedCampaignName("");
                fetchCampaigns(); // Reload campaigns after editing
            })
            .catch((error) => {
                console.error("Error editing campaign: ", error);
            });
    }

    return (
        <div className='max-w-3xl mx-auto p-6 bg-custom-background-primary shadow-md rounded-lg'>
            <h1 className='text-4xl font-bold mb-4 text-custom-text-primary'>
                Choose your Campaign
            </h1>
            <p className='text-custom-text-secondary mb-8'>
                Select one of your available campaigns below to begin an
                immersive storytelling experience.
            </p>
            <div className='bg-custom-background-secondary border border-custom-border rounded-md p-4 relative'>
                <button
                    className={`cursor-pointer size-10 rounded-2xl mb-4 flex items-center justify-center absolute top-2 right-2 ${
                        isReloading || isCreating ? "animate-reload-spin" : ""
                    }`}
                    onClick={fetchCampaigns}
                    aria-label='Reload Campaigns'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='icon icon-tabler icons-tabler-outline icon-tabler-reload'
                    >
                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                        <path d='M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747' />
                        <path d='M20 4v5h-5' />
                    </svg>
                </button>
                <h2 className='text-2xl font-semibold mb-4 text-custom-text-primary'>
                    Your Campaigns
                </h2>
                <div className=''>
                    <ul className='space-y-4'>
                        {campaigns.length > 0 ? (
                            campaigns.map((campaign) => (
                                <li
                                    key={campaign.id}
                                    className='flex items-center justify-between bg-custom-background-primary border border-custom-border rounded-md p-4 shadow-sm'
                                >
                                    {editingCampaignId === campaign.id ? (
                                        <div className='flex-1 flex items-center space-x-4'>
                                            <input
                                                type='text'
                                                value={editedCampaignName}
                                                onChange={(e) => setEditedCampaignName(e.target.value)}
                                                className='flex-1 border border-custom-border rounded-md overflow-x-auto p-2 text-custom-text-primary bg-custom-background-secondary focus:outline-none focus:ring-2 focus:ring-custom-accent'
                                            />
                                            <button
                                                className='px-3 py-1 bg-custom-accent text-custom-text-primary rounded-md'
                                                onClick={saveEditedCampaign}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='flex-1 flex overflow-x-auto items-center space-x-4'>
                                            <Link
                                                href={`/chat/${campaign.id}`}
                                                className='text-custom-text-primary font-medium flex-1 truncate'
                                            >
                                                {campaign.name}
                                            </Link>
                                        </div>
                                    )}
                                    <div className='flex items-center space-x-4'>
                                        {/* Pencil Icon (Edit) */}
                                        <button
                                            className='text-custom-text-primary hover:text-custom-accent cursor-pointer'
                                            onClick={() => startEditingCampaign(campaign.id, campaign.name)}
                                            aria-label='Edit Campaign'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='24'
                                                height='24'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='icon icon-tabler icon-tabler-pencil'
                                            >
                                                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                                <path d='M15 4l4 4l-11 11h-4v-4z' />
                                                <path d='M13 6l4 4' />
                                            </svg>
                                        </button>
                                        {/* Bin Icon (Delete) */}
                                        <button
                                            className='text-custom-text-primary hover:text-custom-accent cursor-pointer'
                                            onClick={() => deleteCampaign(campaign.id)}
                                            aria-label='Delete Campaign'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='24'
                                                height='24'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='icon icon-tabler icon-tabler-trash-2'
                                            >
                                                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                                <path d='M3 6h18' />
                                                <path d='M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-14' />
                                                <path d='M9 10v6' />
                                                <path d='M15 10v6' />
                                                <path d='M10 6l1 -2h2l1 2' />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className='text-custom-text-secondary'>No campaigns available.</p>
                        )}
                    </ul>
                </div>
                <div className='mt-6 bg-custom-background-primary p-4 rounded-md shadow-md'>
                    <h3 className='text-lg font-semibold text-custom-text-primary mb-2'>
                        Create a New Campaign
                    </h3>
                    <div className='flex items-center space-x-4'>
                        <input
                            type='text'
                            value={newCampaignName}
                            onChange={(e) => setNewCampaignName(e.target.value)}
                            placeholder='Enter campaign name'
                            className='flex-1 border border-custom-border rounded-md p-2 text-custom-text-primary bg-custom-background-secondary focus:outline-none focus:ring-2 focus:ring-custom-accent'
                        />
                        <button
                            className='px-4 py-2 bg-custom-accent border active:scale-90 border-custom-border cursor-pointer text-custom-text-primary font-semibold rounded-md hover:bg-custom-accent-hover transition duration-300'
                            onClick={createCampaign}
                            disabled={isCreating}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
