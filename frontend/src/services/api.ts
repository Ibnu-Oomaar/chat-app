import axios from 'axios';

const BASE_URL = "http://localhost:6030/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// MESSAGES
export const getMessages = async (roomId?: string) => {
  const res = await api.get(`/message/${roomId}`);
  return res.data;
};

export const sendMessage = async (data: { text: string; roomId?: string }) => {
  const res = await api.post('/message', data);
  return res.data;
};

// FRIENDS
export const getFriends = async (userId: string) => {
  const res = await api.get(`/friends/${userId}`);
  return res.data;
};

export const sendFriendRequest = async (requesterId: string, receiverId: string) => {
  const res = await api.post('/friends/request', { requester: requesterId, receiver: receiverId });
  return res.data;
};

export const acceptFriendRequest = async (requestId: string) => {
  const res = await api.put(`/friends/accept/${requestId}`);
  return res.data;
};

export const rejectFriendRequest = async (requestId: string) => {
  const res = await api.delete(`/friends/reject/${requestId}`);
  return res.data;
};

export const getPendingRequests = async (userId: string) => {
  const res = await api.get(`/friends/pending/${userId}`);
  return res.data;
};

// ROOMS
export const getRooms = async () => {
  const res = await api.get('/rooms');
  return res.data;
};

export const createRoom = async (name: string, createdBy: string) => {
  const res = await api.post('/rooms', { name, createdBy });
  return res.data;
};

// STATUS
export const updateStatus = async (userId: string, isOnline: boolean) => {
  const res = await api.post('/status/update', { userId, isOnline });
  return res.data;
};

export const getOnlineUsers = async () => {
  const res = await api.get('/status/online');
  return res.data;
};

// USERS & SEARCH
export const searchUsers = async (query: string) => {
  const res = await api.get(`/users/users?q=${query}`);
  return res.data;
};

// PROFILE
export const getProfile = async (userId: string) => {
  const res = await api.get(`/profile/${userId}`);
  return res.data;
};

export const updateProfile = async (userId: string, formData: FormData) => {
  const res = await api.put(`/profile/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};