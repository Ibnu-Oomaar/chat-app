import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SendHorizontal, Paperclip, Smile, Mic, Image, FileText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ onSend, disabled, placeholder }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <TooltipProvider>
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center gap-3 p-2 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/30 transition-all duration-700 shadow-3xl group"
      >
        {/* Attachment Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-2xl shrink-0 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
              <span className="sr-only">Access Data Node</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-obsidian/90 backdrop-blur-2xl border-white/10 rounded-2xl shadow-3xl" align="start" side="top">
            <div className="grid grid-cols-1 gap-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-4 h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5">
                <Image className="w-4 h-4 text-indigo-400" />
                Media Stream
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-4 h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5">
                <FileText className="w-4 h-4 text-purple-400" />
                Data File
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Message Input */}
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Establish connection..."}
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-4 text-sm font-bold tracking-tight text-white placeholder:text-slate-600"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 px-2 border-l border-white/10">
          {/* Emoji Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:bg-white/5 hover:text-amber-400 transition-all"
                disabled={disabled}
              >
                <Smile className="w-4 h-4" />
                <span className="sr-only">Add emoji</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-obsidian border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-2">
              Add emoji
            </TooltipContent>
          </Tooltip>

          {/* Voice Message Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                className={`h-9 w-9 p-0 rounded-xl transition-all ${isRecording ? 'animate-pulse bg-rose-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-rose-400'}`}
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
              >
                <Mic className="w-4 h-4" />
                <span className="sr-only">Voice message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-obsidian border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-2">
              {isRecording ? 'Stop recording' : 'Start recording'}
            </TooltipContent>
          </Tooltip>

          {/* Send Button - Premium Style */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                disabled={disabled || !text.trim()}
                size="sm"
                className="h-11 px-6 gap-3 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-700 disabled:opacity-20 disabled:grayscale"
              >
                <SendHorizontal className={`w-4 h-4 transition-transform duration-700 ${text.trim() ? 'translate-x-1 scale-110' : ''}`} />
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.3em]">Transmit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-obsidian border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-2">
              Initiate Uplink
            </TooltipContent>
          </Tooltip>
        </div>
      </form>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-4 bg-rose-500/5 rounded-3xl border border-rose-500/10"
        >
          <div className="flex items-center gap-4 text-xs text-rose-500">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
            <span className="font-black uppercase tracking-widest">Active Signal Intercept...</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-4 text-[10px] font-black uppercase tracking-widest ml-auto bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
              onClick={() => setIsRecording(false)}
            >
              Abort
            </Button>
          </div>
        </motion.div>
      )}
    </TooltipProvider>
  );
}