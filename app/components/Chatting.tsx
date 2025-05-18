"use client";

import { getMessages, sendMessage, deleteMessage } from "@/action/route";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface message {
    id: string;
    message: string;
    response?: string;
    createdAt: string;
}

export default function Chatting(campaignId: { campaignId: string }) {
    const [messages, setMessages] = useState<message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef(null); // Reference to the scrollable container

    const isNearBottom = () => {
        if (!messagesContainerRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 50; // Threshold of 50px
    };

    useEffect(() => {
        loadMessages();
    }, [campaignId.campaignId]);

    useEffect(() => {
        if (!isNearBottom()) return;    
        scrollToBottom();
        console.log(messages);
    }, [messages]); // Only scroll when messages change

    async function loadMessages() {
        setIsLoading(true);

        const form = new FormData();
        form.append("campaignId", campaignId.campaignId);
        try {
            let response = await getMessages(form);
            if (Array.isArray(response)) {
                response = response.slice(1);
                console.log(response);
                setMessages(response as message[]);
            } else {
                console.error("Unexpected response format: ", response);
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    }

    const handleSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        const messageInput = (
            event.target as HTMLFormElement
        ).message.value.trim();
        if (messageInput) {
            const newMessage: message = {
                id: `temp-${Date.now()}`,
                message: messageInput,
                response: undefined,
                createdAt: new Date().toISOString(),
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            (event.target as HTMLFormElement).reset();
            setIsLoading(true);
            scrollToBottom();

            try {
                const form = new FormData();
                form.append("campaignId", campaignId.campaignId);
                form.append("message", messageInput);

                const response = await sendMessage(form);

                // Optionally update the temporary message with the response
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === newMessage.id
                            ? { ...msg, response: response.response }
                            : msg
                    )
                );

                // Fetch the latest messages
                await loadMessages();
            } catch (error) {
                console.error("Error sending message: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteLastMessage = async () => {
        if (messages.length <= 1) {
            return;
        }
        if (!messages[messages.length - 1].response) {
            setMessages((prevMessages) => prevMessages.slice(0, -1));
            return;
        }

        try {
            const form = new FormData();
            form.append("messageCount", "1");
            form.append("campaignId", campaignId.campaignId);
            await deleteMessage(form);

            // Correctly remove the last message from the state
            setMessages((prevMessages) => prevMessages.slice(0, -1));
        } catch (error) {
            console.error("Error deleting the last message: ", error);
        }
    };

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="w-full h-screen flex flex-col bg-custom-background-primary">
            {/* Messages */}
            <div
                className="flex-grow overflow-y-auto p-4"
                ref={messagesContainerRef}
            >
                {/* Context Message */}
                {messages.length > 0 && (
                    <div className="max-w-4xl mx-auto px-4 my-18 mb-28">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full mr-2">
                                📜
                            </div>
                            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg max-w-[70%]">
                                <ReactMarkdown>
                                    {messages[0].response ?? ""}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {/* User and AI Messages */}
                {messages.map((message, index) =>
                    index === 0 ? null : (
                        <div
                            key={message.id || `fallback-key-${index}`}
                            className="max-w-4xl mx-auto px-4 my-18 mb-28 relative"
                        >
                            {/* User Message */}
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 flex items-center justify-center bg-custom-accent-primary text-white rounded-full mr-2">
                                    👤
                                </div>
                                <div className="bg-custom-accent-tertiary text-custom-text-primary p-3 rounded-lg max-w-[70%]">
                                    <ReactMarkdown>
                                        {message.message}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            {/* AI Response */}
                            {message.response !== undefined ? (
                                <div className="flex items-center justify-end relative">
                                    <div className="bg-custom-accent-secondary text-custom-text-primary p-3 rounded-lg max-w-[70%]">
                                        <ReactMarkdown>
                                            {message.response}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center bg-custom-accent-quartiary text-white rounded-full ml-2">
                                        🤖
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-end">
                                    <div className="text-gray-500 italic">
                                        Loading...
                                    </div>
                                </div>
                            )}
                            {/* Show delete button for the last AI response */}
                            {index === messages.length - 1 && (
                                <button
                                    onClick={handleDeleteLastMessage}
                                    className="cursor-pointer absolute top-0 right-0 text-red-500 hover:text-red-700"
                                    aria-label="Delete last message"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    )
                )}
                {/* Scroll to bottom reference */}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSendMessage}
                className="absolute bottom-7 left-[20%] w-[60vw] h-18 bg-custom-background-primary border-2 rounded-2xl border-custom-border flex items-center px-4"
            >
                <input
                    type="text"
                    name="message"
                    placeholder="Type your message..."
                    className="flex-grow bg-transparent outline-none text-custom-text-primary placeholder-gray-400"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="ml-4 text-custom-text-primary hover:text-gray-300"
                    aria-label="Send message"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg
                            className="animate-spin h-6 w-6 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M22 2L11 13"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M22 2L15 22L11 13L2 9L22 2Z"
                            />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
