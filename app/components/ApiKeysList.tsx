"use client";

import { useState } from "react";
import { deleteApikey } from "@/action/route";

export default function ApiKeysList({
  apiKeys,
}: {
  apiKeys: { key: string; name: string }[] | null;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function handleDeleteKey(key: string) {
    const formdata: FormData = new FormData();
    formdata.append("key", key);
    deleteApikey(formdata);
  }

  function handleCopyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000); // Tooltip disappears after 2 seconds
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
          className="flex items-center justify-end bg-custom-background-primary p-3 rounded-md shadow-sm relative"
        >
          <span className="text-custom-text-primary w-full overflow-hidden whitespace-nowrap">
            {apiKey.name}
          </span>
          <button
            className="text-custom-text-secondary cursor-pointer ml-4 whitespace-nowrap active:scale-110 opacity-70 mr-4 hover:opacity-95 transition"
            onClick={() => handleCopyKey(apiKey.key)}
          >
            Copy Key
          </button>
          {copiedKey === apiKey.key && (
            <span className="absolute top-[-4px] right-21 mt-[-1.5rem] bg-black text-white text-xs rounded px-2 py-1">
              Copied!
            </span>
          )}
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
