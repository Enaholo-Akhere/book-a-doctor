export type AiChatRole = 'user' | 'assistant';

export interface AiChatTurn {
  role: AiChatRole;
  content: string;
}

export type AiChatReplyType = 'answer' | 'emergency' | 'refusal' | 'greeting';

/** Trusted reference the assistant used (e.g. MedlinePlus). */
export interface AiChatSource {
  title: string;
  url: string;
  publisher: string;
}

/** In-app button under an answer, e.g. "Book a doctor". Always an internal path. */
export interface AiChatAction {
  type: 'booking';
  label: string;
  url: string;
}

export interface AiChatEntry extends AiChatTurn {
  id: string;
  /** Assistant replies only. 'limit' is the client-side "out of questions" card. */
  type?: AiChatReplyType | 'limit';
  /** A question that was not answered because the daily limit was reached. */
  blocked?: boolean;
  sources?: AiChatSource[];
  actions?: AiChatAction[];
  /** Assistant replies that failed to send are shown as errors with a retry. */
  error?: boolean;
}

export interface AiChatQuotaInfo {
  /** null means unlimited (active booking). */
  remainingQuestions: number | null;
  limit: number;
  /** Next UTC midnight, when free questions reset. */
  resetsAt: string;
  /** Unlimited plan: when the active booking stops granting unlimited access. */
  planActiveUntil?: string;
  /** The privacy notice must be accepted before chatting. */
  consentRequired?: boolean;
  consentVersion?: string;
}

export interface AiChatStoredMessage {
  id: string;
  role: AiChatRole;
  content: string;
  type?: AiChatReplyType;
  sources?: AiChatSource[];
  actions?: AiChatAction[];
  createdAt: string;
}

export interface AiChatResponse extends AiChatQuotaInfo {
  type: AiChatReplyType;
  answer: string;
  sources?: AiChatSource[];
  actions?: AiChatAction[];
  disclaimer: string;
}

export interface AiChatLimitError extends AiChatQuotaInfo {
  code: 'AI_CHAT_LIMIT_REACHED';
  message: string;
  bookingUrl: string;
}
