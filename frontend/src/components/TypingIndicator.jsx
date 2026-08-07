export default function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[90%] md:max-w-[85%] self-start">
      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 mt-1">
        <span className="material-symbols-outlined text-primary text-sm">
          eco
        </span>
      </div>
      <div className="bg-surface-container-lowest text-primary px-4 py-3 rounded-2xl rounded-tl-sm border border-secondary/20 custom-shadow-level-1 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-secondary dot-1" />
        <span className="w-2 h-2 rounded-full bg-secondary dot-2" />
        <span className="w-2 h-2 rounded-full bg-secondary dot-3" />
      </div>
    </div>
  );
}
