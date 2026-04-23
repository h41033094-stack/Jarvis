import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Layout, Zap, Eye, CheckCircle2, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface UISelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (theme: 'vanguard' | 'zenith' | 'edex') => void;
  currentTheme: string;
}

export const UISelector: React.FC<UISelectorProps> = ({ isOpen, onClose, onSelect, currentTheme }) => {
  const profiles = [
    { 
      id: 'vanguard', 
      name: 'Tactical_Vanguard', 
      desc: 'High-res technical monitoring. Sharp blue spectrum.', 
      accent: 'border-sky-500', 
      color: 'text-sky-400' 
    },
    { 
      id: 'zenith', 
      name: 'Executive_Zenith', 
      desc: 'Minimalist focus mode. Calming cyan glass.', 
      accent: 'border-cyan-400', 
      color: 'text-cyan-400' 
    },
    { 
      id: 'edex', 
      name: 'Cinematic_eDEX', 
      desc: 'Total terminal immersion. Neon lime energy.', 
      accent: 'border-lime-400', 
      color: 'text-lime-400' 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
        >
          <div className="w-full max-w-4xl space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-[0.4em] text-white italic glow-text">Research_&_Development</h2>
              <p className="text-sky-400/40 text-[10px] font-mono tracking-[0.5em] uppercase">Neural Architecture Optimization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => onSelect(profile.id as any)}
                  className={cn(
                    "hud-panel p-6 cursor-pointer group transition-all duration-500",
                    currentTheme === profile.id ? "bg-sky-500/10 border-sky-400" : "hover:bg-sky-500/5"
                  )}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className={cn("w-12 h-1 bg-current", profile.color)} />
                      {currentTheme === profile.id && <CheckCircle2 className="w-4 h-4 text-sky-400 animate-pulse" />}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-black tracking-tighter text-white uppercase italic">{profile.name}</h3>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-loose">
                        {profile.desc}
                      </p>
                    </div>

                    <div className="h-24 relative overflow-hidden border border-white/5 rounded-lg bg-black/40">
                       {/* Mini Preview Effect */}
                       <div className={cn(
                         "absolute inset-0 opacity-20",
                         profile.id === 'edex' ? "bg-lime-500/10" : profile.id === 'zenith' ? "bg-cyan-500/10" : "bg-sky-500/10"
                       )} />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center grayscale opacity-40">
                          <div className={cn("w-2 h-2 rounded-full", profile.color, "bg-current")} />
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-6">
               <button 
                 onClick={onClose}
                 className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-sky-400/40 hover:text-sky-400 transition-colors"
               >
                 Abort_Calibration
               </button>
               <button 
                 onClick={onClose}
                 className="px-12 py-3 bg-sky-500 text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_0_30px_rgba(56,189,248,0.4)]"
               >
                 Confirm_Neural_Profile
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
