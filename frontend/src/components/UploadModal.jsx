import { useState, useRef } from "react";
import { uploadFiles } from "../api";

export default function UploadModal({ onClose, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState(
    "Processing and embedding into ChromaDB..."
  );
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgressText("Processing and embedding into ChromaDB...");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const data = await uploadFiles(formData);
      setUploading(false);
      onClose();
      onUploadComplete(data, files.length);
    } catch {
      setUploading(false);
      alert("Upload failed. Ensure backend server is running.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4 font-['Source_Serif_4']"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container/95 rounded-sm max-w-md w-full p-6 shadow-lg border border-primary-container/80 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <h3 className="font-['Bodoni_Moda'] font-semibold text-lg text-primary flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-xl">
              cloud_upload
            </span>
            <span>Upload to Archives</span>
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Close upload modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Supported formats:{" "}
          <strong className="text-primary">PDF, DOCX, XLSX, CSV, TXT, MD, HTML, JSON</strong>. Documents
          will be chunked into vector blocks with metadata and saved to ChromaDB.
        </p>

        <div className="border-2 border-dashed border-primary-container/60 rounded-sm p-6 text-center bg-surface-variant/50 hover:bg-surface-variant transition-all cursor-pointer">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.xlsx,.csv,.txt,.md,.json,.html"
          />
          <label
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <span className="material-symbols-outlined text-3xl text-primary">
              upload_file
            </span>
            <span className="text-xs font-semibold text-primary">
              Click to upload or drag files here
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Max file size 50MB
            </span>
          </label>
        </div>

        {uploading && (
          <div className="text-xs text-secondary font-medium flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
            <span>{progressText}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary rounded-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

