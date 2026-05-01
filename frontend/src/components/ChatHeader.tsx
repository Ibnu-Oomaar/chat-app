import { Phone, Video, MoreVertical, Hash, ShieldCheck, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';


interface ChatHeaderProps {
  roomName?: string;
  roomAvatar?: string;
  memberCount?: number;
  onInfoClick?: () => void;
}

export default function ChatHeader({ 
  roomName = "Global Lounge", 
  roomAvatar,
  memberCount = 12,
  onInfoClick 
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white/1 backdrop-blur-3xl border-b border-white/5">
      <div className="flex items-center gap-5">
        {/* Room Avatar - Ultra High Fidelity */}
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <Avatar className="h-11 w-11 rounded-2xl border border-white/10 shadow-2xl relative z-10">
            <AvatarImage src={roomAvatar} />
            <AvatarFallback className="bg-indigo-500/10 text-indigo-400 rounded-2xl font-black text-xs">
              <Hash className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-[3px] border-obsidian shadow-lg z-20" />
        </div>

        {/* Room Info */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="font-black text-sm tracking-wider text-white uppercase">
              {roomName}
            </h1>
            <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 tracking-widest uppercase">
              Secure
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {memberCount} Nodes Online
              </span>
            </div>
            <div className="w-px h-2.5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500/70" />
              <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">
                E2E Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Call Actions - Premium Icons */}
        <div className="hidden sm:flex items-center gap-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calls')}
            className="h-10 w-10 p-0 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 text-slate-400 hover:text-white transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calls')}
            className="h-10 w-10 p-0 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 text-slate-400 hover:text-white transition-all duration-300"
          >
            <Video className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-white/5 mx-2" />
        </div>

        {/* Members Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onInfoClick}
          className="h-10 w-10 p-0 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 text-slate-400 hover:text-white transition-all duration-300"
        >
          <Users className="w-4 h-4" />
        </Button>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 text-slate-400 hover:text-white transition-all duration-300">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 bg-obsidian/90 backdrop-blur-2xl border-white/10 rounded-2xl shadow-3xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-3 py-2">Stream Configuration</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl h-10 gap-3 focus:bg-white/5 focus:text-white">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Channel Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl h-10 gap-3 focus:bg-white/5 focus:text-white">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Node Registry</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="rounded-xl h-10 gap-3 focus:bg-rose-500/10 text-rose-500">
              <span className="text-xs font-black uppercase tracking-[0.2em]">Terminate Connection</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}