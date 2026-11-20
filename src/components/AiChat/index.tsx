import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import {
  acceptAiChatConsent,
  asAiChatLimitError,
  deleteAiChatData,
  downloadAiChatExport,
  isAiChatConsentError,
  getAiChatMessages,
  getAiChatQuota,
  sendAiChatMessage,
} from '@/services/ai-chat.service';
import { handleAxiosError } from '@/utils/axiosError';
import type { AiChatEntry, AiChatQuotaInfo, AiChatTurn } from '@/types/ai-chat';
import AiChatLauncher from './AiChatLauncher';
import AiChatPanel, { AI_CHAT_DISCLAIMER } from './AiChatPanel';
import { AI_CHAT_OPEN_EVENT } from './openAiChat';

const HISTORY_TURNS = 10;
const GUEST_KEY = 'ai-chat:guest';

/** Guests' conversations live only in this tab (never on the server). */
const loadGuest = (): AiChatEntry[] => {
  try {
    const raw = sessionStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as AiChatEntry[]) : [];
  } catch {
    return [];
  }
};

const saveGuest = (entries: AiChatEntry[]) => {
  try {
    sessionStorage.setItem(GUEST_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable: keep in memory only */
  }
};

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

/**
 * AI health assistant. Completely separate from the real-time doctor chat
 * (no sockets, no shared store). Hidden for doctor accounts.
 *
 * - Guests: conversation kept in sessionStorage for this tab only.
 * - Signed-in patients: conversation saved on the server and loaded on open.
 */
const AiChat = () => {
  const user = useAuthStore((s) => s.user);
  const owner = user?._id ?? 'guest';
  const isGuest = owner === 'guest';

  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<AiChatEntry[]>(() => (isGuest ? loadGuest() : []));
  const [entriesOwner, setEntriesOwner] = useState(owner);
  const [historyLoadedFor, setHistoryLoadedFor] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [disclaimer, setDisclaimer] = useState(AI_CHAT_DISCLAIMER);
  const [quota, setQuota] = useState<AiChatQuotaInfo | null>(null);
  const [bookingUrl, setBookingUrl] = useState('/doctors');
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Login/logout swaps conversations during render, so one account's messages
  // are never shown to (or saved for) another.
  if (entriesOwner !== owner) {
    setEntriesOwner(owner);
    setEntries(isGuest ? loadGuest() : []);
    setHistoryLoadedFor(null);
    setQuota(null);
  }

  useEffect(() => {
    if (isGuest && entriesOwner === 'guest') saveGuest(entries);
  }, [isGuest, entriesOwner, entries]);

  // Other pages (e.g. Services) can open the panel.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(AI_CHAT_OPEN_EVENT, show);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, show);
  }, []);

  // Remove conversations older versions kept per user in sessionStorage.
  useEffect(() => {
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('ai-chat:') && k !== GUEST_KEY)
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }, []);

  // Signed-in: load the saved conversation the first time the panel opens.
  useEffect(() => {
    if (!open || isGuest || historyLoadedFor === owner) return;
    let active = true;
    setIsLoadingHistory(true);
    getAiChatMessages()
      .then((messages) => {
        if (!active) return;
        setEntries(
          messages.map((m) => ({ id: m.id, role: m.role, content: m.content, type: m.type, sources: m.sources, actions: m.actions }))
        );
        setHistoryLoadedFor(owner);
      })
      .catch(() => {
        /* history is optional; new questions still work */
      })
      .finally(() => active && setIsLoadingHistory(false));
    return () => {
      active = false;
    };
  }, [open, isGuest, owner, historyLoadedFor]);

  // Remaining questions (or unlimited) whenever the panel opens or the account changes.
  useEffect(() => {
    if (!open) return;
    let active = true;
    getAiChatQuota()
      .then((q) => active && setQuota(q))
      .catch(() => {
        /* the counter is optional; questions still work */
      });
    return () => {
      active = false;
    };
  }, [open, owner]);

  const ask = useCallback(
    async (text: string, base: AiChatEntry[]) => {
      // Signed-in history is read from the server, so only guests send it.
      const history: AiChatTurn[] = isGuest
        ? base
            .filter((e) => !e.error && !e.blocked && e.type !== 'limit')
            .slice(-HISTORY_TURNS * 2)
            .map(({ role, content }) => ({ role, content }))
        : [];
      const withQuestion = [...base, { id: newId(), role: 'user' as const, content: text }];
      setEntries(withQuestion);
      setIsSending(true);
      try {
        const res = await sendAiChatMessage(text, history);
        if (res.disclaimer) setDisclaimer(res.disclaimer);
        setQuota({
          remainingQuestions: res.remainingQuestions,
          limit: res.limit,
          resetsAt: res.resetsAt,
          planActiveUntil: res.planActiveUntil,
        });
        setEntries([
          ...withQuestion,
          { id: newId(), role: 'assistant', content: res.answer, type: res.type, sources: res.sources, actions: res.actions },
        ]);
      } catch (err) {
        if (isAiChatConsentError(err)) {
          // Notice not accepted (or a new version): show it, and drop the unsent question.
          setEntries(base);
          setQuota((q) => (q ? { ...q, consentRequired: true } : q));
          getAiChatQuota().then(setQuota).catch(() => undefined);
          return;
        }
        const limit = asAiChatLimitError(err);
        if (limit) {
          setQuota({ remainingQuestions: 0, limit: limit.limit, resetsAt: limit.resetsAt });
          setBookingUrl(limit.bookingUrl || '/doctors');
          setEntries([
            ...withQuestion.slice(0, -1),
            { ...withQuestion[withQuestion.length - 1], blocked: true },
            { id: newId(), role: 'assistant', content: limit.message, type: 'limit' },
          ]);
          return;
        }
        setEntries([...withQuestion, { id: newId(), role: 'assistant', content: handleAxiosError(err), error: true }]);
      } finally {
        setIsSending(false);
      }
    },
    [isGuest]
  );

  const onSend = (text: string) => ask(text, entries.filter((e) => !e.error));

  // Re-send the last question after an error.
  const onRetry = () => {
    const lastUser = [...entries].reverse().find((e) => e.role === 'user');
    if (!lastUser) return;
    const idx = entries.lastIndexOf(lastUser);
    ask(lastUser.content, entries.slice(0, idx).filter((e) => !e.error));
  };

  const onClear = async () => {
    if (isGuest) return setEntries([]);
    if (!window.confirm("Delete your saved AI chat history now? This can't be undone, and you'll be asked to accept the privacy notice again.")) return;
    try {
      await deleteAiChatData();
      setEntries([]);
      setQuota((q) => (q ? { ...q, consentRequired: true } : q));
      toast.success('Your AI chat data was deleted');
    } catch (err) {
      toast.error(handleAxiosError(err));
    }
  };

  const onAcceptConsent = async () => {
    try {
      // Re-read the version so we never accept a notice the server has replaced.
      const current = quota?.consentVersion ? quota : await getAiChatQuota();
      await acceptAiChatConsent(current.consentVersion ?? '');
      setQuota({ ...current, consentRequired: false });
    } catch (err) {
      toast.error(handleAxiosError(err));
      getAiChatQuota().then(setQuota).catch(() => undefined);
    }
  };

  const onExport = () => downloadAiChatExport().catch((err) => toast.error(handleAxiosError(err)));

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  if (user?.role === 'doctor') return null;

  return open ? (
    <AiChatPanel
      entries={entries}
      isSending={isSending}
      isLoadingHistory={isLoadingHistory}
      disclaimer={disclaimer}
      quota={quota}
      bookingUrl={bookingUrl}
      signedIn={!isGuest}
      onAcceptConsent={onAcceptConsent}
      onExport={onExport}
      onSend={onSend}
      onRetry={onRetry}
      onClear={onClear}
      onClose={close}
    />
  ) : (
    <AiChatLauncher ref={launcherRef} onClick={() => setOpen(true)} />
  );
};

export default AiChat;
