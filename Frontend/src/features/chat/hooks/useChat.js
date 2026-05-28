import { initializeSocketConnection } from '../service/chat.socket';

export const useChat = () => {
  // Initialize the Socket.IO connection when the hook is used
  return {
    initializeSocketConnection
  };
};