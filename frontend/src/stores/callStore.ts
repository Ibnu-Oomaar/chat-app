import { create } from 'zustand';
import Peer from 'simple-peer';
import socket from '../services/socket';

interface CallState {
  isCalling: boolean;
  isReceivingCall: boolean;
  isConnected: boolean;
  callerId: string | null;
  callerName: string | null;
  callerSignal: any;
  userStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peer: Peer.Instance | null;
  targetUserId: string | null;
  
  callUser: (targetUserId: string, targetName: string, myUserId: string) => void;
  answerCall: () => void;
  endCall: (otherUserId?: string) => void;
  setStream: (stream: MediaStream) => void;
  initSocketListeners: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  isCalling: false,
  isReceivingCall: false,
  isConnected: false,
  callerId: null,
  callerName: null,
  callerSignal: null,
  userStream: null,
  remoteStream: null,
  peer: null,
  targetUserId: null,

  setStream: (stream) => set({ userStream: stream }),

  initSocketListeners: () => {
    socket.on('incoming_call', (data) => {
      set({
        isReceivingCall: true,
        callerId: data.from, // This should be the userId
        callerName: data.name,
        callerSignal: data.signal,
      });
    });

    socket.on('call_accepted', (signal) => {
      const { peer } = get();
      if (peer) {
        set({ isConnected: true });
        peer.signal(signal);
      }
    });

    socket.on('call_ended', () => {
      get().endCall();
    });
  },

  callUser: (targetId, targetName, myUserId) => {
    const { userStream } = get();
    if (!userStream) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: userStream,
    });

    peer.on('signal', (data) => {
      socket.emit('call_user', {
        userToCall: targetId,
        signalData: data,
        from: myUserId,
        name: targetName,
      });
    });

    peer.on('stream', (stream) => {
      set({ remoteStream: stream, isConnected: true });
    });

    set({ isCalling: true, targetUserId: targetId, peer });
  },

  answerCall: () => {
    const { userStream, callerSignal, callerId } = get();
    if (!userStream || !callerId) return;

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: userStream,
    });

    peer.on('signal', (data) => {
      socket.emit('answer_call', { signal: data, to: callerId });
    });

    peer.on('stream', (stream) => {
      set({ remoteStream: stream, isConnected: true });
    });

    peer.signal(callerSignal);
    set({ peer, isConnected: true, isReceivingCall: false });
  },

  endCall: (otherUserId) => {
    const { peer, userStream, targetUserId, callerId } = get();
    
    // Notify the other user if we are the one ending it
    const recipientId = otherUserId || targetUserId || callerId;
    if (recipientId) {
      socket.emit('end_call', { to: recipientId });
    }

    if (peer) {
      try { peer.destroy(); } catch (e) {}
    }
    
    if (userStream) {
      userStream.getTracks().forEach(track => track.stop());
    }

    set({
      isCalling: false,
      isReceivingCall: false,
      isConnected: false,
      callerId: null,
      callerName: null,
      callerSignal: null,
      remoteStream: null,
      peer: null,
      targetUserId: null,
      userStream: null
    });
  },
}));
