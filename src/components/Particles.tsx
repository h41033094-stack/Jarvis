import React from 'react';
import { motion } from 'motion/react';

export const Particles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 
          }}
          animate={{ 
            y: [null, Math.random() * -100, null],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ 
            duration: 5 + Math.random() * 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute w-1 h-1 bg-sky-400 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};
