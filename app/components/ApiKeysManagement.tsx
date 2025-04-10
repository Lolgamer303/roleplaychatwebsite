"use client";

import { createApikey } from "@/action/route";
import { useState } from "react";
import ApiKeysList from "./ApiKeysList";

export default function ApiKeysManagement({ apiKeys }: { apiKeys: { key: string; name: string }[] | null }) {
  const [NewApiKeyName, setNewApiKeyName] = useState("");

  async function handleCreateKey() {
    const formdata: FormData = new FormData();
    formdata.append("name", NewApiKeyName);
    try {
      await createApikey(formdata);
    } finally {
      setNewApiKeyName("");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-custom-background-primary shadow-md rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-custom-text-primary">
        API Key Management
      </h1>
      <p className="text-custom-text-secondary mb-8">
        Manage your API keys below. You can create new keys or delete existing
        ones.
      </p>
      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={NewApiKeyName}
          onChange={(e) => setNewApiKeyName(e.target.value)}
          placeholder="Enter new API key name"
          className="flex-1 bg-custom-background-secondary text-custom-text-primary border border-custom-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-custom-text-primary"
        />
        <button
          onClick={handleCreateKey}
          disabled={NewApiKeyName == ""}
          className="bg-custom-text-primary cursor-pointer text-custom-background-secondary px-6 py-3 rounded-md hover:bg-custom-hover transition"
        >
          Create Key
        </button>
      </div>
      <div className="bg-custom-background-secondary border border-custom-border rounded-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-custom-text-primary">
          Your API Keys
        </h2>
        <ApiKeysList apiKeys={apiKeys}/>
      </div>
    </div>
  );
}
