// components/Chat/ChatWindow.tsx
import { useSocket } from '@/Hook/useSockets';
import { useEffect, useRef, useState } from 'react';
import api from '@/library/api/axios';
// import Button from '../Button';
import { MockMessage } from '@/assets/data/chat-data';
import chatBg from '@/assets/images/chat-bg.png';
import { LuCheck } from 'react-icons/lu';
import { LuCheckCheck } from 'react-icons/lu';
import { IoMdSend } from 'react-icons/io';
import { FaArrowLeftLong } from 'react-icons/fa6';
import imageUrl from '@/assets/images/daniel.jpg';
import { FaCircle } from 'react-icons/fa';
import { IoCallOutline } from 'react-icons/io5';
import { IoVideocamOutline } from 'react-icons/io5';
import { SlOptionsVertical } from 'react-icons/sl';
import { GrAttachment } from 'react-icons/gr';
import { GrEmoji } from 'react-icons/gr';
import { AiOutlineAudio } from 'react-icons/ai';

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
  setShowChat,
  // openModal,
  // setOpenModal,
}: {
  currentUserId: string;
  otherUser: { id: string; name: string };
  setShowChat: (str: string) => void;
  openModal: boolean;
  setOpenModal: (opM: boolean) => void;
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
    <>
      <div className='fixed '>
        <div className='max-w-[600px] w-fit h-fit fixed bottom-0 right-0 px-5 '>
          <div className='flex flex-col h-[500px] '>
            {/* <div className='flex-1 overflow-y-auto p-4 space-y-2 h-[400px] border-4 border-red-600'> */}
            <div className='flex justify-between p-4 bg-gray-50 items-center h-[50px] rounded-t-xl'>
              <div className='flex gap-3 items-center '>
                <div>
                  <FaArrowLeftLong
                    className='text-gray-400'
                    onClick={() => setShowChat('chatList')}
                  />
                </div>
                <div className='h-[40px] w-[40px] relative'>
                  <FaCircle className='text-primaryColor2 absolute right-[-2px] top-1 size-3 rounded-full border-2 border-[#fff]' />

                  <img
                    src={imageUrl}
                    className='h-full w-full object-contain rounded-full border-2 border-[#fff]'
                  />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='font-semibold text-gray-500 text-[15px] '>
                    Gina David
                  </p>
                  <p className='text-primaryColor text-[12px] font-light '>
                    Online
                  </p>
                </div>
              </div>
              <div className='flex gap-5 flex-row text-gray-600 [&>*]:cursor-pointer '>
                <IoCallOutline />
                <IoVideocamOutline />
                <SlOptionsVertical />
              </div>
            </div>
            <div
              className='overflow-y-auto p-4 h-[400px] space-y-2 bg-irisBlueColor'
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
                  ? 'bg-primaryColor2 text-white'
                  : 'bg-white text-black'
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
            <div className='py-2 px-4 gap-2 z-2 grid grid-cols-12 items-center bg-white'>
              <div className='col-span-1 ml-1'>
                <GrEmoji className=' cursor-pointer size-8 ' />
              </div>
              <div className='col-span-9'>
                <textarea
                  className='h-10 rounded-xl px-4 py-2 text-sm leading-5 outline-none resize-none overflow-hidden w-full bg-white'
                  rows={1}
                  // className='flex-1 px-4 py-2 text-sm outline-none overflow-hidden resize-none bg-white'
                  value={input}
                  onChange={handleInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder='Type a message…'
                />
              </div>
              <div className='col-span-2 flex gap-x-2 [&>*]:size-8 [&>*]:cursor-pointer justify-center '>
                {input.length ? (
                  <IoMdSend className='text-gray-500' />
                ) : (
                  <>
                    <GrAttachment className='text-gray-500 ' />
                    <AiOutlineAudio className='bg-red-600 p-2 rounded-full text-white' />
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
