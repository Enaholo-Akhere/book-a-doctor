import { useCallback, useEffect, useRef, useState } from 'react';
import { InfiniteData, QueryClient, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { isViewingConversation } from '@/store/chatUIStore';
import { useSocket } from '@/library/socket/socketContext';
import { AttachmentUpload, getConversations, getMessages, sendAttachment } from '@/services/chat.service';
import { getRoomId } from '@/utils/roomId';
import { truncateText } from '@/utils/helperFunctions';
import type { ChatMessage, Conversation, MessagesPage } from '@/types/chat';

export const CHAT_KEYS = {
  all: ['chat'] as const,
  conversations: ['chat', 'conversations'] as const,
  messages: (peerId: string) => ['chat', 'messages', peerId] as const,
};

type MessagesCache = InfiniteData<MessagesPage, string | undefined>;

// ── Cache helpers ────────────────────────────────────────────────────
// Pages are newest-first; messages inside a page are oldest-first.

const peerIdOf = (m: ChatMessage, myId: string) => (m.senderId === myId ? m.recipientId : m.senderId);

const patchMessages = (qc: QueryClient, peerId: string, fn: (msgs: ChatMessage[]) => ChatMessage[]) =>
  qc.setQueryData<MessagesCache>(CHAT_KEYS.messages(peerId), (old) =>
    old ? { ...old, pages: old.pages.map((p) => ({ ...p, messages: fn(p.messages) })) } : old
  );

/** Adds a message, replacing its optimistic copy (by clientId) if present. Idempotent. */
const upsertMessage = (qc: QueryClient, peerId: string, msg: ChatMessage, clientId?: string) =>
  qc.setQueryData<MessagesCache>(CHAT_KEYS.messages(peerId), (old) => {
    if (!old?.pages.length) return old;
    const all = old.pages.flatMap((p) => p.messages);
    if (all.some((m) => m._id === msg._id)) return old;

    if (clientId && all.some((m) => m.clientId === clientId)) {
      return {
        ...old,
        pages: old.pages.map((p) => ({
          ...p,
          messages: p.messages.map((m) => (m.clientId === clientId ? msg : m)),
        })),
      };
    }
    const [newest, ...rest] = old.pages;
    return { ...old, pages: [{ ...newest, messages: [...newest.messages, msg] }, ...rest] };
  });

/** Updates one conversation; returns false if it isn't in the cache. */
const updateConversation = (
  qc: QueryClient,
  match: (c: Conversation) => boolean,
  fn: (c: Conversation) => Conversation,
  moveToTop = false
): boolean => {
  let found = false;
  qc.setQueryData<Conversation[]>(CHAT_KEYS.conversations, (old) => {
    if (!old) return old;
    const idx = old.findIndex(match);
    if (idx === -1) return old;
    found = true;
    const updated = fn(old[idx]);
    const rest = old.filter((_, i) => i !== idx);
    return moveToTop ? [updated, ...rest] : old.map((c, i) => (i === idx ? updated : c));
  });
  return found;
};

const uploadErrorMessage = (err: unknown) => {
  const e = err as { response?: { data?: { message?: string } }; code?: string };
  if (e.response?.data?.message) return e.response.data.message;
  return e.code === 'ECONNABORTED' ? 'Upload timed out' : 'Upload failed';
};

const countsAsUnread = (m: ChatMessage) => m.type !== 'call' || m.call?.status === 'missed';

/** Short text for toasts/previews of any message type. */
export const messagePreview = (m: Pick<ChatMessage, 'type' | 'content' | 'attachment'>) => {
  if (m.type === 'voice') return '🎤 Voice message';
  if (m.type === 'file') {
    const isImage = m.attachment?.resourceType === 'image';
    return `${isImage ? '📷' : '📎'} ${m.content || m.attachment?.name || (isImage ? 'Photo' : 'File')}`;
  }
  return m.content;
};

// ── Queries ──────────────────────────────────────────────────────────

const useCanChat = () => {
  const role = useAuthStore((s) => s.user?.role);
  return role === 'patient' || role === 'doctor';
};

export const useConversations = () =>
  useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: getConversations,
    enabled: useCanChat(),
    staleTime: 60_000,
  });

export const useMessages = (peerId: string | null) =>
  useInfiniteQuery({
    queryKey: CHAT_KEYS.messages(peerId ?? ''),
    queryFn: ({ pageParam }) => getMessages(peerId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: Boolean(peerId),
    // Kept fresh by socket events; refetched on reconnect.
    staleTime: Infinity,
    retry: 1,
  });

// ── Realtime sync (mount once, app-wide) ─────────────────────────────

export const useChatRealtimeSync = () => {
  const { socket } = useSocket();
  const qc = useQueryClient();
  const myId = useAuthStore((s) => s.user?._id);

  useEffect(() => {
    if (!socket || !myId) return;
    let connectedBefore = socket.connected;

    // Anything may have been missed while offline: refetch.
    const onConnect = () => {
      if (connectedBefore) qc.invalidateQueries({ queryKey: CHAT_KEYS.all });
      connectedBefore = true;
    };

    const onMessage = ({ message, clientId }: { message: ChatMessage; clientId?: string }) => {
      const peerId = peerIdOf(message, myId);
      const incoming = message.senderId !== myId;
      const viewing = incoming && isViewingConversation(peerId);

      upsertMessage(qc, peerId, message, clientId);
      if (viewing) socket.emit('message:read', { otherUserId: peerId });

      const bumpUnread = incoming && !viewing && countsAsUnread(message);
      const found = updateConversation(
        qc,
        (c) => c.peer._id === peerId,
        (c) => ({
          ...c,
          lastMessage: {
            content: message.type === 'voice' ? 'Voice message' : message.type === 'file' ? message.content || message.attachment?.name || 'File' : message.content,
            type: message.type,
            senderId: message.senderId,
            createdAt: message.createdAt,
          },
          unreadCount: bumpUnread ? c.unreadCount + 1 : c.unreadCount,
        }),
        true
      );
      if (!found) qc.invalidateQueries({ queryKey: CHAT_KEYS.conversations });

      if (bumpUnread && message.type !== 'call') {
        toast(`${message.senderName}: ${truncateText(messagePreview(message), 60)}`, { icon: '💬', id: `chat-${peerId}` });
      }
    };

    const onRead = ({ roomId, readerId }: { roomId: string; readerId: string }) => {
      if (readerId === myId) {
        updateConversation(qc, (c) => c.roomId === roomId, (c) => ({ ...c, unreadCount: 0 }));
        return;
      }
      patchMessages(qc, readerId, (msgs) =>
        msgs.map((m) =>
          m.senderId === myId && !m.readBy.includes(readerId) ? { ...m, readBy: [...m.readBy, readerId] } : m
        )
      );
    };

    const onPresence = ({ userId, online }: { userId: string; online: boolean }) => {
      updateConversation(qc, (c) => c.peer._id === userId, (c) => ({ ...c, online }));
    };

    socket.on('connect', onConnect);
    socket.on('message:new', onMessage);
    socket.on('message:read', onRead);
    socket.on('presence:update', onPresence);
    return () => {
      socket.off('connect', onConnect);
      socket.off('message:new', onMessage);
      socket.off('message:read', onRead);
      socket.off('presence:update', onPresence);
    };
  }, [socket, myId, qc]);
};

// ── Conversation-level hooks ─────────────────────────────────────────

/**
 * Validates access to a conversation server-side (booking rule) and marks it
 * read while the user is looking at it.
 */
export const useOpenConversation = (peerId: string | null) => {
  const { socket, isConnected } = useSocket();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !peerId) return;

    const markRead = () => {
      if (!isViewingConversation(peerId)) return;
      socket.emit('message:read', { otherUserId: peerId });
      updateConversation(qc, (c) => c.peer._id === peerId, (c) => ({ ...c, unreadCount: 0 }));
    };

    socket.emit('chat:open', { otherUserId: peerId }, (res) => {
      if (!res.ok) return setError(res.error);
      setError(null);
      updateConversation(qc, (c) => c.peer._id === peerId, (c) => ({ ...c, online: res.online }));
      markRead();
    });

    document.addEventListener('visibilitychange', markRead);
    return () => document.removeEventListener('visibilitychange', markRead);
  }, [socket, isConnected, peerId, qc]);

  return { error };
};

export const useSendMessage = (peerId: string | null) => {
  const { socket } = useSocket();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const send = useCallback(
    (content: string, retryOf?: ChatMessage) => {
      if (!socket || !user || !peerId) return;
      if (retryOf) patchMessages(qc, peerId, (msgs) => msgs.filter((m) => m._id !== retryOf._id));

      const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      upsertMessage(qc, peerId, {
        _id: clientId,
        clientId,
        roomId: getRoomId(user._id, peerId),
        senderId: user._id,
        recipientId: peerId,
        senderName: user.name,
        senderRole: user.role === 'doctor' ? 'doctor' : 'patient',
        content,
        type: 'text',
        readBy: [user._id],
        createdAt: new Date().toISOString(),
        pending: true,
      });

      socket.timeout(10_000).emit('message:send', { otherUserId: peerId, content, clientId }, (err, res) => {
        if (!err && res.ok) return upsertMessage(qc, peerId, res.message, clientId);
        patchMessages(qc, peerId, (msgs) =>
          msgs.map((m) => (m.clientId === clientId && m.pending ? { ...m, pending: false, failed: true } : m))
        );
        toast.error(!err && !res.ok ? res.error : 'Message not sent. Tap it to retry.');
      });
    },
    [socket, user, peerId, qc]
  );

  return send;
};

/**
 * Uploads a file or voice note over HTTP (sockets aren't meant for large
 * binaries). Shows an optimistic bubble with progress; the server echoes the
 * saved message over the socket and it replaces the bubble by clientId.
 */
export const useSendAttachment = (peerId: string | null) => {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useCallback(
    async (upload: Omit<AttachmentUpload, 'clientId'>, retryOf?: ChatMessage) => {
      if (!user || !peerId) return;
      if (retryOf) patchMessages(qc, peerId, (msgs) => msgs.filter((m) => m._id !== retryOf._id));

      const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const localUrl = URL.createObjectURL(upload.file);
      const mimeType = upload.file.type || 'application/octet-stream';
      const setProgress = (progress: number) =>
        patchMessages(qc, peerId, (msgs) => msgs.map((m) => (m.clientId === clientId && m.pending ? { ...m, progress } : m)));

      upsertMessage(qc, peerId, {
        _id: clientId,
        clientId,
        roomId: getRoomId(user._id, peerId),
        senderId: user._id,
        recipientId: peerId,
        senderName: user.name,
        senderRole: user.role === 'doctor' ? 'doctor' : 'patient',
        content: '',
        type: upload.kind,
        attachment: {
          url: localUrl,
          resourceType: mimeType.startsWith('image/') ? 'image' : mimeType.startsWith('audio/') ? 'video' : 'raw',
          name: upload.kind === 'voice' ? 'Voice message' : upload.fileName,
          mimeType,
          size: upload.file.size,
          durationSec: upload.durationSec,
        },
        readBy: [user._id],
        createdAt: new Date().toISOString(),
        pending: true,
        progress: 0,
        localFile: upload.file,
      });

      try {
        const message = await sendAttachment(peerId, { ...upload, clientId }, setProgress);
        upsertMessage(qc, peerId, message, clientId);
        // Give the real URL time to load before dropping the local preview.
        setTimeout(() => URL.revokeObjectURL(localUrl), 30_000);
      } catch (err) {
        patchMessages(qc, peerId, (msgs) =>
          msgs.map((m) => (m.clientId === clientId && m.pending ? { ...m, pending: false, failed: true } : m))
        );
        toast.error(`${uploadErrorMessage(err)}. Tap it to retry.`);
      }
    },
    [user, peerId, qc]
  );
};

/** Emits throttled typing:start and a trailing typing:stop. */
export const useTypingEmitter = (peerId: string | null) => {
  const { socket } = useSocket();
  const lastSentAt = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stopTyping = useCallback(() => {
    clearTimeout(stopTimer.current);
    if (lastSentAt.current && socket && peerId) socket.emit('typing:stop', { otherUserId: peerId });
    lastSentAt.current = 0;
  }, [socket, peerId]);

  const notifyTyping = useCallback(() => {
    if (!socket || !peerId) return;
    const now = Date.now();
    if (now - lastSentAt.current > 2000) {
      socket.emit('typing:start', { otherUserId: peerId });
      lastSentAt.current = now;
    }
    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(stopTyping, 2500);
  }, [socket, peerId, stopTyping]);

  useEffect(() => stopTyping, [stopTyping]);

  return { notifyTyping, stopTyping };
};

export const usePeerTyping = (peerId: string | null) => {
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !peerId) return;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const onTyping = ({ userId, isTyping: typing }: { userId: string; isTyping: boolean }) => {
      if (userId !== peerId) return;
      setIsTyping(typing);
      clearTimeout(safety);
      // Never get stuck on "typing…" if the stop event is lost.
      if (typing) safety = setTimeout(() => setIsTyping(false), 5000);
    };
    // A new message from them ends their typing state.
    const onMessage = ({ message }: { message: ChatMessage }) => {
      if (message.senderId === peerId) setIsTyping(false);
    };

    socket.on('typing', onTyping);
    socket.on('message:new', onMessage);
    return () => {
      clearTimeout(safety);
      setIsTyping(false);
      socket.off('typing', onTyping);
      socket.off('message:new', onMessage);
    };
  }, [socket, peerId]);

  return isTyping;
};
