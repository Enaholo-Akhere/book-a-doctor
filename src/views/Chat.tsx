'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChatUIStore } from '@/store/chatUIStore';
import Button from '@/components/Button';

/**
 * /users/chat and /dashboard/chat. Opens the chat widget, optionally straight
 * into a conversation: /users/chat?with=<doctorId>.
 */
const Chat = () => {
  const params = useSearchParams();
  const peerId = params.get('with');
  const isOpen = useChatUIStore((s) => s.isOpen);
  const openList = useChatUIStore((s) => s.openList);
  const openRoom = useChatUIStore((s) => s.openRoom);

  useEffect(() => {
    if (peerId) openRoom(peerId);
    else openList();
  }, [peerId, openRoom, openList]);

  return (
    <section className='container min-h-[50vh] flex flex-col items-center justify-center gap-4'>
      <h2 className='heading text-center'>Messages</h2>
      <p className='text__para text-center'>Chat and call with your care team in real time.</p>
      {!isOpen && <Button title='Open messages' onClick={openList} />}
    </section>
  );
};

export default Chat;
