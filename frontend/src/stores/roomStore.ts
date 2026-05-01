import { create } from 'zustand';
import { getRooms, createRoom } from '../services/api';

interface RoomState {
  rooms: any[];
  isLoading: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  addRoom: (name: string, createdBy: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  isLoading: false,
  error: null,
  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRooms();
      set({ rooms: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load rooms', isLoading: false });
    }
  },
  addRoom: async (name, createdBy) => {
    try {
      const newRoom = await createRoom(name, createdBy);
      set((state) => ({ rooms: [...state.rooms, newRoom] }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create room' });
    }
  }
}));
