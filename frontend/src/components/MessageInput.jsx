import { useRef, useCallback } from "react";

export default function MessageInput({ onSubmit }) {
  const textareaRef = useRef(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const el = textareaRef.current;
    const query = el.value.trim();
    if (!query) return;
    onSubmit(query);
    el.value = "";
    el.style.height = "auto";
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface/95 to-transparent pt-10 pb-5 px-4 md:px-8 z-20">
      <div className="max-w-3xl mx-auto relative">
        <form
          onSubmit={handleSubmit}
          className="relative backdrop-blur-md border border-primary-container shadow-[0_4px_20px_rgba(184,177,164,0.18)] flex items-center px-4 py-2.5 rounded-sm bg-surface-container/90 transition-all focus-within:border-primary"
        >
          {/* Left scroll edge accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-sm" />

          <textarea
            ref={textareaRef}
            rows={1}
            onKeyDown={handleKeyDown}
            onInput={autoResize}
            placeholder="Ask the Oracle of Libreo..."
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[40px] py-1.5 px-2 text-sm md:text-base text-on-surface placeholder-on-surface-variant/70 caret-primary font-['Source_Serif_4'] scrollbar-hide"
          />

          <button
            type="submit"
            aria-label="Send message"
            className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ml-2 shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              auto_awesome
            </span>
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-[11px] text-on-surface-variant/70 font-['Source_Serif_4'] tracking-wide">
            Bank of Libreo &amp; 
          </span>
        </div>
      </div>
    </div>
  );
}

