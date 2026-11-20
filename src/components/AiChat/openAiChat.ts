/** Lets other parts of the app (e.g. the Services page) open the AI assistant panel. */
export const AI_CHAT_OPEN_EVENT = 'careconnect:open-ai-chat';

export const openAiChat = () => window.dispatchEvent(new Event(AI_CHAT_OPEN_EVENT));
