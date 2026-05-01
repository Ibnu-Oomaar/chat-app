import { NavLink, Outlet } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  PhoneCall, 
  Settings, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useStatusStore } from "../stores/statusStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


export default function Layout() {
  const { logout, user } = useAuthStore();
  const { fetchOnlineUsers, addOnlineUser, removeOnlineUser } = useStatusStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (user?._id) {
      socket.emit("register_user", user._id);
      fetchOnlineUsers();
      socket.on("user_status", ({ userId, isOnline }) => {
        if (isOnline) addOnlineUser(userId);
        else removeOnlineUser(userId);
      });
    }
    return () => {
      socket.off("user_status");
    };
  }, [user, fetchOnlineUsers, addOnlineUser, removeOnlineUser]);

  const navItems = [
    { icon: MessageSquare, path: "/chat", label: "Messages" },
    { icon: Users, path: "/friends", label: "Network" },
    { icon: PhoneCall, path: "/calls", label: "Calls" },
  ];

  const bottomItems = [
    { icon: User, path: "/profile", label: "Profile" },
    { icon: Settings, path: "/settings", label: "Settings" },
  ];

  return (
    <TooltipProvider>
      <div className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden relative">
        {/* Deep Space Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* Sidebar Navigation - Nebula Style */}
        <motion.nav 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`relative z-50 h-[calc(100vh-1.5rem)] flex flex-col m-3 rounded-4xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-3xl transition-all duration-500 ring-1 ring-white/5 ${
            isCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          {/* Logo Section */}
          <div className={`flex items-center gap-2 p-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <span className="font-black text-sm tracking-[0.2em] text-white uppercase">
                    GunaChat
                  </span>
                  <span className="text-[9px] font-bold text-indigo-400 tracking-[0.3em] uppercase opacity-60">
                    Pro Terminal
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="px-6">
            <div className="h-px w-full bg-white/5" />
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-3xl transition-all duration-300 relative group ${
                        isActive 
                          ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" 
                          : "text-slate-400 hover:bg-white/3 hover:text-white"
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div 
                            layoutId="nav-active"
                            className="absolute left-2 w-1 h-5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                          />
                        )}
                        <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:scale-110'}`} />
                        {!isCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11px] font-black uppercase tracking-[0.15em]"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-obsidian border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-2">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex flex-col gap-2 mb-4">
              {bottomItems.map((item) => (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-3xl transition-all duration-300 group ${
                            isActive 
                            ? "bg-white/5 text-white" 
                            : "text-slate-400 hover:bg-white/3 hover:text-white"
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && (
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-obsidian border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-2">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            
            <Separator className="bg-white/5 mb-4" />

            {/* Logout Button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className={`flex items-center gap-4 px-4 py-3 rounded-3xl transition-all duration-300 w-full text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 group ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  {!isCollapsed && (
                    <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                      Sign Out
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-obsidian border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest px-3 py-2">
                  Sign Out
                </TooltipContent>
              )}
            </Tooltip>

            {/* User Profile Summary */}
            <div className={`mt-6 p-4 rounded-4xl bg-white/2 border border-white/5 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 rounded-2xl border border-white/10">
                  <AvatarImage src={user?.profilePic} />
                  <AvatarFallback className="bg-indigo-500/10 text-indigo-400 font-black text-xs uppercase">
                    {user?.username?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-obsidian shadow-lg" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate uppercase tracking-wider">{user?.username}</p>
                  <p className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest">Active Node</p>
                </div>
              )}
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-8 w-8 p-0 rounded-xl bg-white/5 hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0 rounded-xl bg-white/5 hover:bg-white/10 mx-auto mt-4"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.nav>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden relative z-10">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
