"use client";

import { getMessages, sendMessage, deleteMessage } from "@/action/route"; // Import deleteMessage
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface message {
    id: string;
    message: string;
    response?: string; // Response can be undefined initially
    createdAt: string;
}

export default function Chatting(campaignId: { campaignId: string }) {
    const [messages, setMessages] = useState<message[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state for sending messages
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the bottom

    useEffect(() => {
        loadMessages();
    }, []); // Reload messages only on component mount

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom whenever messages change
    }, [messages]);

    function loadMessages() {
        const form = new FormData();
        form.append("campaignId", campaignId.campaignId);

        getMessages(form)
            .then((response) => {
                if (Array.isArray(response)) {
                    setMessages(response as message[]);
                } else if (response && Array.isArray(response.messages)) {
                    setMessages(response.messages as message[]);
                } else if (response == "") {
                    setMessages([]);
                } else {
                    console.error("Unexpected response format: ", response);
                }
            })
            .catch((error) => {
                console.error("Error fetching messages: ", error);
            });
    }

    const handleSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        const messageInput = (
            event.target as HTMLFormElement
        ).message.value.trim();
        if (messageInput) {
            const newMessage: message = {
                id: `temp-${Date.now()}`, // Temporary ID
                message: messageInput,
                response: undefined, // Response will be added later
                createdAt: new Date().toISOString(),
            };

            // Add the user's message immediately
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Reset the input field
            (event.target as HTMLFormElement).reset();

            setIsLoading(true); // Show loading indicator

            try {
                const form = new FormData();
                form.append("campaignId", campaignId.campaignId);
                form.append("message", messageInput);

                const response = await sendMessage(form);

                // Update the message with the AI's response
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === newMessage.id
                            ? { ...msg, response: response.response }
                            : msg
                    )
                );
            } catch (error) {
                console.error("Error sending message: ", error);
            } finally {
                setIsLoading(false); // Hide loading indicator
            }
        }
    };

    const handleDeleteLastMessage = async () => {
        if (messages.length === 0) return; // No messages to delete

        try {
            const form = new FormData();
            form.append("messageCount", "1"); // Always delete the last message
            form.append("campaignId", campaignId.campaignId);
            await deleteMessage(form); // Call the server action to delete the message

            // Remove the last message from the state
            setMessages((prevMessages) => prevMessages.slice(0, -1));
        } catch (error) {
            console.error("Error deleting the last message: ", error);
        }
    };

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className='w-full h-screen flex flex-col bg-custom-background-primary'>
            {/* Messages */}
            <div className='flex-grow overflow-y-auto p-4'>
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className='max-w-4xl mx-auto px-4 my-18 mb-28' // Added my-6 for top and bottom margin
                    >
                        {/* User Message */}
                        <div className='flex items-center mb-2'>
                            <div className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-2'>
                                👤
                            </div>
                            <div className='bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[70%]'>
                                <ReactMarkdown>{message.message}</ReactMarkdown>
                            </div>
                        </div>
                        {/* AI Response */}
                        {message.response !== undefined ? (
                            <div className='flex items-center justify-end relative'>
                                {index === messages.length - 1 && ( // Show the delete button only for the last message
                                    <button
                                        onClick={handleDeleteLastMessage}
                                        className='absolute top-0 left-0 text-red-500 hover:text-red-700'
                                        aria-label='Delete last message'
                                    >
                                        ✖
                                    </button>
                                )}
                                <div className='bg-green-100 text-green-900 p-3 rounded-lg max-w-[70%]'>
                                    <ReactMarkdown>{message.response}</ReactMarkdown>
                                </div>
                                <div className='w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full ml-2'>
                                    🤖
                                </div>
                            </div>
                        ) : (
                            <div className='flex items-center justify-end'>
                                <div className='text-gray-500 italic'>Loading...</div>
                            </div>
                        )}
                    </div>
                ))}
                {/* Scroll to bottom reference */}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSendMessage}
                className='absolute bottom-7 left-[20%] w-[60vw] h-18 bg-custom-background-primary border-2 rounded-2xl border-custom-border flex items-center px-4'
            >
                <input
                    type='text'
                    name='message'
                    placeholder='Type your message...'
                    className='flex-grow bg-transparent outline-none text-custom-text-primary placeholder-gray-400'
                    autoComplete='off'
                />
                <button
                    type='submit'
                    className='ml-4 text-custom-text-primary hover:text-gray-300'
                    aria-label='Send message'
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? (
                        <svg
                            className='animate-spin h-6 w-6 text-gray-400'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8v8H4z'
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2}
                            stroke='currentColor'
                            className='w-6 h-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M22 2L11 13'
                            />
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M22 2L15 22L11 13L2 9L22 2Z'
                            />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
