import { useRef, useEffect } from "react";
import WelcomeHero from "./WelcomeHero";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

export default function ChatFeed({
  messages,
  isLoading,
  showWelcome,
  onSetQuery,
  onSubmit,
  onInspectChunks,
}) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto relative overflow-hidden h-full font-['Source_Serif_4']">
      {/* Messages Scroll Container */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scrollbar-hide pb-36 z-10"
      >
        {/* Welcome Hero */}
        {showWelcome && <WelcomeHero onSetQuery={onSetQuery} />}

        {/* Initial AI Welcome Message */}
        <div className="flex w-full justify-start message-entrance">
          <div className="backdrop-blur-md border border-primary-container shadow-sm p-5 md:p-6 max-w-[90%] md:max-w-[85%] relative bg-surface-container/90 rounded-sm">
            {/* Left scroll edge accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-sm" />

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-variant border border-primary flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-xl">
                  auto_awesome
                </span>
              </div>
              <div className="pt-1 flex-1">
                <p className="text-on-surface text-sm md:text-base leading-relaxed">
                  Greetings, seeker. I am the <strong>Oracle of Libreo</strong>, connected directly to your <strong>ChromaDB vector store</strong>. How may I assist your journey through our document archives and datasets today?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} text={msg.text} />
          ) : (
            <AIMessage
              key={msg.id}
              text={msg.text}
              citations={msg.citations}
              chunks={msg.chunks}
              onInspectChunks={onInspectChunks}
            />
          )
        )}

        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Fixed Bottom Input Bar */}
      <MessageInput onSubmit={onSubmit} />
    </main>
  );
}

