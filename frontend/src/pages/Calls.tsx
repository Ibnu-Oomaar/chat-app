import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Video, 
  PhoneOff, 
  PhoneIncoming, 
  Users, 
  Mic, 
  Camera,
  MicOff,
  CameraOff,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useFriendStore } from "../stores/friendStore";
import { useAuthStore } from "../stores/authStore";
import { useCallStore } from "../stores/callStore";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "src/components/ui/separator";


export default function Calls() {
  const { user } = useAuthStore();
  const { friends, fetchFriends } = useFriendStore();
  const { 
    isCalling, 
    isReceivingCall, 
    isConnected, 
    callUser, 
    answerCall, 
    endCall, 
    userStream, 
    remoteStream, 
    setStream,
    initSocketListeners,
    callerName 
  } = useCallStore();
  
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    initSocketListeners();
    if (user?._id) fetchFriends(user._id);
  }, [user?._id, fetchFriends, initSocketListeners]);

  useEffect(() => {
    if (userStream && myVideo.current) {
      myVideo.current.srcObject = userStream;
    }
  }, [userStream]);

  useEffect(() => {
    if (remoteStream && userVideo.current) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startCall = async (targetUserId: string, name: string) => {
    if (!user?._id) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(stream);
      callUser(targetUserId, name, user._id);
    } catch (err) {
      console.error("Failed to get media stream", err);
    }
  };

  const handleAnswer = async () => {
    if (!user?._id) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(stream);
      answerCall();
    } catch (err) {
      console.error("Failed to get media stream", err);
    }
  };

  const toggleMute = () => {
    if (userStream) {
      const audioTracks = userStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (userStream) {
      const videoTracks = userStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById('video-container');
    if (!isFullscreen) {
      elem?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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
        className="flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-500/10 rounded-4xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
            <Phone className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">Uplink Hub</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
              Secure Frequency & Voice Encryption
            </p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal Verified</span>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Section: Contacts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-96 z-10"
        >
          <Card className="h-full border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Frequency List
                </div>
                <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {activeFriends.length} Active
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {activeFriends.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No contacts available</p>
                      <p className="text-xs text-muted-foreground mt-1">Add friends to start calling</p>
                    </div>
                  ) : (
                    activeFriends.map((f, i) => {
                      const friend = f.requester?._id === user?._id ? f.receiver : f.requester;
                      if (!friend) return null;
                      return (
                        <motion.div 
                          key={f._id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className="bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer rounded-2xl overflow-hidden group">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12 rounded-xl border border-white/10">
                                    <AvatarImage src={friend.profilePic} />
                                    <AvatarFallback className="bg-indigo-500/10 text-indigo-400 font-black">
                                      {friend.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-white text-sm tracking-tight uppercase">{friend.username}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stable</span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => startCall(friend._id, friend.username)}
                                  className="h-9 px-4 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  Link
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Section: Video Call */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 z-10"
        >
          <Card className="h-full border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
            <div id="video-container" className="relative h-full bg-black">
              <AnimatePresence mode="wait">
                {!(isCalling || isReceivingCall || isConnected) ? (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/10">
                      <Phone className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">
                      Uplink Ready
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm">
                      Select a node to establish a secure multi-dimensional channel
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col h-full"
                  >
                    {/* Remote Video */}
                    <div className="flex-1 relative bg-black">
                      {isConnected && remoteStream ? (
                        <video 
                          ref={userVideo} 
                          autoPlay 
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="w-40 h-40 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center justify-center animate-pulse shadow-2xl shadow-indigo-500/20">
                            <Phone className="w-16 h-16 text-indigo-400/50" />
                          </div>
                          <div className="mt-10 text-center">
                            <p className="text-xl font-black text-white uppercase tracking-widest mb-3">
                              {isCalling ? "Transmitting..." : `Signal from ${callerName}`}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                              {isCalling ? "Establishing secure frequency..." : "Accept uplink request to start"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Local Video PIP */}
                      {(isConnected || isCalling || isReceivingCall) && (
                        <div className="absolute bottom-6 right-6 w-56 h-40 bg-obsidian/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-3xl cursor-pointer hover:scale-105 transition-transform group">
                          <video 
                            ref={myVideo} 
                            autoPlay 
                            muted 
                            playsInline
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">
                              You
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Call Controls */}
                    <div className="p-8 bg-black/40 border-t border-white/5">
                      <div className="flex items-center justify-center gap-6">
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={toggleMute}
                          className={`rounded-2xl w-14 h-14 p-0 border transition-all ${
                            isMuted 
                              ? "bg-rose-500/20 border-rose-500/50 text-rose-500" 
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={toggleVideo}
                          className={`rounded-2xl w-14 h-14 p-0 border transition-all ${
                            isVideoOff 
                              ? "bg-rose-500/20 border-rose-500/50 text-rose-500" 
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {isVideoOff ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={toggleFullscreen}
                          className="rounded-2xl w-14 h-14 p-0 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                        </Button>

                        {isReceivingCall && !isConnected && (
                          <Button 
                            onClick={handleAnswer}
                            size="lg"
                            className="rounded-2xl w-14 h-14 p-0 bg-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 animate-bounce"
                          >
                            <PhoneIncoming className="w-6 h-6" />
                          </Button>
                        )}

                        <Button 
                          onClick={() => endCall()}
                          size="lg"
                          className="rounded-2xl w-14 h-14 p-0 bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all"
                        >
                          <PhoneOff className="w-6 h-6" />
                        </Button>
                      </div>

                      {/* Call Status */}
                      <div className="text-center mt-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                          {isCalling && "Syncing Frequencies..."}
                          {isReceivingCall && !isConnected && "Incoming Uplink Request..."}
                          {isConnected && "Frequency Established • Secure"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}