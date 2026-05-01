import { useQuery } from '@tanstack/react-query';
import { getRooms, getFriends } from '../services/api';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { Hash, Users, Home } from 'lucide-react';

interface ListProps {
  type: 'rooms' | 'friends';
}

export default function List({ type }: ListProps) {
  const { selectedRoom, setSelectedRoom } = useChatStore();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: [type, user?._id],
    queryFn: () => type === 'rooms' ? getRooms() : getFriends(user?._id || ''),
    enabled: type === 'rooms' || !!user?._id,
  });

  const listData = (data as any[]) || [];

  return (
    <div className="h-full flex flex-col bg-transparent">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          {/* Global Room / Special Option */}
          {type === 'rooms' && (
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start h-auto py-3 px-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  selectedRoom === null 
                    ? 'bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/5 ring-1 ring-white/10' 
                    : 'text-slate-400 hover:bg-white/3 hover:text-white'
                }`}
                onClick={() => setSelectedRoom(null)}
              >
                <div className="flex items-center gap-4 w-full relative z-10">
                  <div className={`p-2 rounded-xl transition-all duration-500 ${
                    selectedRoom === null 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rotate-12 scale-110' 
                      : 'bg-white/5 text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
                  }`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-black text-[10px] uppercase tracking-widest leading-none">Nexus Prime</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Universal Uplink</p>
                  </div>
                  {selectedRoom === null && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse" />
                  )}
                </div>
              </Button>
            </motion.div>
          )}

          {/* Section Divider */}
          <div className="flex items-center gap-4 px-4 py-2">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">
              {type === 'rooms' ? 'Active Channels' : 'Available Nodes'}
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : listData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
              <div className="p-3 bg-muted/50 rounded-2xl mb-3">
                {type === 'rooms' ? <Hash className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Empty List
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {listData.map((item: any) => (
                <motion.div
                  key={item._id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-auto py-3 px-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                      selectedRoom === item._id 
                        ? 'bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/5 ring-1 ring-white/10' 
                        : 'text-slate-400 hover:bg-white/3 hover:text-white'
                    }`}
                    onClick={() => setSelectedRoom(item._id)}
                  >
                    <div className="flex items-center gap-4 w-full relative z-10">
                      <div className="relative">
                        <Avatar className={`h-10 w-10 rounded-2xl transition-all duration-500 ${
                          selectedRoom === item._id ? 'scale-105 ring-2 ring-indigo-500/20' : 'group-hover:scale-105'
                        }`}>
                          <AvatarImage src={item.avatar || item.profilePic} />
                          <AvatarFallback className={`rounded-2xl text-[11px] font-black tracking-tight ${
                            selectedRoom === item._id 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-white/5 text-slate-500'
                          }`}>
                            {type === 'rooms' 
                              ? item.name?.[0]?.toUpperCase() 
                              : item.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {item.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[3px] border-obsidian shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-black text-[10px] uppercase tracking-widest truncate leading-none">
                          {type === 'rooms' ? item.name : item.username}
                        </p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5 truncate">
                          {type === 'rooms' 
                            ? `${item.memberCount || 0} SECTOR NODES` 
                            : 'ENCRYPTED CHANNEL'}
                        </p>
                      </div>
                      {selectedRoom === item._id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}