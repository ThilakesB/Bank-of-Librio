import { escapeHtml } from "../utils";

export default function UserMessage({ text }) {
  return (
    <div className="flex w-full justify-end message-entrance">
      <div className="backdrop-blur-md border border-outline-variant p-4 md:p-5 max-w-[90%] md:max-w-[85%] rounded-sm bg-surface-variant font-['Source_Serif_4'] shadow-xs">
        <p className="text-on-surface text-sm md:text-base leading-relaxed">
          {escapeHtml(text)}
        </p>
      </div>
    </div>
  );
}

