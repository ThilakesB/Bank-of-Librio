import { escapeHtml } from "../utils";

export default function ChunkInspectorModal({ chunks, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4 font-['Source_Serif_4']"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container/95 rounded-sm max-w-2xl w-full p-6 max-h-[85vh] flex flex-col gap-4 shadow-lg border border-primary-container/80 relative">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <h3 className="font-['Bodoni_Moda'] font-semibold text-lg text-primary flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-xl">
              manage_search
            </span>
            <span>Retrieved ChromaDB Vector Chunks</span>
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 text-xs scrollbar-hide">
          {!chunks || chunks.length === 0 ? (
            <p className="text-on-surface-variant italic">
              No raw chunks available.
            </p>
          ) : (
            chunks.map((c, i) => (
              <div
                key={i}
                className="bg-surface-variant/70 p-3.5 rounded-sm border border-outline-variant/40 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>
                    Chunk #{i + 1} —{" "}
                    {escapeHtml(
                      c.metadata?.source ||
                        c.metadata?.filename ||
                        "Unknown"
                    )}
                  </span>
                  <span className="bg-primary text-on-primary px-2 py-0.5 rounded-xs text-[10px] uppercase font-['Bodoni_Moda'] tracking-wider">
                    Similarity: {(c.similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-on-surface bg-surface/90 p-3 rounded-xs border border-outline-variant/30 max-h-44 overflow-y-auto leading-relaxed">
                  {escapeHtml(c.content)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

