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
      className="relative flex items-center justify-center w-[400px] h-[400px] cursor-pointer group"
      onClick={onClick}
    >
      {/* Structural Orbitals - Clean, Unified Lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            rotate: i % 2 === 0 ? 360 : -360,
            scale: isProcessing ? [1, 1.05, 1] : 1 
          }}
          transition={{ 
            rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className={cn(
            "absolute border rounded-full transition-colors duration-1000",
            i === 0 ? "w-full h-full border-sky-400/5" : 
            i === 1 ? "w-[90%] h-[90%] border-sky-400/10" : 
            "w-[80%] h-[80%] border-sky-400/20"
          )}
        />
      ))}

      {/* Atmospheric Glow Core */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.15, 1] : 1,
          opacity: isListening ? [0.4, 0.6, 0.4] : 0.3,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full bg-sky-500/20 blur-[100px]"
      />

      {/* The Central Singularity */}
      <motion.div
        animate={{
          scale: isListening ? [0.95, 1.05, 0.95] : 1,
        }}
        className="relative w-56 h-56 rounded-full bg-slate-950 border border-sky-400/30 flex items-center justify-center shadow-[0_0_100px_rgba(56,189,248,0.1)] overflow-hidden"
      >
        {/* Internal Depth Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_70%)]" />
        
        {/* High-Fidelity Arc Rails */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[10%] border-t-[1px] border-sky-400/40 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] border-b-[1px] border-sky-400/20 rounded-full"
        />

        {/* Neural Synapse Center */}
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-sky-950/20 backdrop-blur-sm border border-sky-400/10">
           <div className="grid grid-cols-3 gap-2">
             {[...Array(9)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ 
                   opacity: [0.1, 1, 0.1],
                   scale: isProcessing ? [1, 1.5, 1] : 1,
                   backgroundColor: isProcessing ? ["#38bdf8", "#fb7185", "#38bdf8"] : "#38bdf8"
                 }}
                 transition={{ 
                   duration: 1.5, 
                   repeat: Infinity, 
                   delay: i * 0.15,
                   ease: "easeInOut"
                 }}
                 className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"
               />
             ))}
           </div>
           
           {/* Center Point */}
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_#fff]"
           />
        </div>
      </motion.div>

      {/* Compass Markers */}
      {[...Array(48)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full pointer-events-none"
          style={{ transform: `rotate(${i * 7.5}deg)` }}
        >
          <div className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 bg-sky-400/20 shadow-[0_0_5px_rgba(56,189,248,0.1)]",
            i % 12 === 0 ? "w-[1px] h-4 bg-sky-400/40" : "w-[0.5px] h-2"
          )} />
        </div>
      ))}
    </div>
  );
};
