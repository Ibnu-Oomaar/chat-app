import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  UserPlus, 
  Check, 
  UserCheck, 
  X,
  UserMinus,
  MoreHorizontal,
  Phone,
  Video,
  MessageSquare
} from "lucide-react";
import { useFriendStore } from "../stores/friendStore";
import { useAuthStore } from "../stores/authStore";
import { searchUsers } from "../services/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import socket from "../services/socket";

export default function Friends() {
  const { user } = useAuthStore();
  const { 
    friends, 
    pendingRequests, 
    fetchFriends, 
    fetchPendingRequests, 
    sendRequest, 
    acceptRequest, 
    rejectRequest, 
    isLoading 
  } = useFriendStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchFriends(user._id);
      fetchPendingRequests(user._id);
    }
  }, [user?._id, fetchFriends, fetchPendingRequests]);

  useEffect(() => {
    socket.on("receive_friend_request", () => {
      if (user?._id) fetchPendingRequests(user._id);
    });
    return () => {
      socket.off("receive_friend_request");
    };
  }, [user?._id, fetchPendingRequests]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results.filter((u: any) => u._id !== user?._id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (receiverId: string) => {
    if (!user?._id) return;
    try {
      await sendRequest(user._id, receiverId);
      socket.emit("send_friend_request", { receiverId, requester: user });
      fetchFriends(user._id);
      setSearchResults(searchResults.filter(u => u._id !== receiverId));
    } catch (error) {
      console.error("Failed to send request", error);
    }
  };

  const handleAccept = async (requestId: string) => {
    if (user?._id) await acceptRequest(requestId, user._id);
  };

  const handleReject = async (requestId: string) => {
    if (user?._id) await rejectRequest(requestId, user._id);
  };

  const activeFriends = friends.filter(f => f.status === "accepted");

  return (
    <div className="h-full w-full flex flex-col p-6 lg:p-10 gap-8 overflow-hidden bg-obsidian relative">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-500/10 rounded-4xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            <Users className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">Node Registry</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
              Network Connections & Signal Monitoring
            </p>
          </div>
        </div>
        
        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeFriends.length} Nodes Synchronized</span>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
        
        {/* Left Column - Search & Requests */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0 overflow-hidden">
          
          {/* Search Card */}
          <Card className="z-10 border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                <Search className="w-4 h-4 text-indigo-400" />
                Scan Network
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username or email..."
                    className="h-11 bg-white/2 border-white/5 pl-4 pr-24 rounded-2xl text-sm font-bold tracking-tight text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/10"
                  />
                  <Button 
                    type="submit"
                    disabled={isSearching}
                    size="sm"
                    className="absolute right-1.5 top-1.5 h-8 bg-primary text-white rounded-xl px-4 text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                  >
                    {isSearching ? "SCANNING" : "SCAN"}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <ScrollArea className="h-[300px]">
                  <AnimatePresence mode="popLayout">
                    {searchResults.length === 0 && !isSearching && (
                      <div className="flex flex-col items-center justify-center text-center py-12">
                        <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Search for people to connect with
                        </p>
                      </div>
                    )}
                    {searchResults.map((u, i) => {
                      const isAlreadyFriend = friends.some(
                        f => (f.requester?._id === u._id || f.receiver?._id === u._id)
                      );
                      return (
                        <motion.div 
                          key={u._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white/1 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all mb-2 group"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={u.profilePic} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {u.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {u.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            disabled={isAlreadyFriend}
                            onClick={() => handleSendRequest(u._id)}
                            variant={isAlreadyFriend ? "secondary" : "default"}
                            className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 transition-all ${
                              isAlreadyFriend 
                                ? 'bg-white/5 text-slate-400' 
                                : 'bg-primary text-white shadow-lg shadow-indigo-500/20'
                            }`}
                          >
                            {isAlreadyFriend ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <UserPlus className="w-3 h-3" />
                            )}
                            {isAlreadyFriend ? "Linked" : "Link"}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests Card */}
          <Card className="z-10 border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  Incoming Signals
                </div>
                {pendingRequests.length > 0 && (
                  <div className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-400 uppercase tracking-widest">
                    {pendingRequests.length} New
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {pendingRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <Check className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No pending requests
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req, i) => (
                      <motion.div 
                        key={req._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 mb-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={req.requester?.profilePic} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {req.requester?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {req.requester?.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Wants to connect
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleAccept(req._id)} 
                            className="h-9 w-9 p-0 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(req._id)} 
                            className="h-9 w-9 p-0 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 border border-white/5"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Friends List */}
        <div className="lg:col-span-2 min-h-0 overflow-hidden">
          <Card className="h-full z-10 border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Active Node Map
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {activeFriends.length} Verified Channels
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <ScrollArea className="h-full">
                {isLoading && activeFriends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading connections...</p>
                  </div>
                ) : activeFriends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-32">
                    <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No connections yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Search and add friends to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeFriends.map((f, i) => {
                      const friend = f.requester?._id === user?._id ? f.receiver : f.requester;
                      if (!friend) return null;
                      return (
                        <motion.div 
                          key={f._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Card className="bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer rounded-3xl overflow-hidden group/friend">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <Avatar className="h-16 w-16 rounded-2xl border border-white/10 shadow-xl group-hover/friend:scale-105 transition-transform duration-500">
                                      <AvatarImage src={friend.profilePic} />
                                      <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-xl font-black">
                                        {friend.username?.[0]?.toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-obsidian shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                                  </div>
                                  <div>
                                    <p className="font-black text-white text-lg tracking-tight uppercase">
                                      {friend.username}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-pulse" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Active Stream
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56 p-2 bg-obsidian/90 backdrop-blur-2xl border-white/10 rounded-2xl shadow-3xl">
                                    <DropdownMenuItem className="rounded-xl h-10 gap-3 focus:bg-white/5 focus:text-white">
                                      <Video className="w-4 h-4 text-indigo-400" />
                                      <span className="text-xs font-bold uppercase tracking-widest">Video Stream</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl h-10 gap-3 focus:bg-white/5 focus:text-white">
                                      <Phone className="w-4 h-4 text-purple-400" />
                                      <span className="text-xs font-bold uppercase tracking-widest">Audio Uplink</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl h-10 gap-3 focus:bg-rose-500/10 text-rose-500 mt-1">
                                      <UserMinus className="w-4 h-4" />
                                      <span className="text-xs font-black uppercase tracking-widest">Sever Link</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <div className="h-px bg-white/5 my-5" />
                              
                              <div className="flex gap-3">
                                <Button size="sm" variant="ghost" className="flex-1 h-10 gap-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Signal</span>
                                </Button>
                                <Button size="sm" className="flex-1 h-10 gap-3 rounded-xl bg-primary text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
                                  <Video className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}