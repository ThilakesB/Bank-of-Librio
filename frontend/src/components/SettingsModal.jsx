import { useState, useEffect } from "react";

export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [activeTab, setActiveTab] = useState("gemini");
  const [saved, setSaved] = useState(false);

  // Load keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("gemini_api_key") || "";
    setGeminiKey(stored);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", geminiKey);
    setSaved(true);
    onSave(geminiKey);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant/30">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">settings</span>
            <h2 className="text-lg font-bold text-primary">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30">
          <button
            onClick={() => setActiveTab("gemini")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "gemini"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Gemini API
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "about"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {activeTab === "gemini" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API key (e.g., AIza...)"
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  Get your free API key from{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div className="bg-secondary-container/30 border border-secondary-container/50 rounded-lg p-3">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-semibold text-primary">💡 Tip:</span> Adding your Gemini API key enables AI-powered response synthesis. Your key is stored locally in your browser and never sent to our servers.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  {saved ? "check_circle" : "save"}
                </span>
                {saved ? "Saved!" : "Save API Key"}
              </button>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div>
                <h3 className="font-semibold text-primary mb-1">Oracle of Librio</h3>
                <p className="text-xs">
                  An intelligent RAG (Retrieval-Augmented Generation) system for banking document analysis.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">How It Works</h3>
                <p className="text-xs">
                  1. Upload documents (CSV, XLSX, PDF, etc.)
                  <br />
                  2. System indexes them into ChromaDB vector database
                  <br />
                  3. Ask questions and get AI-synthesized answers with citations
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Privacy</h3>
                <p className="text-xs">
                  Your documents and API keys are stored locally. No data is sent to external servers unless you enable LLM synthesis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
