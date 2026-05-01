import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface Message {
  _id: string;
  sender: { 
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showStatus?: boolean;
}

export default function MessageItem({ message, isOwn, showStatus = true }: MessageItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getMessageStatus = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2 px-2 py-1 group/item ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {/* Sender Avatar - More Compact */}
      {!isOwn && (
        <Avatar className="h-8 w-8 rounded-xl mt-1 border border-white/10 shadow-lg shrink-0 relative z-10">
          <AvatarImage src={message.sender?.avatar} />
          <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase">
            {message.sender?.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content Container */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%] gap-0.5`}>
        {/* Sender Name - Minimalist */}
        {!isOwn && (
          <span className="text-[10px] font-bold text-muted-foreground/60 ml-2 uppercase tracking-tighter">
            {message.sender?.username}
          </span>
        )}

        {/* Message Bubble - High Fidelity Geometry */}
        <div className="relative group/message max-w-full">
          <div className={`
            px-4 py-2 rounded-2xl shadow-xl transition-all duration-300
            ${isOwn
              ? 'bg-primary text-white rounded-tr-none border border-white/10 shadow-indigo-500/10 hover:shadow-indigo-500/20'
              : 'bg-white/3 text-slate-100 rounded-tl-none border border-white/5 hover:border-white/10'
            }
          `}>
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap wrap-break-word font-medium tracking-tight">
              {message.text}
            </p>
          </div>

          {/* Time & Status Overlay - Professional Micro-UI */}
          <div className={`
            absolute top-1/2 -translate-y-1/2 ${isOwn ? '-left-14' : '-right-14'} 
            opacity-0 group-hover/message:opacity-100 transition-all duration-300 transform
            ${isOwn ? 'translate-x-2 group-hover/message:translate-x-0' : '-translate-x-2 group-hover/message:translate-x-0'}
          `}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
              <span className="text-[9px] font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">
                {formatTime(message.createdAt)}
              </span>
              {isOwn && showStatus && (
                <div className="flex items-center">
                  {getMessageStatus()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Static Timestamp - Mobile/Standard View */}
        <div className={`flex items-center gap-1 mt-0.5 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-40">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && showStatus && !message.status && (
            <div className="opacity-40 scale-75">
              {getMessageStatus()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}