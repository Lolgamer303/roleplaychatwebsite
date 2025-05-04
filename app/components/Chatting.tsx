'use client';

export default function Chatting(campaignId: { campaignId: string }) {
    function loadMessages() {
        const form = new FormData();
        form.append("campaignId", campaignId.campaignId);

        getMessages(form)
    }

    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        const messageInput = (event.target as HTMLFormElement).message.value.trim();
        if (messageInput) {
            console.log("Message sent:", messageInput);
            // Add logic to handle sending the message
            (event.target as HTMLFormElement).reset(); // Clear the input field after sending
        }
    };

    return (
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
            >
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
            </button>
        </form>
    );
}