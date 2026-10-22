import { useDispatch } from 'react-redux';
import { addMessages, addNewMessages, createNewChat, setChats, setCurrentChatId, setLoading } from '../chat.slice';
import { getChats, getMessages, sendMessages } from '../service/chat.api';
import { initializeSocketConnection } from '../service/chat.socket';

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    const data = await sendMessages({ message, chatId });
    const { chat, aiMessage } = data;
    const activeChatId = chatId || chat._id;

    if (!chatId) {
      dispatch(createNewChat({
        chatId: chat._id,
        title: chat.title,
      }));
    }

    dispatch(addNewMessages({
      chatId: activeChatId,
      content: message,
      role: 'user',
    }));

    dispatch(addNewMessages({
      chatId: activeChatId,
      content: aiMessage.content,
      role: aiMessage.role,
    }));

    dispatch(setCurrentChatId(activeChatId));
    dispatch(setLoading(false));
  }


  async function handleGetChats() {
    dispatch(setLoading(true));
    try {
      const { chats } = await getChats();
      dispatch(setChats(chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };
        return acc;
      }, {})));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    if (!Array.isArray(chats[chatId]?.messages) || chats[chatId].messages.length === 0) {
      const { messages } = await getMessages(chatId);
      dispatch(addMessages({
        chatId,
        messages: messages.map(({ content, role }) => ({ content, role })),
      }));
    }
    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
