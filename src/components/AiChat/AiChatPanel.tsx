import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  CalendarPlus,
  Download,
  Info,
  Loader2,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { AiChatEntry, AiChatQuotaInfo } from "@/types/ai-chat";
import AiChatMessage from "./AiChatMessage";
import AiChatConsent from "./AiChatConsent";

export const AI_CHAT_DISCLAIMER =
  "General information only, not medical advice.";
const MAX_LENGTH = 2000;

const SUGGESTIONS = [
  "What are signs of dehydration?",
  "How can I sleep better?",
  "Is it a cold or the flu?",
  "Tips to lower stress",
];

interface Props {
  entries: AiChatEntry[];
  isSending: boolean;
  isLoadingHistory?: boolean;
  disclaimer: string;
  quota: AiChatQuotaInfo | null;
  bookingUrl: string;
  signedIn: boolean;
  onAcceptConsent: () => Promise<void>;
  onExport: () => void;
  onSend: (text: string) => void;
  onRetry: () => void;
  onClear: () => void;
  onClose: () => void;
}

const resetTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** "2 of 3 free questions left today" with a small meter, or the unlimited note. */
const AiChatQuotaMeter = ({ quota }: { quota: AiChatQuotaInfo }) => {
  if (quota.remainingQuestions === null) {
    const until = quota.planActiveUntil
      ? new Date(quota.planActiveUntil).toLocaleDateString([], {
          day: "numeric",
          month: "short",
        })
      : null;
    return (
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
        <BadgeCheck size={13} aria-hidden />
        Unlimited questions with your booking{until ? ` until ${until}` : ""}
      </p>
    );
  }
  const left = quota.remainingQuestions;
  return (
    <div className="flex items-center gap-2 text-[11px] text-gray-500">
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: quota.limit }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full ${i < left ? "bg-violet-500" : "bg-gray-200"}`}
          />
        ))}
      </span>
      <span>
        <span className="font-semibold tabular-nums text-gray-700">{left}</span>{" "}
        of {quota.limit} free questions left today
      </span>
    </div>
  );
};

const AiChatPanel = ({
  entries,
  isSending,
  isLoadingHistory = false,
  disclaimer,
  quota,
  bookingUrl,
  signedIn,
  onAcceptConsent,
  onExport,
  onSend,
  onRetry,
  onClear,
  onClose,
}: Props) => {
  const needsConsent = !!quota?.consentRequired;
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // New answers scroll to their first line (long replies read top-down);
  // questions and the typing indicator scroll to the bottom.
  useEffect(() => {
    const last = entries[entries.length - 1];
    if (!isSending && last?.role === "assistant")
      lastRef.current?.scrollIntoView({ block: "start" });
    else endRef.current?.scrollIntoView({ block: "end" });
  }, [entries, isSending]);

  // Grow the textarea with its content (up to ~5 lines).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft]);

  const submit = (text = draft) => {
    const value = text.trim();
    if (!value || isSending) return;
    onSend(value);
    setDraft("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="AI health assistant"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className="fixed inset-x-3 bottom-3 top-[92px] z-[95] flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-2xl shadow-violet-900/20 sm:inset-x-auto sm:left-5 sm:top-auto sm:bottom-5 sm:h-[min(620px,calc(100dvh-112px))] sm:w-[380px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Sparkles size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">AI Health Assistant</p>
          <p className="text-[11px] text-white/80">
            Automated assistant · not a doctor
          </p>
        </div>
        {signedIn && !needsConsent && (
          <button
            type="button"
            onClick={onExport}
            aria-label="Download my AI chat data"
            title="Download my AI chat data"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <Download size={16} />
          </button>
        )}
        {!needsConsent && (entries.length > 0 || signedIn) && (
          <button
            type="button"
            onClick={onClear}
            aria-label={
              signedIn ? "Delete my AI chat data" : "Clear conversation"
            }
            title={signedIn ? "Delete my AI chat data" : "Clear conversation"}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI assistant"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Disclaimer (always visible) */}
      <p className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
        <Info size={14} className="shrink-0" />
        {disclaimer} In an emergency, call your local emergency number.
      </p>

      {needsConsent ? (
        <AiChatConsent
          signedIn={signedIn}
          onAccept={onAcceptConsent}
          onDecline={onClose}
        />
      ) : (
        <>
          {/* Conversation */}
          <div
            className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#faf9ff] px-4 py-4"
            aria-live="polite"
          >
            {isLoadingHistory && entries.length === 0 && (
              <p className="flex items-center justify-center gap-2 pt-6 text-sm text-gray-400">
                <Loader2 size={16} className="animate-spin" /> Loading your
                conversation…
              </p>
            )}

            {!isLoadingHistory && entries.length === 0 && (
              <div className="pt-2 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  <Sparkles size={22} />
                </span>
                <p className="mt-3 font-semibold text-headingColor">
                  Ask a health question
                </p>
                <p className="mx-auto mt-1 max-w-[260px] text-sm text-gray-500">
                  Symptoms, medicines, nutrition, sleep or mental wellbeing. For
                  a diagnosis, book a doctor.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="cursor-pointer rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {entries.map((entry, i) => (
              <div
                key={entry.id}
                ref={i === entries.length - 1 ? lastRef : undefined}
                className="scroll-mt-3"
              >
                <AiChatMessage
                  entry={entry}
                  disclaimer={
                    entry.role === "assistant" ? disclaimer : undefined
                  }
                  bookingUrl={bookingUrl}
                  onNavigate={onClose}
                  onRetry={
                    entry.error && i === entries.length - 1
                      ? onRetry
                      : undefined
                  }
                />
              </div>
            ))}

            {isSending && (
              <div
                className="flex items-center gap-2.5"
                aria-label="Assistant is typing"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  <Sparkles size={14} />
                </span>
                <span className="flex gap-1 rounded-2xl rounded-tl-md border border-violet-100 bg-white px-3.5 py-3">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Out of free questions: keep the input (emergencies are still answered). */}
          {quota?.remainingQuestions === 0 && (
            <div className="flex items-center gap-3 border-t border-violet-100 bg-violet-50 px-4 py-2.5">
              <p className="min-w-0 flex-1 text-xs text-violet-900">
                Free questions reset at{" "}
                <span className="font-semibold">
                  {resetTime(quota.resetsAt)}
                </span>
                . Book a doctor for unlimited AI chat.
              </p>
              <Link
                to={bookingUrl}
                onClick={onClose}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primaryColor px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primaryColor2"
              >
                <CalendarPlus size={14} /> Book
              </Link>
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="border-t border-violet-100 bg-white p-3"
          >
            {quota && quota.remainingQuestions !== 0 && (
              <div className="mb-2 px-1">
                <AiChatQuotaMeter quota={quota} />
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-200">
              <label htmlFor="ai-chat-input" className="sr-only">
                Your health question
              </label>
              <textarea
                id="ai-chat-input"
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={MAX_LENGTH}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about a symptom, medicine…"
                className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                <SendHorizontal size={16} />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              AI answers can be wrong. Don't share names, emails or ID numbers.
            </p>
          </form>
        </>
      )}
    </div>
  );
};

export default AiChatPanel;
