import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, simulateAdmin, simulateGuest, error: apiError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Required parameters: credentials not specified.');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        const { error } = await signUp(email, password, fullName || 'VOOX NOMAD');
        if (error) {
          setErrorMsg(error.message || 'Signature validation failed.');
        } else {
          onClose(); // instant
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message || 'Cipher matching failed.');
        } else {
          onClose(); // instant
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Interface system abort.');
    } finally {
      setLoading(false);
    }
  };

  const triggerBypassAdmin = () => {
    simulateAdmin();
    onClose();
  };

  const triggerBypassGuest = () => {
    simulateGuest();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
        
        {/* Dark curtains */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 pointer-events-auto"
        >
          {/* Cyber matrix layout accent lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-800 via-red-500 to-red-800" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title block */}
          <div className="text-center space-y-2 mb-8 mt-2">
            <h2 className="font-sans font-black text-xl tracking-[0.25em] text-white">
              SECURE_GATE
            </h2>
            <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              VOOX CRYPTOCURRENT IDENTITY PROTOCOL
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-900/50 flex gap-2.5 items-center text-red-400 text-[10px] font-mono leading-normal"
            >
              <ShieldAlert className="w-4 a-4 flex-shrink-0 animate-bounce" />
              <span>ERRO: {errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex gap-2.5 items-center text-emerald-400 text-[10px] font-mono leading-normal"
            >
              <CheckCircle className="w-4 a-4 flex-shrink-0" />
              <span>OK: {successMsg}</span>
            </motion.div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider">FULL_NAME</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Agent Maverick"
                    className="w-full h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white placeholder-zinc-700 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-zinc-500 tracking-wider">SECURE_EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@voox.luxury"
                  className="w-full h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white placeholder-zinc-700 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-zinc-500 tracking-wider">ENCRYPT_PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white placeholder-zinc-700 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              {loading ? 'CALCULATING_HASH...' : isRegister ? 'CONFIRM_REGISTRATION' : 'UNLOCK_PORTAL'}
            </button>

          </form>

          {/* Toggle register option */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-mono text-[10px] text-zinc-500 hover:text-red-400 underline transition-all cursor-pointer bg-transparent border-none"
            >
              {isRegister ? 'RE-AUTHENTICATE EXISTING AGENT' : 'CREATE NEW NOMAD CO-CELL'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
