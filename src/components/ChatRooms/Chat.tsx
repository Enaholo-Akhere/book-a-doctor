import io from 'socket.io-client';

const ChatRoom = () => {
  const socket = io('http://localhost:3000');

  socket.on('connect', () => {
    console.log('Connected:', socket.id);

    socket.emit('message', {
      text: 'Hello from client',
    });
  });

  socket.on('welcome', (data) => {
    console.log(data);
  });

  socket.on('message', (data) => {
    console.log('New message:', data);
  });
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default ChatRoom;
