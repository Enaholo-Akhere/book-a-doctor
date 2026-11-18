import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import Modal from '../modal';
import { useChatUIStore } from '@/store/chatUIStore';
import { useAuthStore } from '@/store/authStore';

/** Floating chat widget. Mounted once app-wide; driven by useChatUIStore. */
const ChatRoom = () => {
  const role = useAuthStore((s) => s.user?.role);
  const isOpen = useChatUIStore((s) => s.isOpen);
  const view = useChatUIStore((s) => s.view);
  const activePeerId = useChatUIStore((s) => s.activePeerId);
  const close = useChatUIStore((s) => s.close);

  if (role !== 'patient' && role !== 'doctor') return null;

  return (
    <Modal onClose={close} isOpen={isOpen}>
      {view === 'room' && activePeerId ? <ChatWindow key={activePeerId} peerId={activePeerId} /> : <ChatList />}
    </Modal>
  );
};

export default ChatRoom;
