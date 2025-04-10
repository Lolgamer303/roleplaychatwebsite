"use client";

import { deleteApikey } from "@/action/route";

export default function ApiKeysList({
  apiKeys,
}: {
  apiKeys: { key: string; name: string }[] | null;
}) {
  function handleDeleteKey(key: string) {
    const formdata: FormData = new FormData();
    formdata.append("key", key);
    deleteApikey(formdata);
  }

  return (
    <ul className="space-y-3">
      {apiKeys && apiKeys.length === 0 && (
        <li className="text-custom-text-secondary">
          No API keys. Please create one.
        </li>
      )}
      {apiKeys?.map((apiKey) => (
        <li
          key={apiKey.key}
          className="flex items-center justify-end bg-custom-background-primary p-3 rounded-md shadow-sm"
        >
          <span className="text-custom-text-primary w-full overflow-hidden whitespace-nowrap">{apiKey.name}</span>
          <button
            className="text-custom-text-secondary cursor-pointer ml-4 whitespace-nowrap opacity-70 mr-4 hover:opacity-95 transition"
            onClick={() => {
              navigator.clipboard.writeText(apiKey.key);
              alert("API key copied to clipboard");
            }}
          >
            Copy Key
          </button>
          <button
            onClick={() => handleDeleteKey(apiKey.key)}
            className="text-red-500 hover:text-red-300 cursor-pointer transition"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
