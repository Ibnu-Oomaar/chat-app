import { create } from 'zustand';
import { updateStatus, getOnlineUsers } from '../services/api';

interface StatusState {
  onlineUsers: any[];
  isLoading: boolean;
  fetchOnlineUsers: () => Promise<void>;
  setUserStatus: (userId: string, isOnline: boolean) => Promise<void>;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  onlineUsers: [],
  isLoading: false,
  fetchOnlineUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await getOnlineUsers();
      set({ onlineUsers: users, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to load online users", error);
    }
  },
  setUserStatus: async (userId, isOnline) => {
    try {
      await updateStatus(userId, isOnline);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  },
  addOnlineUser: (userId) => set((state) => ({ 
    onlineUsers: [...state.onlineUsers.filter(u => u._id !== userId || u.userId?._id !== userId), { userId: { _id: userId } }] 
  })),
  removeOnlineUser: (userId) => set((state) => ({ 
    onlineUsers: state.onlineUsers.filter(u => u.userId?._id !== userId && u._id !== userId) 
  }))
}));
