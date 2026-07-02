// import { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import Modal from '../modal';

interface chatRoomInterface {
  showChat: string;
  setShowChat: (str: string) => void;
  openModal: boolean;
  setOpenModal: (bl: boolean) => void;
}

const ChatRoom = ({
  showChat,
  setShowChat,
  openModal,
  setOpenModal,
}: chatRoomInterface) => {
  //   const [showChat, setShowChat] = useState<string>('chatList');
  //   const [openModal, setOpenModal] = useState<boolean>(false);
  console.log('show chat room', showChat);

  return (
    <Modal onClose={() => setOpenModal(false)} isOpen={openModal}>
      {showChat === 'chatRoom' && (
        <ChatWindow
          currentUserId=''
          otherUser={{ id: '3ewdfr', name: 'John Doe' }}
          setShowChat={setShowChat}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      )}
      {showChat === 'chatList' && (
        <ChatList
          currentUserId=''
          otherUser={{ id: '3ewdfr', name: 'John Doe' }}
          setShowChat={setShowChat}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      )}
    </Modal>
  );
};

export default ChatRoom;
