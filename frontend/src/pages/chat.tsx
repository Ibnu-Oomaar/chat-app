import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../services/api";
import socket from "../services/socket";
import { useAuthStore } from "../stores/authStore";
import { useChatStore } from "../stores/chatStore";
import ChatHeader from "../components/ChatHeader";
import List from "../components/List";
import MessageItem from "../components/MessageItem";
import MessageInput from "../components/MessageInput";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";

import { Loader2, MessageSquare, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { user } = useAuthStore();
  const { selectedRoom, messages, setMessages, addMessage } = useChatStore();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', selectedRoom],
    queryFn: () => getMessages(selectedRoom || undefined),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on('message', (newMessage: any) => {
      if (newMessage.room === selectedRoom || (!selectedRoom && !newMessage.room)) {
        addMessage(newMessage);
      }
    });
    return () => {
      socket.off('message');
    };
  }, [selectedRoom, addMessage]);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage({ text, roomId: selectedRoom || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedRoom] });
    },
  });

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMutation.mutate(text);
    socket.emit("message", { 
      text, 
      room: selectedRoom, 
      sender: { username: user?.username } 
    });
  };

  if (!user) return null;

  return (
    <div className="h-full w-full flex bg-obsidian overflow-hidden p-4 gap-4 relative">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[120px] rounded-full"
        />
      </div>

      {/* Floating Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 h-full hidden lg:flex flex-col z-10 rounded-4xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5"
      >
        <div className="px-6 py-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-black text-xs text-white uppercase tracking-[0.25em]">Channels</h2>
          </div>
          <Badge className="bg-white/10 hover:bg-white/20 text-white border-none text-[9px] font-black h-5 px-2 rounded-lg backdrop-blur-md">
            {selectedRoom ? 'LOCKED' : 'LIVE'}
          </Badge>
        </div>
        
        <div className="flex-1 overflow-hidden p-3">
          <List type="rooms" />
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 group cursor-pointer hover:bg-white/5 transition-all duration-500">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Encrypted Core</span>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col h-full rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden z-10 relative ring-1 ring-white/5"
      >
        {/* Header */}
        <div className="z-20 bg-white/2 border-b border-white/5 backdrop-blur-xl">
          <ChatHeader 
            roomName={selectedRoom ? `#${selectedRoom}` : 'Global Terminal'} 
          />
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-2">
          <div className="max-w-4xl mx-auto w-full px-6 py-12">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-[55vh] space-y-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all duration-1000" />
                    <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Syncing Streams</p>
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col justify-center items-center h-[55vh] text-center"
                >
                  <div className="w-28 h-28 bg-linear-to-br from-white/5 to-white/1 rounded-[3rem] flex items-center justify-center mb-10 border border-white/10 shadow-3xl relative group">
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-700 rounded-[3rem]" />
                    <MessageSquare className="w-12 h-12 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4">
                    Silence in the Cloud
                  </h3>
                  <p className="text-sm text-slate-500 max-w-[340px] font-medium leading-relaxed uppercase tracking-wide">
                    The data buffers are empty. Initiate the first transmission in {selectedRoom ? `#${selectedRoom}` : 'the Global Core'}.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: Math.min(index * 0.005, 0.3), 
                        type: "spring", 
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <MessageItem
                        message={msg}
                        isOwn={msg.sender?.username === user.username}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Container */}
        <div className="p-8 bg-linear-to-t from-black/40 to-transparent border-t border-white/5 backdrop-blur-3xl">
          <div className="max-w-4xl mx-auto w-full relative">
            <AnimatePresence>
              {sendMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-14 left-0 right-0 flex justify-center"
                >
                  <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-md shadow-xl">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      </div>
                      Uplink Active
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
              <MessageInput 
                onSend={handleSend} 
                disabled={sendMutation.isPending}
                placeholder={selectedRoom ? `Transmit to #${selectedRoom}...` : "Command Global Network..."}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}