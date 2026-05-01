import { create } from 'zustand';
import { getMessages, sendMessage as apiSendMessage } from '../services/api';

interface Message {
  _id: string;
  sender: { username: string; email?: string; _id: string };
  text: string;
  createdAt: string;
  room?: string;
}

interface ChatState {
  messages: Message[];
  selectedRoom: string | null;
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  addMessage: (message: Message) => void;
  setSelectedRoom: (roomId: string | null) => void;
  fetchMessages: (roomId?: string) => Promise<void>;
  sendMessage: (text: string, roomId?: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  setMessages: (messages) => set((state) => ({
    messages: typeof messages === 'function' ? messages(state.messages) : messages
  })),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setSelectedRoom: (roomId) => set({ selectedRoom: roomId, messages: [] }),
  fetchMessages: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMessages(roomId);
      set({ messages: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch messages', isLoading: false });
    }
  },
  sendMessage: async (text, roomId) => {
    try {
      await apiSendMessage({ text, roomId });
      // Depending on if you want optimistic updates or wait for socket:
      // set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to send message' });
    }
  }
}));
