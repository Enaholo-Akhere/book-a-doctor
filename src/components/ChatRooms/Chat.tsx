// components/Chat/ChatWindow.tsx
import { useSocket } from '@/Hook/useSockets';
import { useEffect, useRef, useState } from 'react';
import api from '@/library/api/axios';

// your configured axios instance

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

const ChatWindow = ({
  currentUserId,
  otherUser,
}: {
  currentUserId: string;
  otherUser: { id: string; name: string };
}) => {
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
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm
              ${
                msg.senderId === currentUserId
                  ? 'bg-teal-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
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

      <div className='border-t p-3 flex gap-2'>
        <input
          className='flex-1 border rounded-full px-4 py-2 text-sm outline-none'
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder='Type a message…'
        />
        <button
          onClick={handleSend}
          className='bg-teal-700 text-white px-4 py-2 rounded-full text-sm'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
