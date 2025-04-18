"use client";

import { useState } from "react";
import { deleteApikey } from "@/action/route";

export default function ApiKeysList({
  apiKeys,
}: {
  apiKeys: { key: string; name: string }[] | null;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null); // Track the key being considered for deletion

  function handleDeleteKey(key: string) {
    const formdata: FormData = new FormData();
    formdata.append("key", key);
    deleteApikey(formdata);
    setKeyToDelete(null); // Reset the keyToDelete state
  }

  function handleCopyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000); // Tooltip disappears after 2 seconds
  }

  return (
    <div>
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
              onClick={() => setKeyToDelete(apiKey.key)} // Set the key to delete
              className="text-red-500 hover:text-red-300 cursor-pointer transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Confirmation Dialog */}
      {keyToDelete && (

        <div className="fixed inset-0 bg-custom-background-secondary bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-background-primary p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-bold text-red-500">
              Are you sure you want to delete this API key?
            </h2>
            <p className="text-sm text-custom-text-primary mt-2">
              Deleting this key will also <span className="underline"> delete its <span className="text-red-600"> associated campaigns </span>
              permanently</span>. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => handleDeleteKey(keyToDelete)} // Confirm deletion
                className="bg-red-500 text-custom-text-primary px-4 py-2 rounded hover:bg-red-400 transition cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setKeyToDelete(null)} // Cancel deletion
                className="bg-custom-background-secondary text-custom-text-primary px-4 py-2 rounded hover:bg-custom-hover transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
