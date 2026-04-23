import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Mic, MapPin } from 'lucide-react';

export const StartupSequenceOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'intro' | 'permissions'>('intro');
  const [authorized, setAuthorized] = useState({ mic: false, geo: false });

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const micPermission = await navigator.permissions.query({ name: 'microphone' as any });
        const geoPermission = await navigator.permissions.query({ name: 'geolocation' as any });
        
        if (micPermission.state === 'granted' && geoPermission.state === 'granted') {
          // If already granted, wait for intro then complete
          setTimeout(onComplete, 4000);
        } else {
          // Otherwise show authorization screen
          setTimeout(() => setStep('permissions'), 3000);
        }
      } catch (e) {
        // Fallback for browsers that don't support permissions.query for these types
        setTimeout(() => setStep('permissions'), 3000);
      }
    };
    
    checkPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request Mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      // Request Geo
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(resolve, resolve);
      });

      setAuthorized({ mic: true, geo: true });
      setTimeout(onComplete, 1500);
    } catch (e) {
      console.warn("Permission denied or cancelled, Sir.");
      onComplete(); // Proceed anyway, J.A.R.V.I.S. will handle it gracefully in-app
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_100%)]" />
        <div className="scanline" />

        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            <motion.div 
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative group">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-4xl font-black text-sky-400 tracking-[1em] uppercase glow-text mb-4 italic"
                >
                  STARK
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-0.5 bg-sky-500 shadow-[0_0_15px_#38bdf8]"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="text-[10px] font-mono text-center mt-4 tracking-[0.5em] text-sky-500/60"
                >
                  SYSTEM_INTEGRITY_CHECK: 100%
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="permissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-[2.5rem] border border-sky-400/20 max-w-md w-full text-center relative z-10"
            >
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
                  <Shield className="w-10 h-10 text-sky-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-xl font-black text-sky-100 uppercase tracking-widest mb-4">Neural_Uplink_Authorization</h2>
              <p className="text-[10px] font-mono text-sky-100/60 uppercase leading-relaxed mb-10 tracking-[0.2em]">
                Sir, I require manual authorization to synchronize with your sensory arrays and geolocation lattice.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${authorized.mic ? 'bg-sky-500/20 border-sky-400' : 'bg-white/5 border-white/10'}`}>
                  <Mic className={`w-5 h-5 ${authorized.mic ? 'text-sky-400' : 'text-white/20'}`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Audio_Input</span>
                </div>
                <div className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${authorized.geo ? 'bg-sky-500/20 border-sky-400' : 'bg-white/5 border-white/10'}`}>
                  <MapPin className={`w-5 h-5 ${authorized.geo ? 'text-sky-400' : 'text-white/20'}`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Geo_Lattice</span>
                </div>
              </div>

              {!authorized.mic && (
                <button 
                  onClick={requestPermissions}
                  className="w-full py-4 bg-sky-500 text-slate-950 font-black uppercase tracking-[0.4em] rounded-xl hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)]"
                >
                  Authorize_Link
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-12 flex flex-col items-center gap-2">
           <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ 
                     duration: 0.5, 
                     repeat: Infinity, 
                     delay: i * 0.1 
                   }}
                   className="w-1.5 h-4 bg-sky-500/40"
                 />
              ))}
           </div>
           <span className="text-[10px] font-mono text-sky-400">INITIATING_PROTOCOL: JARVIS_V4</span>
        </div>
    </div>
  );
};
