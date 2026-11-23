import { FaArrowLeftLong } from 'react-icons/fa6';
import { GoBell } from 'react-icons/go';
import HashLoader from 'react-spinners/HashLoader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import avatarIconAsset from '@/assets/images/avatar-icon.png';
import { truncateText } from '@/utils/helperFunctions';
import { useConversations } from '@/Hook/useChat';
import { useChatUIStore } from '@/store/chatUIStore';
import { useAuthStore } from '@/store/authStore';
import type { Conversation } from '@/types/chat';
import CallAlertsPrompt from '@/components/Call/CallAlertsPrompt';

const avatarIcon: string = avatarIconAsset.src;

dayjs.extend(relativeTime);

const preview = (c: Conversation, myId?: string) => {
  if (!c.lastMessage) return c.peer.specialization ? `${c.peer.specialization} · Say hello 👋` : 'Say hello 👋';
  const { type, senderId, content } = c.lastMessage;
  const prefix = type !== 'call' && senderId === myId ? 'You: ' : '';
  const icon = type === 'voice' ? '🎤 ' : type === 'file' ? '📎 ' : '';
  return prefix + icon + content;
};

const ChatList = () => {
  const { data: conversations, isLoading, isError, refetch } = useConversations();
  const close = useChatUIStore((s) => s.close);
  const openRoom = useChatUIStore((s) => s.openRoom);
  const user = useAuthStore((s) => s.user);

  return (
    <div className='fixed '>
      <div className='max-w-[calc(100vw-2.5rem)] w-[400px] h-fit fixed bottom-0 right-0  rounded-t-xl mr-5 p-5  bg-white'>
        <div className='flex flex-col h-[400px] overflow-auto'>
          <div className='flex gap-4 items-center'>
            <FaArrowLeftLong className='cursor-pointer' aria-label='Close chat' onClick={close} />
            <p>Call and Meeting</p>
          </div>

          <CallAlertsPrompt />

          {isLoading && (
            <div className='flex flex-1 items-center justify-center'>
              <HashLoader size={25} color='#0d8c81' />
            </div>
          )}

          {isError && (
            <div className='flex flex-1 flex-col items-center justify-center gap-2 text-sm text-gray-500'>
              <p>Couldn&apos;t load your conversations.</p>
              <button className='text-primaryColor font-semibold cursor-pointer' onClick={() => refetch()}>
                Try again
              </button>
            </div>
          )}

          {conversations?.length === 0 && (
            <div className='flex flex-1 flex-col items-center justify-center text-center gap-2 px-6 text-sm text-gray-500'>
              <GoBell className='size-6 text-primaryColor' />
              {user?.role === 'doctor' ? (
                <p>Patients who book an appointment with you will appear here.</p>
              ) : (
                <p>Book an appointment with a doctor to start chatting and calling.</p>
              )}
            </div>
          )}

          {conversations?.map((c) => (
            <div
              key={c.peer._id}
              role='button'
              tabIndex={0}
              className='cursor-pointer bg-gray-100 rounded-xl mt-3 flex flex-col gap-2 p-2 '
              onClick={() => openRoom(c.peer._id)}
              onKeyDown={(e) => e.key === 'Enter' && openRoom(c.peer._id)}
            >
              <div className='flex items-center justify-between'>
                <div className='w-[50px] h-[50px] rounded-full border-2 border-solid border-white '>
                  <img
                    src={c.peer.photo || avatarIcon}
                    alt={`${c.peer.name} CareConnect chat-image`}
                    className='h-full w-full object-cover rounded-full'
                  />
                </div>
                <div className='flex flex-col justify-center items-end'>
                  <p className='text-gray-700 text-[13px] '>{c.peer.name}</p>
                  <p className={`text-[12px] ${c.online ? 'text-primaryColor' : 'text-gray-500'}`}>
                    {c.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center justify-between gap-2'>
                  <p
                    className={`text-[12px] italic ${c.unreadCount ? 'text-primaryColor font-extrabold' : 'text-gray-600'}`}
                  >
                    {truncateText(preview(c, user?._id), 40)}
                  </p>
                  {c.unreadCount > 0 && (
                    <span
                      className='relative p-1 rounded-full h-6 w-6 flex items-center justify-center'
                      aria-label={`${c.unreadCount} unread`}
                    >
                      <GoBell className='font-extrabold size-3' />
                      <p className='absolute bottom-2 font-extrabold left-2.5  text-primaryColor text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        {c.unreadCount > 9 ? '9+' : c.unreadCount}
                      </p>
                    </span>
                  )}
                </div>
                {c.lastMessage && (
                  <p className='text-gray-500 text-[10px] '>{dayjs(c.lastMessage.createdAt).fromNow()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
