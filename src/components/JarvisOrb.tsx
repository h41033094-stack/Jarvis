import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const JarvisOrb: React.FC<{ isListening: boolean; isActive: boolean; isProcessing: boolean }> = ({ isListening, isActive, isProcessing }) => {
  return (
    <div className="relative flex items-center justify-center w-80 h-80">
      {/* Outer Rotating Structures */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            rotate: i % 2 === 0 ? 360 : -360,
            scale: isProcessing ? [1, 1.05, 1] : 1 
          }}
          transition={{ 
            rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className={cn(
            "absolute border rounded-full border-dashed",
            i === 0 ? "w-full h-full border-sky-500/10" : 
            i === 1 ? "w-[90%] h-[90%] border-sky-400/20 px-4" : 
            "w-[80%] h-[80%] border-sky-300/30"
          )}
        >
           {i === 1 && (
             <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_15px_#38bdf8]" />
           )}
        </motion.div>
      ))}

      {/* Pulsing Atmosphere */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.15, 1] : isProcessing ? [1, 0.98, 1.02, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-64 h-64 rounded-full bg-sky-500/5 blur-3xl"
      />

      {/* Core Orb Container */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.1, 1] : 1,
          opacity: isActive ? 1 : 0.7,
        }}
        className="relative w-40 h-40 rounded-full bg-slate-900 border border-sky-400/40 flex items-center justify-center arc-glow overflow-hidden hologram-flicker"
      >
        {/* Internal HUD Elements */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
        
        <div className="relative w-32 h-32 rounded-full border-2 border-sky-500/30 flex items-center justify-center">
            {/* Spinning Arc Segments */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-t-2 border-sky-400 rounded-full"
            />
            
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="absolute inset-4 border-b-2 border-sky-300/50 rounded-full"
            />

            {/* Neural Matrix Core */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-sky-500/10 shadow-[inset_0_0_20px_rgba(56,189,248,0.4)]">
                <div className="grid grid-cols-3 gap-0.5 opacity-60">
                   {[...Array(9)].map((_, i) => (
                     <motion.div 
                        key={i}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                          backgroundColor: isProcessing ? ["#38bdf8", "#fbbf24", "#38bdf8"] : "#38bdf8"
                        }}
                        transition={{ 
                           duration: 1 + (i % 3) * 0.5, 
                           repeat: Infinity,
                           delay: i * 0.1
                        }}
                        className="w-2 h-2 rounded-[1px] bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.8)]"
                     />
                   ))}
                </div>
            </div>
        </div>
      </motion.div>

      {/* Interaction Ripples */}
      <AnimatePresence>
        {isListening && (
          [...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
              className="absolute w-40 h-40 border border-sky-400/30 rounded-full"
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
