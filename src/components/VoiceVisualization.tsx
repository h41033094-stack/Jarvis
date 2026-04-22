import React from 'react';
import { motion } from 'motion/react';

export const VoiceVisualization: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-[200px]">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isSpeaking ? [4, Math.random() * 40 + 10, 4] : 4,
            opacity: isSpeaking ? [0.4, 1, 0.4] : 0.2,
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            delay: i * 0.05,
          }}
          className="w-1 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        />
      ))}
    </div>
  );
};
