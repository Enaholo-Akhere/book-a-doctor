// components/Chat/ChatWindow.tsx
import { useSocket } from '@/Hook/useSockets';
import { useEffect, useRef, useState } from 'react';
import api from '@/library/api/axios';
import Button from '../Button';
import { MockMessage } from '@/assets/data/chat-data';
import chatBg from '@/assets/images/chat-bg.png';
import { LuCheck } from 'react-icons/lu';
import { LuCheckCheck } from 'react-icons/lu';
import { IoMdSend } from 'react-icons/io';

// your configured axios instance

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  currentUserId: string;
}

const ChatWindow = ({
  // currentUserId,
  otherUser,
}: {
  currentUserId: string;
  otherUser: { id: string; name: string };
}) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);

  const { socket, joinRoom, sendMessage, sendTyping } = useSocket();

  // Load history + join room on mount
  useEffect(() => {
    api
      .get(`/chat/${otherUser.id}/history`)
      .then((res) => setMessages(res.data.messages));

    joinRoom(otherUser.id);
  }, [joinRoom, otherUser.id]);

  // Listen for incoming messages and typing events
  useEffect(() => {
    if (!socket) return;

    socket.on('message:receive', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing:update', ({ userId, isTyping }) => {
      if (userId === otherUser.id) setIsOtherTyping(isTyping);
    });

    return () => {
      socket.off('message:receive');
      socket.off('typing:update');
    };
  }, [socket, otherUser.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTyping(otherUser.id, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => sendTyping(otherUser.id, false),
      1500
    );
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    sendMessage(otherUser.id, content);
    setInput('');
    sendTyping(otherUser.id, false);
  };

  return (
    <div
      className={`${showChat && 'fixed inset-0 bg-black/30 backdrop-blur-xs'}`}
    >
      <div className='max-w-[600px] fixed bottom-0 right-0 z-2 '>
        <div className='m-4'>
          <Button
            title={showChat ? 'Close Chat' : 'Chat Doctor'}
            onClick={() => setShowChat((prev) => !prev)}
          />
        </div>
        {showChat && (
          <div className='grid grid-cols-12 gap-4 z'>
            <div className='col-span-4  z-100 bg-white rounded-xl p-2'>
              Chat A Doctor
            </div>
            <div className='col-span-8'>
              <div className='flex flex-col h-full'>
                {/* <div className='flex-1 overflow-y-auto p-4 space-y-2 h-[400px] border-4 border-red-600'> */}
                <div
                  className='overflow-y-auto p-4 space-y-2 h-[300px] border-2 border-gray-400 rounded-xl bg-irisBlueColor'
                  style={{
                    backgroundImage: `url(${chatBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {MockMessage.map((msg, i) => (
                    <div
                      key={msg._id}
                      className={`flex  ${msg.senderId === msg.currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div>
                        <p
                          className={`max-w-xs px-4 py-2 rounded-2xl text-sm
              ${
                msg.senderId === msg.currentUserId
                  ? 'bg-irisBlueColor text-white'
                  : 'bg-primaryColor2 text-white'
              }`}
                        >
                          {msg.content}
                        </p>
                        <span className='text-[10px] text-gray-700 flex justify-between'>
                          <p>
                            {i % 2 === 0 ? (
                              <LuCheck size={15} />
                            ) : (
                              <LuCheckCheck color='#0d8c81' size={15} />
                            )}
                          </p>
                          <p>{msg.createdAt}</p>
                        </span>
                      </div>
                    </div>
                  ))}
                  {isOtherTyping && (
                    <div className='flex justify-start'>
                      <div className='bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-500'>
                        {otherUser.name} is typing…
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className=' p-2 flex gap-2 z-2'>
                  <textarea
                    className='flex-1 border rounded-full px-4 py-2 text-sm
            outline-none overflow-hidden resize-none bg-white'
                    value={input}
                    onChange={handleInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder='Type a message…'
                  ></textarea>
                  <button
                    onClick={handleSend}
                    className='bg-teal-700 text-white px-4 py-4 rounded-full m-auto text-sm'
                  >
                    <IoMdSend color='white' size={30} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
