import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import ChatFeed from "./components/ChatFeed";
import DocumentDrawer from "./components/DocumentDrawer";
import UploadModal from "./components/UploadModal";
import ChunkInspectorModal from "./components/ChunkInspectorModal";
import { checkHealth, fetchDocuments, queryRAG } from "./api";
import { playSendSound } from "./utils";

let messageIdCounter = 0;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Document stats
  const [dbStatus, setDbStatus] = useState("ChromaDB Connecting...");
  const [chunksCount, setChunksCount] = useState(0);
  const [docsCount, setDocsCount] = useState(0);
  const [documents, setDocuments] = useState([]);

  // UI toggles
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [inspectorChunks, setInspectorChunks] = useState([]);

  const refreshStats = useCallback(async () => {
    try {
      const [healthData, docData] = await Promise.all([
        checkHealth(),
        fetchDocuments(),
      ]);

      if (healthData.status === "ok") {
        setDbStatus(
          `ChromaDB Active (${healthData.stats.total_chunks} chunks)`
        );
      }
      setChunksCount(docData.total_chunks || 0);
      setDocsCount(docData.document_count || 0);
      setDocuments(docData.documents || []);
    } catch {
      setDbStatus("ChromaDB Connecting...");
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const handleSubmit = async (query) => {
    // Play send sound effect
    playSendSound(isMuted);

    setShowWelcome(false);

    // Add user message
    const userMsg = {
      id: `msg-${++messageIdCounter}`,
      role: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await queryRAG(query, 5);

      const aiMsg = {
        id: `msg-${++messageIdCounter}`,
        role: "ai",
        text: data.answer,
        citations: data.citations,
        chunks: data.retrieved_chunks,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = {
        id: `msg-${++messageIdCounter}`,
        role: "ai",
        text: "Sorry, unable to connect to the backend server. Please make sure `app.py` is running on port 8000.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetQuery = (query) => {
    handleSubmit(query);
  };

  const handleInspectChunks = (chunks) => {
    setInspectorChunks(chunks || []);
    setShowInspector(true);
  };

  const handleUploadComplete = (data, fileCount) => {
    const uploadCount = data.uploaded.reduce(
      (acc, f) => acc + f.chunks_added,
      0
    );
    const notifMsg = {
      id: `msg-${++messageIdCounter}`,
      role: "ai",
      text: `Successfully ingested ${fileCount} file(s) (${uploadCount} chunks) into ChromaDB vector database.`,
    };
    setMessages((prev) => [...prev, notifMsg]);
    refreshStats();
  };

  return (
    <div className="text-on-background h-screen flex flex-col overflow-hidden font-['Source_Serif_4'] relative bg-surface">
      {/* Background Classical Artwork & Glass Overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCo_ZwQsGRlarktAEFOr5EQfzPJ1_hBygrK0EjBlIxCAI5CXw0Bk2-K3f_EdUNEPc5LPDJVrj1GQ55qSP_8BzqAQVO2jORjjtJv0dQjWWCIUMEgURxeK8RZbyYc2JgUKGiRm_-2VK0tY-M2ywnSJv-oXhoxpbaR_rynqidqs4TvphD8665StQnirM3B1zk3fnU82y6oNHrZ6g0yo0hlwOahUpEV1ORp7Xt9mklnf7MYoBndRlZvdVmnAaLmAQxoc0a8zI")',
        }}
      />
      <div className="absolute inset-0 z-0 bg-surface/40 pointer-events-none" />
      <div className="absolute inset-0 texture-overlay z-0 pointer-events-none" />

      {/* Main Header */}
      <Header
        dbStatus={dbStatus}
        chunksCount={chunksCount}
        docsCount={docsCount}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onToggleDrawer={() => setShowDrawer((prev) => !prev)}
        onOpenUpload={() => setShowUploadModal(true)}
      />

      {/* App Workspace */}
      <div className="flex-1 flex min-h-0 relative z-10">
        <ChatFeed
          messages={messages}
          isLoading={isLoading}
          showWelcome={showWelcome}
          onSetQuery={handleSetQuery}
          onSubmit={handleSubmit}
          onInspectChunks={handleInspectChunks}
        />

        {showDrawer && (
          <DocumentDrawer
            documents={documents}
            onRefresh={refreshStats}
          />
        )}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {showInspector && (
        <ChunkInspectorModal
          chunks={inspectorChunks}
          onClose={() => setShowInspector(false)}
        />
      )}
    </div>
  );
}


