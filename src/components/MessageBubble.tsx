import { Bot, UserRound } from 'lucide-react';
import type { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

const renderContent = (content: string) => {
  const codeBlockPattern = /```(\w+)?\n?([\s\S]*?)```/g;
  const blocks: JSX.Element[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockPattern.exec(content)) !== null) {
    const [rawBlock, language, code] = match;
    const textBefore = content.slice(lastIndex, match.index);

    if (textBefore) {
      blocks.push(
        <p key={`text-${match.index}`} className="whitespace-pre-wrap">
          {textBefore}
        </p>,
      );
    }

    blocks.push(
      <div
        key={`code-${match.index}`}
        className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
      >
        {language && (
          <div className="border-b border-slate-800 px-4 py-2 text-xs font-medium text-slate-400">
            {language}
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
          <code>{code.trim()}</code>
        </pre>
      </div>,
    );

    lastIndex = match.index + rawBlock.length;
  }

  const remainingText = content.slice(lastIndex);

  if (remainingText) {
    blocks.push(
      <p key="text-last" className="whitespace-pre-wrap">
        {remainingText}
      </p>,
    );
  }

  return blocks.length > 0 ? blocks : content;
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <article
      className={`flex items-start gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-indigo-300">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`max-w-[min(760px,82%)] rounded-lg px-4 py-3 text-sm leading-7 shadow-lg ${
          isUser
            ? 'bg-indigo-500 text-white shadow-indigo-950/30'
            : 'border border-slate-800 bg-slate-900 text-slate-100 shadow-slate-950/40'
        }`}
      >
        <div className="space-y-3">{renderContent(message.content)}</div>
      </div>

      {isUser && (
        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-500 text-white">
          <UserRound size={17} />
        </div>
      )}
    </article>
  );
};
