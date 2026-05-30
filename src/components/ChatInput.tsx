import { SendHorizonal } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

interface ChatInputProps {
  disabled: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ disabled, onSendMessage }: ChatInputProps) => {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSend = draft.trim().length > 0 && !disabled;

  const submitMessage = () => {
    if (!canSend) {
      return;
    }

    onSendMessage(draft);
    setDraft('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl items-end gap-3 rounded-lg border border-slate-700 bg-slate-900/90 p-2 shadow-2xl shadow-slate-950/50 backdrop-blur">
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="메시지를 입력하세요..."
        className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-slate-50 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={submitMessage}
        disabled={!canSend}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
        aria-label="메시지 전송"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
};
