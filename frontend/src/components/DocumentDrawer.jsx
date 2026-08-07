import { useState } from "react";
import { ingestKaggle as ingestKaggleAPI, deleteDocument } from "../api";

export default function DocumentDrawer({
  documents,
  onRefresh,
}) {
  const [ingesting, setIngesting] = useState(false);

  const handleIngestKaggle = async () => {
    setIngesting(true);
    try {
      const data = await ingestKaggleAPI();
      if (data.status === "success") {
        alert("Bank Customer Dataset successfully ingested into ChromaDB!");
        onRefresh();
      } else {
        alert("Error: " + (data.detail || "Unknown error"));
      }
    } catch {
      alert(
        "Kaggle dataset ingestion triggered or dataset already available."
      );
    } finally {
      setIngesting(false);
    }
  };

  const handleDeleteDoc = async (filename) => {
    if (!confirm(`Delete ${filename} from ChromaDB?`)) return;
    try {
      await deleteDocument(filename);
      onRefresh();
    } catch {
      alert("Error deleting file");
    }
  };

  return (
    <aside className="w-80 bg-surface-container/95 border-l border-outline-variant/60 p-4 flex flex-col gap-4 shrink-0 z-30 font-['Source_Serif_4'] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
        <h3 className="font-['Bodoni_Moda'] font-semibold text-base text-primary flex items-center gap-2 tracking-wide">
          <span className="material-symbols-outlined text-xl">
            menu_book
          </span>
          <span>Indexed Archives</span>
        </h3>
        <button
          onClick={onRefresh}
          className="text-on-surface-variant hover:text-primary p-1 rounded-full text-xs transition-colors cursor-pointer"
          aria-label="Refresh documents"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
        </button>
      </div>

      {/* Ingest Kaggle Bank Dataset Card */}
      <div className="bg-surface-variant/80 p-3.5 rounded-sm border border-primary-container/40 shadow-xs relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-secondary text-lg">
            account_balance
          </span>
          <span className="font-semibold text-xs text-primary font-['Source_Serif_4']">
            Bank Customer Dataset
          </span>
        </div>
        <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
          Load{" "}
          <code className="text-[10px] bg-surface-container px-1 py-0.5 rounded border border-outline-variant/30">
            garimam/bank-customer-dataset
          </code>{" "}
          into ChromaDB.
        </p>
        <button
          onClick={handleIngestKaggle}
          disabled={ingesting}
          className="w-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs font-semibold py-1.5 rounded-sm transition-all flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
        >
          {ingesting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
              Ingesting...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Ingest Bank Dataset
            </>
          )}
        </button>
      </div>

      {/* File List Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-['Bodoni_Moda']">
          Indexed Documents
        </div>
        {documents && documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc}
              className="bg-surface/80 p-2.5 rounded-sm border border-outline-variant/40 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined text-secondary text-base">
                  description
                </span>
                <span className="truncate font-medium text-primary text-xs">
                  {doc}
                </span>
              </div>
              <button
                onClick={() => handleDeleteDoc(doc)}
                className="text-on-surface-variant/50 hover:text-error p-1 transition-colors cursor-pointer"
                aria-label={`Delete ${doc}`}
              >
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-on-surface-variant italic py-4 text-center text-xs">
            No documents uploaded yet
          </div>
        )}
      </div>
    </aside>
  );
}

