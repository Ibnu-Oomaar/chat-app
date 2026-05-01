import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  LogIn,
  Shield,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axios.post('http://localhost:6030/api/users/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/chat');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  useEffect(() => {
    const handleGoogleSignIn = (response: any) => {
      axios.post('http://localhost:6030/api/auth/google', { token: response.credential })
        .then((res) => {
          login(res.data.user, res.data.token);
          navigate('/chat');
        })
        .catch(() => {
          setError('Google sign in failed. Please try again.');
        });
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '630055289266-udp5h0tks9mjslt990mn1vkep74s7r7m.apps.googleusercontent.com',
        callback: handleGoogleSignIn
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-obsidian relative overflow-hidden p-4 sm:p-6">
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


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[3rem] shadow-3xl overflow-hidden ring-1 ring-white/5">
          <CardHeader className="text-center space-y-6 pt-12 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-4xl mx-auto shadow-2xl shadow-indigo-500/20"
            >
              <LogIn className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black text-white uppercase tracking-tighter">
                Access Gateway
              </CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">
                Secure signal authentication required
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Node Identifier (Email)
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 bg-white/2 border-white/5 pl-11 rounded-2xl text-sm font-bold tracking-tight text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/10 transition-all"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Access Key
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                  >
                    Key Recovery
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-700 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-white/2 border-white/5 pl-11 pr-12 rounded-2xl text-sm font-bold tracking-tight text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/10 transition-all"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Initialize Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="px-4 bg-transparent text-slate-500">
                    Alternative Uplink
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div id="google-signin-button" className="w-full" />
            </CardContent>
          </form>

          <CardFooter className="flex justify-center pb-12">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              New Node?{' '}
              <Link 
                to="/register" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
              >
                Registry
              </Link>
            </p>
          </CardFooter>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Shield className="w-3 h-3 text-indigo-500/50" />
            E2E Encrypted
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Lock className="w-3 h-3 text-purple-500/50" />
            Secure Tunnel
          </div>
        </motion.div>
      </motion.div>


    </div>
  );
}