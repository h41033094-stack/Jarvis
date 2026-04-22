import React from 'react';
import { motion } from 'motion/react';

export const StartupSequenceOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 1 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_100%)]" />
       <div className="scanline" />
       
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
          <span className="text-[10px] font-mono text-sky-400 animate-pulse">INITIATING_PROTOCOL: JARVIS_V4</span>
       </div>
    </motion.div>
  );
};
