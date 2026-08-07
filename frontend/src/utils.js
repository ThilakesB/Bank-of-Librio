export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatMarkdown(str) {
  if (!str) return "";
  return str
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /```text\n([\s\S]*?)\n```/g,
      "<pre class='bg-surface-container-low p-3 rounded-lg font-mono text-xs my-2 overflow-x-auto border border-outline-variant/30'>$1</pre>"
    )
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n- /g, "<br/>• ");
}

let sendAudio = null;

export function playSendSound(isMuted = false) {
  if (isMuted) return;
  try {
    if (!sendAudio) {
      sendAudio = new Audio("/sounds/send.mp3");
    } else {
      sendAudio.currentTime = 0;
    }
    sendAudio.volume = 0.7;
    sendAudio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });
  } catch (err) {
    console.warn("Audio initialization error:", err);
  }
}

