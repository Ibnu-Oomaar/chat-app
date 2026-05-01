import { create } from 'zustand';
import { 
    getFriends, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    getPendingRequests 
} from '../services/api';

interface FriendState {
  friends: any[];
  pendingRequests: any[];
  isLoading: boolean;
  error: string | null;
  fetchFriends: (userId: string) => Promise<void>;
  fetchPendingRequests: (userId: string) => Promise<void>;
  sendRequest: (requesterId: string, receiverId: string) => Promise<void>;
  acceptRequest: (requestId: string, userId: string) => Promise<void>;
  rejectRequest: (requestId: string, userId: string) => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  pendingRequests: [],
  isLoading: false,
  error: null,

  fetchFriends: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getFriends(userId);
      set({ friends: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load friends', isLoading: false });
    }
  },

  fetchPendingRequests: async (userId) => {
    try {
      const data = await getPendingRequests(userId);
      set({ pendingRequests: data });
    } catch (err: any) {
      console.error("Failed to load pending requests", err);
    }
  },

  sendRequest: async (requesterId, receiverId) => {
    try {
      await sendFriendRequest(requesterId, receiverId);
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to send friend request' });
      throw err;
    }
  },

  acceptRequest: async (requestId, userId) => {
    try {
      await acceptFriendRequest(requestId);
      await get().fetchFriends(userId);
      await get().fetchPendingRequests(userId);
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to accept request' });
    }
  },

  rejectRequest: async (requestId, userId) => {
    try {
      await rejectFriendRequest(requestId);
      await get().fetchPendingRequests(userId);
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to reject request' });
    }
  }
}));
