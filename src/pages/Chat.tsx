import ChatWindow from '@/components/ChatRooms/Chat';
import { usePageTitle } from '@/Hook/useTitle';

const Chat = () => {
  usePageTitle('Chat - CareConnect');

  return (
    <section>
      <ChatWindow
        currentUserId='ghjv7hg8'
        otherUser={{ id: '6657g', name: 'hghfg6' }}
      />
    </section>
  );
};

export default Chat;
