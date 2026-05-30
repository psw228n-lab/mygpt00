import { AlertTriangle, Menu, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  model: string;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onOpenSidebar: () => void;
  onSendMessage: (message: string) => void;
  onDismissError: () => void;
}

const LoadingBubble = () => (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 rounded-lg bg-slate-800" />
    <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300 shadow-lg shadow-slate-950/40">
      <div className="flex items-center gap-3">
        <span>AI가 생각 중입니다...</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300" />
        </span>
      </div>
    </div>
  </div>
);

export const ChatWindow = ({
  model,
  messages,
  isLoading,
  error,
  onOpenSidebar,
  onSendMessage,
  onDismissError,
}: ChatWindowProps) => {
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  return (
    <main className="flex h-screen min-w-0 flex-1 flex-col bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/85 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-800 text-slate-300 transition hover:bg-slate-900 hover:text-slate-50 md:hidden"
              aria-label="사이드바 열기"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">
                {model}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                Local Ollama
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <EmptyState disabled={isLoading} onPromptClick={onSendMessage} />
        ) : (
          <div className="mx-auto flex max-w-5xl flex-col gap-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </div>
        )}

        {error && (
          <div className="mx-auto mt-5 flex max-w-5xl items-start gap-3 rounded-lg border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={onDismissError}
              className="rounded-md p-1 text-rose-200 transition hover:bg-rose-400/10 hover:text-white"
              aria-label="오류 메시지 닫기"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div ref={scrollTargetRef} />
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-xl sm:px-6">
        <ChatInput disabled={isLoading} onSendMessage={onSendMessage} />
      </footer>
    </main>
  );
};
