import { escapeHtml, formatMarkdown } from "../utils";

export default function AIMessage({ text, citations, chunks, onInspectChunks }) {
  return (
    <div className="flex w-full justify-start message-entrance">
      <div className="backdrop-blur-md border border-primary-container shadow-sm p-5 md:p-6 max-w-[90%] md:max-w-[85%] relative bg-surface-container/90 rounded-sm font-['Source_Serif_4']">
        {/* Left scroll edge accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-sm" />

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-variant border border-primary flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>

          <div className="pt-0.5 flex-1 min-w-0">
            <div
              className="text-on-surface text-sm md:text-base leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(text) }}
            />

            {citations && citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-base text-secondary">
                    menu_book
                  </span>
                  <span>
                    Sources:{" "}
                    <strong className="text-primary font-semibold">
                      {citations
                        .map(
                          (c) =>
                            `${escapeHtml(c.source)} (${escapeHtml(c.file_type)})`
                        )
                        .join(", ")}
                    </strong>
                  </span>
                </div>

                <button
                  onClick={() => onInspectChunks(chunks)}
                  className="text-xs text-primary font-semibold hover:text-primary-container flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Inspect Chunks</span>
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

