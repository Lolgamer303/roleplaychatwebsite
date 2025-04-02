import Header from "../components/Header";

export default function ApiKeysPage() {
  return (
    <div className="flex items-center justify-center h-[100vh] flex-col bg-custom-background-secondary">
      <Header pathname="/keys" />
      <div className="max-w-3xl mx-auto p-6 bg-custom-background-primary shadow-md rounded-lg">
        <h1 className="text-4xl font-bold mb-4 text-custom-text-primary">API Key Management</h1>
        <p className="text-custom-text-secondary mb-8">
          Manage your API keys below. You can create new keys or delete existing ones.
        </p>
        <div className="flex items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter new API key"
            className="flex-1 bg-custom-background-secondary text-custom-text-primary border border-custom-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent-primary"
          />
          <button
            className="bg-custom-accent-primary text-custom-text-secondary px-6 py-3 rounded-md hover:bg-custom-hover transition"
          >
            Create Key
          </button>
        </div>
        <div className="bg-custom-background-secondary border border-custom-border rounded-md p-4">
          <h2 className="text-2xl font-semibold mb-4 text-custom-text-primary">Your API Keys</h2>
          <ul className="space-y-3">
            {/* Placeholder for API keys */}
            <li className="flex items-center justify-between bg-custom-background-primary p-3 rounded-md shadow-sm">
              <span className="text-custom-text-primary">1234-5678-ABCD-EFGH</span>
              <button className="text-custom-accent-primary hover:text-custom-hover transition">
                Delete
              </button>
            </li>
            <li className="flex items-center justify-between bg-custom-background-primary p-3 rounded-md shadow-sm">
              <span className="text-custom-text-primary">9876-5432-ZYXW-VUTS</span>
              <button className="text-custom-accent-primary hover:text-custom-hover transition">
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}