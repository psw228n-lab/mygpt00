import { Save, Settings, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ChatSettings } from '../types/chat';

export const DEFAULT_MODELS = ['gpt-oss:20b', 'qwen3.5:9b', 'qwen3:8b'];

export const DEFAULT_SYSTEM_PROMPT =
  '너는 코딩 초보자와 마케팅 학습자를 도와주는 친절한 AI 튜터야. 어려운 개념은 비유를 먼저 들고, 그다음 핵심을 설명해줘. 답변은 한국어로 해줘.';

const CUSTOM_MODEL_VALUE = '__custom_model__';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: ChatSettings;
  onClose: () => void;
  onSave: (settings: ChatSettings) => void;
}

const clampTemperature = (temperature: number) =>
  Math.min(2, Math.max(0, Number(temperature.toFixed(1))));

export const SettingsPanel = ({
  isOpen,
  settings,
  onClose,
  onSave,
}: SettingsPanelProps) => {
  const [draft, setDraft] = useState<ChatSettings>(settings);
  const [customModel, setCustomModel] = useState('');

  const modelOptions = useMemo(
    () => Array.from(new Set([...DEFAULT_MODELS, ...draft.customModels])),
    [draft.customModels],
  );

  const selectedModelValue = modelOptions.includes(draft.model)
    ? draft.model
    : CUSTOM_MODEL_VALUE;

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
      setCustomModel(modelOptions.includes(settings.model) ? '' : settings.model);
    }
  }, [isOpen, modelOptions, settings]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmedCustomModel = customModel.trim();
    const nextModel = trimmedCustomModel || draft.model;
    const nextCustomModels =
      trimmedCustomModel && !DEFAULT_MODELS.includes(trimmedCustomModel)
        ? Array.from(new Set([...draft.customModels, trimmedCustomModel]))
        : draft.customModels;

    onSave({
      ...draft,
      model: nextModel,
      customModels: nextCustomModels,
      systemPrompt: draft.systemPrompt.trim(),
      temperature: clampTemperature(draft.temperature),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur">
      <section className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950">
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500 text-white">
              <Settings size={19} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">설정</h2>
              <p className="text-sm text-slate-400">모델과 응답 성향을 조정합니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-900 hover:text-slate-100"
            aria-label="설정 닫기"
          >
            <X size={19} />
          </button>
        </header>

        <div className="max-h-[78vh] space-y-6 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              모델 선택
            </span>
            <select
              value={selectedModelValue}
              onChange={(event) => {
                const value = event.target.value;
                if (value === CUSTOM_MODEL_VALUE) {
                  setCustomModel(draft.model);
                  return;
                }
                setCustomModel('');
                setDraft((previous) => ({ ...previous, model: value }));
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
            >
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
              <option value={CUSTOM_MODEL_VALUE}>사용자 직접 입력</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              직접 모델명
            </span>
            <input
              value={customModel}
              onChange={(event) => setCustomModel(event.target.value)}
              placeholder="예: llama3.2:latest"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              시스템 프롬프트
            </span>
            <textarea
              value={draft.systemPrompt}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  systemPrompt: event.target.value,
                }))
              }
              rows={6}
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm leading-6 text-slate-100 outline-none transition focus:border-indigo-400"
            />
          </label>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label
                htmlFor="temperature"
                className="text-sm font-medium text-slate-200"
              >
                Temperature
              </label>
              <span className="rounded-md bg-slate-900 px-2 py-1 text-sm text-slate-300">
                {draft.temperature.toFixed(1)}
              </span>
            </div>
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={draft.temperature}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  temperature: Number(event.target.value),
                }))
              }
              className="w-full accent-indigo-500"
            />
            <p className="mt-3 text-sm leading-6 text-slate-400">
              낮을수록 안정적이고 높을수록 창의적인 답변에 가까워집니다. 긴 대화는
              모델의 컨텍스트 길이에 따라 오래된 내용이 덜 반영될 수 있습니다.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400"
          >
            <Save size={17} />
            저장
          </button>
        </footer>
      </section>
    </div>
  );
};
