import {
  Bot,
  Github,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

interface SidebarProps {
  selectedModel: string;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onClearChats: () => void;
}

export const Sidebar = ({
  selectedModel,
  isOpen,
  onClose,
  onNewChat,
  onOpenSettings,
  onClearChats,
}: SidebarProps) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[86vw] flex-col border-r border-slate-800 bg-slate-950/95 px-5 py-5 text-slate-100 shadow-glow backdrop-blur-xl transition-transform duration-300 md:static md:z-auto md:max-w-none md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-950/50">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-normal">
              Local LLM Chat
            </h1>
            <p className="text-sm text-slate-400">Ollama personal workspace</p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-400 transition hover:bg-slate-900 hover:text-slate-100 md:hidden"
          onClick={onClose}
          aria-label="사이드바 닫기"
        >
          <X size={19} />
        </button>
      </div>

      <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Sparkles size={15} />
          <span>현재 모델</span>
        </div>
        <p className="break-all text-sm font-medium text-slate-100">
          {selectedModel}
        </p>
      </div>

      <nav className="space-y-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg bg-indigo-500 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onNewChat}
        >
          <Plus size={18} />
          새 채팅
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-slate-50"
          onClick={onOpenSettings}
        >
          <Settings size={18} />
          설정
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-rose-200 transition hover:bg-rose-500/10 hover:text-rose-100"
          onClick={onClearChats}
        >
          <Trash2 size={18} />
          대화 삭제
        </button>
      </nav>

      <div className="mt-auto space-y-4 border-t border-slate-800 pt-5">
        <p className="text-sm leading-6 text-slate-400">
          브라우저에서 로컬 Ollama 모델과 대화하는 공개용 React 프로젝트입니다.
        </p>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          <Github size={15} />
          GitHub ready
        </div>
      </div>
    </aside>
  );
};
