import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const JarvisOrb: React.FC<{ 
  isListening: boolean; 
  isActive: boolean; 
  isProcessing: boolean;
  onClick?: () => void;
}> = ({ isListening, isActive, isProcessing, onClick }) => {
  return (
    <div 
      className="relative flex items-center justify-center w-[400px] h-[400px] cursor-pointer"
      onClick={onClick}
    >
      {/* Outer Rotating Structures */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            rotate: i % 2 === 0 ? 360 : -360,
            scale: isProcessing ? [1, 1.02, 1] : 1 
          }}
          transition={{ 
            rotate: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className={cn(
            "absolute border rounded-full",
            i === 0 ? "w-full h-full border-cyan-500/10 border-dashed" : 
            i === 1 ? "w-[92%] h-[92%] border-cyan-400/20 border-dotted" : 
            i === 2 ? "w-[85%] h-[85%] border-cyan-300/30 border-[4px] border-double" :
            "w-[75%] h-[75%] border-cyan-200/40 border-[1px]"
          )}
        >
           {i === 2 && (
             <motion.div 
               animate={{ opacity: [0.2, 0.8, 0.2] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,242,255,1)]" 
             />
           )}
        </motion.div>
      ))}

      {/* Pulsing Atmosphere */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.2, 1] : isProcessing ? [1, 0.95, 1.05, 1] : [1, 1.05, 1],
          opacity: isListening ? [0.1, 0.3, 0.1] : 0.1,
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px]"
      />

      {/* Core Orb Container */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.1, 1] : 1,
          opacity: isActive ? 1 : 0.7,
        }}
        className="relative w-48 h-48 rounded-full bg-black border border-cyan-400/50 flex items-center justify-center shadow-[0_0_80px_rgba(0,242,255,0.2)] overflow-hidden"
      >
        {/* Arc Reactor Texture */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,transparent_0%,#000_80%)]" />
        <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_30deg,rgba(0,242,255,0.05)_30deg,rgba(0,242,255,0.05)_60deg)] animate-spin-slow" />
        
        <div className="relative w-36 h-36 rounded-full border border-cyan-500/40 flex items-center justify-center">
            {/* Spinning Arc Segments */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-t-4 border-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.5)]"
            />
            
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-6 border-b-2 border-cyan-300 rounded-full opacity-60"
            />

            {/* Neural Matrix Core */}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-cyan-500/10 shadow-[inset_0_0_30px_rgba(0,242,255,0.5)]">
                <div className="grid grid-cols-4 gap-1 p-2">
                   {[...Array(16)].map((_, i) => (
                     <motion.div 
                        key={i}
                        animate={{ 
                          scale: [1, 1.8, 1],
                          opacity: [0.3, 1, 0.3],
                          backgroundColor: isProcessing ? ["#00f2ff", "#ff4e4e", "#00f2ff"] : "#00f2ff"
                        }}
                        transition={{ 
                           duration: 0.8 + (i % 4) * 0.3, 
                           repeat: Infinity,
                           delay: i * 0.05
                        }}
                        className="w-2 h-2 rounded-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.8)]"
                     />
                   ))}
                </div>
            </div>
        </div>
      </motion.div>

      {/* Peripheral HUD Ticks */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full pointer-events-none"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-cyan-500/30" />
        </div>
      ))}

      {/* Interaction Ripples */}
      <AnimatePresence>
        {isListening && (
          [...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.75, ease: "easeOut" }}
              className="absolute w-48 h-48 border border-cyan-400/50 rounded-full shadow-[0_0_20px_rgba(0,242,255,0.3)]"
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
