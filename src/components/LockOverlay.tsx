import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Unlock, Eye, Scan, Fingerprint } from 'lucide-react';
import { cn } from '../lib/utils';

interface LockOverlayProps {
  isLocked: boolean;
  onUnlock: () => void;
  onLog: (msg: string) => void;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({ isLocked, onUnlock, onLog }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleManualUnlock = () => {
    setIsVerifying(true);
    onLog("MANUAL_BYPASS_INITIATED: VERIFYING_BIOMETRICS...");
    
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      onLog("SECURITY_BYPASS_APPROVED: WELCOME_BACK_SIR");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Holographic Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,#0ea5e9,transparent)]" />
          </div>

          <div className="scanline" />

          {/* Central Shield HUD */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 border border-sky-500/20 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 border-2 border-sky-500/10 rounded-full"
            />
            
            <div className="glass w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 border-sky-500 shadow-[0_0_50px_rgba(56,189,248,0.4)] relative bg-slate-900/80">
              {isVerifying ? (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sky-400"
                >
                  <Scan className="w-16 h-16" />
                </motion.div>
              ) : (
                <Lock className="w-16 h-16 text-rose-500 animate-pulse" />
              )}
            </div>
          </div>

          <div className="mt-12 text-center relative z-10">
            <h2 className="text-4xl font-black text-sky-100 uppercase tracking-[0.5em] mb-4 glow-text italic">
              System_Locked
            </h2>
            <p className="text-sky-400 font-mono text-xs uppercase tracking-widest mb-12">
              Neural_Interface_Restricted // Identity_Verification_Required
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManualUnlock}
              disabled={isVerifying}
              className="group relative px-12 py-4 bg-sky-500/10 border border-sky-500/40 rounded-full text-sky-400 font-bold uppercase tracking-[0.2em] transition-all hover:bg-sky-500/20 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5" />
                Initiate_Bypass
              </div>
            </motion.button>
          </div>

          {/* Diagnostic Corner */}
          <div className="fixed bottom-8 left-8 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-sky-500" />
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Protocol: JARVIS_S7</span>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-sky-100/40 uppercase">Sensors: ACTIVE</p>
              <p className="text-[8px] font-mono text-sky-100/40 uppercase">Encryption: 2048_BIT</p>
              <p className="text-[8px] font-mono text-sky-100/40 uppercase text-rose-500 animate-pulse">Intrusion: RECORDING</p>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 text-right">
             <p className="text-[8px] font-mono text-sky-100/20 uppercase max-w-[200px]">
                Warning: Unauthorized access to StarkOS is a violation of international tech-sovereignty accords. Facial telemetry is being uplinked to centralized cloud nodes.
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
