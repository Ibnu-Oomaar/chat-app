import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Shield, Zap, Camera, CheckCircle2, Save } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { updateProfile } from "../services/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";


export default function Profile() {
  const { user, login } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePic || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (selectedImage) {
        formData.append("profilePic", selectedImage);
      }

      const updatedUser = await updateProfile(user._id, formData);
      const token = localStorage.getItem('token');
      if (token) {
        login(updatedUser, token);
      }
      setMessage("Profile updated successfully!");
      setSelectedImage(null);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-hidden bg-obsidian">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[3rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <div className="relative group mb-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] opacity-20 blur group-hover:opacity-40 transition-all duration-700" />
                  <Avatar className="w-40 h-40 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                    <AvatarImage src={previewUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-6xl font-black">
                      {username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-3 -right-3 bg-indigo-500 p-3 rounded-2xl border-4 border-obsidian shadow-2xl hover:bg-indigo-400 hover:scale-110 transition-all z-20 active:scale-95"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageSelect} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                {selectedImage && (
                  <div className="absolute -top-3 -left-3 z-20">
                    <div className="px-3 py-1 bg-indigo-500 border border-indigo-400 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/40">
                      PENDING SYNC
                    </div>
                  </div>
                )}
              </div>
              
              <CardTitle className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                {user?.username}
                <div className="p-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                </div>
              </CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-3">
                Node Identity Configuration
              </CardDescription>
              <div className="mt-6 flex justify-center">
                <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Identity</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleUpdate}>
            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant={message.includes("success") ? "default" : "destructive"}>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Node Identifier
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      className="h-12 bg-white/2 border-white/5 pl-4 rounded-2xl text-sm font-bold tracking-tight text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/10 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Signal Tier
                  </Label>
                  <div className="h-12 px-4 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Premium Core</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Secure Data Uplink (Email)
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-12 bg-white/2 border-white/5 pl-4 rounded-2xl text-sm font-bold tracking-tight text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Date</Label>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-4 pt-6 pb-12">
              <Button 
                type="submit" 
                disabled={isLoading || (!username && !email && !selectedImage)}
                className="flex-1 h-12 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Sync Configuration</span>
                  </div>
                )}
              </Button>
              
              {(selectedImage || username !== user?.username || email !== user?.email) && (
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setUsername(user?.username || "");
                    setEmail(user?.email || "");
                    setSelectedImage(null);
                    setPreviewUrl(user?.profilePic || null);
                    setMessage("");
                  }}
                  className="h-12 px-8 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                  Abort
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>


      </motion.div>
    </div>
  );
}