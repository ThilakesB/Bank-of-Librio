export default function Header({
  dbStatus,
  chunksCount,
  docsCount,
  isMuted,
  onToggleMute,
  onToggleDrawer,
  onOpenUpload,
  onOpenSettings,
}) {
  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant px-4 md:px-8 py-3 shrink-0 z-40 relative">
      <div className="absolute inset-0 meander-pattern opacity-50 z-[-1]" />
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        {/* Left: Drawer Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDrawer}
            aria-label="Toggle Document Drawer"
            className="text-primary hover:text-primary-fixed-dim transition-colors p-2 rounded-full hover:bg-surface-variant flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">Menu</span>
          </button>

          <div className="flex flex-col">
            <h1 className="font-['Bodoni_Moda'] text-xl md:text-2xl uppercase tracking-widest text-primary font-semibold">
              Bank OF Libreo
            </h1>
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1.5 font-['Source_Serif_4']">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>{dbStatus}</span>
            </p>
          </div>
        </div>

        {/* Right: Knowledge Base Pills & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle Button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            title={isMuted ? "Sound Disabled" : "Sound Enabled"}
            className="text-primary hover:text-primary-fixed-dim p-2 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
            className="text-primary hover:text-primary-fixed-dim p-2 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={onToggleDrawer}
            className="bg-surface-container/80 hover:bg-surface-variant text-primary border border-outline-variant/60 text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">database</span>
            <span>{chunksCount} Chunks</span>
            <span className="text-primary/40">•</span>
            <span>{docsCount} Docs</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              cloud_upload
            </span>
            <span className="hidden sm:inline">Upload Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}


