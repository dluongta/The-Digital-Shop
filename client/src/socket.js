import { io } from 'socket.io-client';

const socket = io('https://the-digital-shop.onrender.com/', {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
