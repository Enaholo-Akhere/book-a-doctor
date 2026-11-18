import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import HashLoader from 'react-spinners/HashLoader';
import chatBg from '@/assets/images/chat-bg.png';
import avatarIcon from '@/assets/images/avatar-icon.png';
import { LuCheck, LuCheckCheck, LuClock } from 'react-icons/lu';
import { IoMdSend } from 'react-icons/io';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaCircle } from 'react-icons/fa';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { SlOptionsVertical } from 'react-icons/sl';
import { GrAttachment, GrEmoji } from 'react-icons/gr';
import { AiOutlineAudio } from 'react-icons/ai';
import { MdErrorOutline, MdOutlinePhoneMissed } from 'react-icons/md';
import {
  useConversations,
  useMessages,
  useOpenConversation,
  usePeerTyping,
  useSendMessage,
  useTypingEmitter,
} from '@/Hook/useChat';
import { useChatUIStore } from '@/store/chatUIStore';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/library/socket/socketContext';
import { useCall } from '@/components/Call/callContext';
import type { ChatMessage } from '@/types/chat';

const MAX_LENGTH = 2000;

const dayLabel = (iso: string) => {
  const d = dayjs(iso);
  if (d.isSame(dayjs(), 'day')) return 'Today';
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  return d.format('D MMM YYYY');
};

const formatCallDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

const CallLogBubble = ({ msg }: { msg: ChatMessage }) => {
  const missed = msg.call?.status !== 'completed';
  const Icon = missed ? MdOutlinePhoneMissed : msg.call?.callType === 'video' ? IoVideocamOutline : IoCallOutline;
  return (
    <div className='flex justify-center'>
      <div
        className={`flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[12px] shadow-sm ${missed ? 'text-red-600' : 'text-gray-700'}`}
      >
        <Icon size={14} />
        <span>{msg.content}</span>
        {msg.call?.status === 'completed' && msg.call.durationSec > 0 && (
          <span className='text-gray-500'>· {formatCallDuration(msg.call.durationSec)}</span>
        )}
        <span className='text-gray-400'>{dayjs(msg.createdAt).format('HH:mm')}</span>
      </div>
    </div>
  );
};

const ChatWindow = ({ peerId }: { peerId: string }) => {
  const myId = useAuthStore((s) => s.user?._id);
  const openList = useChatUIStore((s) => s.openList);
  const { isConnected } = useSocket();
  const { startCall, status: callStatus } = useCall();

  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const conversation = conversations?.find((c) => c.peer._id === peerId);
  const peer = conversation?.peer;
  const notAllowed = !loadingConversations && !conversation;

  const { error: openError } = useOpenConversation(notAllowed ? null : peerId);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(
    notAllowed ? null : peerId
  );
  const send = useSendMessage(peerId);
  const { notifyTyping, stopTyping } = useTypingEmitter(peerId);
  const isPeerTyping = usePeerTyping(peerId);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const heightBeforeOlder = useRef<number | null>(null);
  const firstIdRef = useRef<string | undefined>(undefined);

  const messages = useMemo(() => (data ? [...data.pages].reverse().flatMap((p) => p.messages) : []), [data]);

  // Keep position when older history is prepended; otherwise follow new messages.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const firstId = messages[0]?._id;
    const prepended = firstIdRef.current && firstId !== firstIdRef.current && heightBeforeOlder.current !== null;
    if (prepended) {
      el.scrollTop += el.scrollHeight - heightBeforeOlder.current!;
      heightBeforeOlder.current = null;
    } else if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
    firstIdRef.current = firstId;
  }, [messages, isPeerTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 60 && hasNextPage && !isFetchingNextPage) {
      heightBeforeOlder.current = el.scrollHeight;
      fetchNextPage();
    }
  };

  const canSend = Boolean(peer) && !openError && isConnected;
  const canCall = canSend && Boolean(conversation?.online) && callStatus === 'idle';
  const callHint = !isConnected
    ? 'You are offline'
    : !conversation?.online
      ? `${peer?.name ?? 'They'} is offline`
      : callStatus !== 'idle'
        ? 'You are already on a call'
        : undefined;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) notifyTyping();
    else stopTyping();
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content || !canSend) return;
    stickToBottom.current = true;
    send(content);
    setInput('');
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const subtitle = isPeerTyping ? 'typing…' : conversation?.online ? 'Online' : 'Offline';

  return (
    <>
      <div className='fixed '>
        <div className='w-[420px] max-w-[100vw] h-fit fixed bottom-0 right-0 px-5 '>
          <div className='flex flex-col h-[500px] '>
            <div className='flex justify-between p-4 bg-gray-50 items-center h-[50px] rounded-t-xl'>
              <div className='flex gap-3 items-center '>
                <div>
                  <FaArrowLeftLong
                    className='text-gray-400 cursor-pointer'
                    aria-label='Back to conversations'
                    onClick={openList}
                  />
                </div>
                <div className='h-[40px] w-[40px] relative'>
                  <FaCircle
                    className={`${conversation?.online ? 'text-primaryColor2' : 'text-gray-300'} absolute right-[-2px] top-1 size-3 rounded-full border-2 border-[#fff]`}
                  />
                  <img
                    src={peer?.photo || avatarIcon}
                    alt={peer?.name ?? 'Chat contact'}
                    className='h-full w-full object-cover rounded-full border-2 border-[#fff]'
                  />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='font-semibold text-gray-500 text-[15px] '>{peer?.name ?? 'Conversation'}</p>
                  <p className='text-primaryColor text-[12px] font-light '>{peer ? subtitle : ''}</p>
                </div>
              </div>
              <div className='flex gap-5 flex-row text-gray-600 [&>button]:cursor-pointer [&>button:disabled]:cursor-not-allowed [&>button:disabled]:opacity-40'>
                <button
                  type='button'
                  aria-label='Start voice call'
                  title={callHint ?? 'Voice call'}
                  disabled={!canCall}
                  onClick={() => peer && startCall(peer, 'audio')}
                >
                  <IoCallOutline />
                </button>
                <button
                  type='button'
                  aria-label='Start video call'
                  title={callHint ?? 'Video call'}
                  disabled={!canCall}
                  onClick={() => peer && startCall(peer, 'video')}
                >
                  <IoVideocamOutline />
                </button>
                <button type='button' aria-label='More options' title='More options' disabled>
                  <SlOptionsVertical />
                </button>
              </div>
            </div>

            {!isConnected && (
              <div className='bg-yellow-50 text-yellow-800 text-[12px] text-center py-1'>Reconnecting…</div>
            )}

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className='overflow-y-auto p-4 h-[400px] space-y-2 bg-irisBlueColor'
              style={{
                backgroundImage: `url(${chatBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {(notAllowed || openError) && (
                <div className='flex h-full items-center justify-center text-center px-6'>
                  <p className='bg-white/90 rounded-xl px-4 py-3 text-sm text-gray-700'>
                    {openError ?? 'You can only chat with a doctor after booking an appointment.'}
                  </p>
                </div>
              )}

              {(isLoading || loadingConversations) && (
                <div className='flex h-full items-center justify-center'>
                  <HashLoader size={25} color='#0d8c81' />
                </div>
              )}

              {isError && !notAllowed && (
                <p className='text-center text-sm bg-white/90 rounded-xl px-4 py-2'>Couldn&apos;t load messages.</p>
              )}

              {isFetchingNextPage && (
                <div className='flex justify-center py-1'>
                  <HashLoader size={15} color='#0d8c81' />
                </div>
              )}

              {!isLoading && !notAllowed && !openError && messages.length === 0 && peer && (
                <p className='text-center text-[12px] text-gray-700 bg-white/80 rounded-xl px-3 py-2 mx-auto w-fit'>
                  This is the start of your conversation with {peer.name}.
                </p>
              )}

              {messages.map((msg, i) => {
                const mine = msg.senderId === myId;
                const showDay = i === 0 || !dayjs(msg.createdAt).isSame(messages[i - 1].createdAt, 'day');
                const read = mine && msg.readBy.includes(peerId);

                return (
                  <Fragment key={msg._id}>
                    {showDay && (
                      <div className='flex justify-center'>
                        <span className='rounded-full bg-white/80 px-3 py-0.5 text-[11px] text-gray-600'>
                          {dayLabel(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    {msg.type === 'call' ? (
                      <CallLogBubble msg={msg} />
                    ) : (
                      <div className={`flex  ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div>
                          <p
                            onClick={() => msg.failed && send(msg.content, msg)}
                            title={msg.failed ? 'Not sent. Tap to retry.' : undefined}
                            className={`max-w-xs px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words
              ${mine ? 'bg-primaryColor2 text-white' : 'bg-white text-black'} ${msg.failed ? 'opacity-60 cursor-pointer' : ''}`}
                          >
                            {msg.content}
                          </p>
                          <span
                            className={`text-[10px] text-gray-700 flex gap-2 ${mine ? 'justify-between' : 'justify-start'}`}
                          >
                            {mine && (
                              <p aria-label={msg.failed ? 'Failed' : msg.pending ? 'Sending' : read ? 'Read' : 'Sent'}>
                                {msg.failed ? (
                                  <MdErrorOutline size={15} className='text-red-600' />
                                ) : msg.pending ? (
                                  <LuClock size={13} />
                                ) : read ? (
                                  <LuCheckCheck color='#0d8c81' size={15} />
                                ) : (
                                  <LuCheck size={15} />
                                )}
                              </p>
                            )}
                            <p>{dayjs(msg.createdAt).format('HH:mm')}</p>
                          </span>
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}

              {isPeerTyping && peer && (
                <div className='flex justify-start'>
                  <div className='bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-500'>{peer.name} is typing…</div>
                </div>
              )}
            </div>

            <div className='py-2 px-4 gap-2 z-2 grid grid-cols-12 items-center bg-white'>
              <div className='col-span-1 ml-1'>
                <GrEmoji className='size-8 opacity-40' title='Coming soon' aria-hidden />
              </div>
              <div className='col-span-9'>
                <textarea
                  className='h-10 rounded-xl px-4 py-2 text-sm leading-5 outline-none resize-none overflow-hidden w-full bg-white disabled:cursor-not-allowed'
                  rows={1}
                  value={input}
                  maxLength={MAX_LENGTH}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onBlur={stopTyping}
                  disabled={!peer || Boolean(openError)}
                  placeholder={isConnected ? 'Type a message…' : 'Waiting for connection…'}
                  aria-label='Message'
                />
              </div>
              <div className='col-span-2 flex gap-x-2 [&>*]:size-8 justify-center '>
                {input.trim().length ? (
                  <button
                    type='button'
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label='Send message'
                    className='cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
                  >
                    <IoMdSend className='text-gray-500 size-8' />
                  </button>
                ) : (
                  <>
                    <GrAttachment className='text-gray-500 opacity-40' title='Coming soon' aria-hidden />
                    <AiOutlineAudio
                      className='bg-red-600 p-2 rounded-full text-white opacity-40'
                      title='Coming soon'
                      aria-hidden
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
