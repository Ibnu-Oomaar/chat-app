import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  ArrowRight, 
  Trash2, 
  Power, 
  Zap, 
  ShieldAlert,
  User,
  Lock,
  Monitor
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Settings() {
  const settingGroups = [
    { icon: Bell, label: "Notifications", desc: "Configure your notification preferences", color: "blue" },
    { icon: Palette, label: "Appearance", desc: "Customize theme, colors and layout", color: "purple" },
    { icon: Shield, label: "Privacy & Security", desc: "Manage your security settings", color: "emerald" },
    { icon: Globe, label: "Language & Region", desc: "Set your preferred language", color: "amber" },
    { icon: User, label: "Account", desc: "Manage your account settings", color: "rose" },
    { icon: Monitor, label: "Display", desc: "Screen and accessibility options", color: "cyan" },
  ];

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
        className="flex items-center gap-6 z-10"
      >
        <div className="p-4 bg-indigo-500/10 rounded-4xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <SettingsIcon className="w-7 h-7 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Control Center</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            System Configuration & Uplink Preferences
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="preferences" className="h-full flex flex-col z-10">
          <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-2xl w-full lg:w-[450px]">
            <TabsTrigger value="preferences" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all">Preferences</TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="flex-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingGroups.map((group, index) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group rounded-4xl overflow-hidden">
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-all">
                          <group.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-lg font-black text-white uppercase tracking-tight">{group.label}</CardTitle>
                      <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
                        {group.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}

              {/* System Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/2 border-white/5 rounded-4xl overflow-hidden">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl">
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                        LIVE
                      </div>
                    </div>
                    <CardTitle className="text-lg font-black text-white uppercase tracking-tight">System Health</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uplink Performance Metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-8 space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Uptime</span>
                        <span className="text-indigo-400">99.9%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[99.9%] bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.4)] rounded-full" /></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Latency</span>
                        <span className="text-purple-400">145ms</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[92%] bg-linear-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] rounded-full" /></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Buffer</span>
                        <span className="text-indigo-400">2.4 / 10 GB</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[24%] bg-linear-to-r from-indigo-500 to-cyan-500 shadow-[0_0_10px_rgba(99,102,241,0.4)] rounded-full" /></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="flex-1 mt-6 space-y-6">
            {/* Security Settings */}
            <Card className="bg-white/2 border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-lg font-black text-white uppercase tracking-tight">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  Security Protocols
                </CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Manage encryption and authorization parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-white uppercase tracking-tight">Multi-Factor Authentication</Label>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Enhanced authorization layer for node access
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-indigo-500" />
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-white uppercase tracking-tight">End-to-End Encryption</Label>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Full signal encryption across all channels
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    ACTIVE
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-white uppercase tracking-tight">Session Monitoring</Label>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Track active uplinks and authorized hardware
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    MANAGE
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-rose-500/20 bg-rose-500/1 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-rose-500/10">
                <CardTitle className="flex items-center gap-3 text-lg font-black text-rose-500 uppercase tracking-tight">
                  <ShieldAlert className="w-5 h-5" />
                  Terminal Severance
                </CardTitle>
                <CardDescription className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest mt-1">
                  High-risk protocols • irreversible operations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-black text-rose-500 uppercase tracking-tight">Purge All Data</Label>
                    <p className="text-[10px] font-bold text-rose-500/40 uppercase tracking-widest">
                      Permanently eliminate all transmission history
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4 mr-2" />
                        PURGE DATA
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-obsidian border-white/10 rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white font-black uppercase tracking-wider">Confirm Total Purge?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                          This protocol cannot be reversed. All signals, media, and metadata will be permanently erased from the network.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest">Abort</AlertDialogCancel>
                        <AlertDialogAction className="rounded-xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600">
                          Execute Purge
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-black text-rose-500 uppercase tracking-tight">Decommission Node</Label>
                    <p className="text-[10px] font-bold text-rose-500/40 uppercase tracking-widest">
                      Permanently terminate account and network ID
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all text-[10px] font-black uppercase tracking-widest">
                        <Power className="w-4 h-4 mr-2" />
                        TERMINATE
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-obsidian border-white/10 rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white font-black uppercase tracking-wider">Confirm Decommission?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                          This action will permanently sever your connection and destroy all associated node data. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest">Abort</AlertDialogCancel>
                        <AlertDialogAction className="rounded-xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600">
                          Sever Connection
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}