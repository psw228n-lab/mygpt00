import type {
  OllamaChatResponse,
  OllamaMessage,
  SendChatMessageParams,
} from '../types/chat';

export const OLLAMA_CHAT_ENDPOINT = 'http://localhost:11434/api/chat';

type OllamaErrorKind = 'connection' | 'model' | 'server' | 'unknown';

export class OllamaRequestError extends Error {
  kind: OllamaErrorKind;
  status?: number;

  constructor(message: string, kind: OllamaErrorKind, status?: number) {
    super(message);
    this.name = 'OllamaRequestError';
    this.kind = kind;
    this.status = status;
  }
}

const CONNECTION_ERROR =
  'Ollama 서버에 연결할 수 없습니다. 터미널에서 `ollama serve` 또는 `ollama run gpt-oss:20b`를 실행했는지 확인해주세요.';

const buildMessages = ({
  messages,
  systemPrompt,
}: Pick<SendChatMessageParams, 'messages' | 'systemPrompt'>): OllamaMessage[] => {
  const chatMessages = messages.map(({ role, content }) => ({ role, content }));

  if (!systemPrompt.trim()) {
    return chatMessages;
  }

  return [{ role: 'system', content: systemPrompt.trim() }, ...chatMessages];
};

const getReadableError = async (
  response: Response,
  model: string,
): Promise<OllamaRequestError> => {
  let payload: OllamaChatResponse | null = null;

  try {
    payload = (await response.json()) as OllamaChatResponse;
  } catch {
    payload = null;
  }

  const serverMessage = payload?.error ?? '';
  const lowerMessage = serverMessage.toLowerCase();

  if (
    response.status === 404 ||
    lowerMessage.includes('model') ||
    lowerMessage.includes('not found') ||
    lowerMessage.includes('pull')
  ) {
    return new OllamaRequestError(
      `해당 모델이 설치되어 있지 않을 수 있습니다. \`ollama pull ${model}\`를 먼저 실행해주세요.`,
      'model',
      response.status,
    );
  }

  if (response.status >= 500) {
    return new OllamaRequestError(
      'Ollama 서버에서 응답을 처리하지 못했습니다. 모델 실행 상태와 터미널 로그를 확인해주세요.',
      'server',
      response.status,
    );
  }

  return new OllamaRequestError(
    serverMessage || '요청을 처리하는 중 알 수 없는 오류가 발생했습니다.',
    'unknown',
    response.status,
  );
};

export const sendChatMessage = async ({
  model,
  messages,
  systemPrompt,
  temperature,
}: SendChatMessageParams): Promise<string> => {
  const body = {
    model,
    messages: buildMessages({ messages, systemPrompt }),
    stream: false,
    options: {
      temperature,
    },
  };

  let response: Response;

  try {
    response = await fetch(OLLAMA_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new OllamaRequestError(CONNECTION_ERROR, 'connection');
  }

  if (!response.ok) {
    throw await getReadableError(response, model);
  }

  const data = (await response.json()) as OllamaChatResponse;
  const answer = data.message?.content?.trim();

  if (!answer) {
    throw new OllamaRequestError(
      'Ollama 응답이 비어 있습니다. 모델을 다시 실행한 뒤 재시도해주세요.',
      'unknown',
    );
  }

  return answer;
};
