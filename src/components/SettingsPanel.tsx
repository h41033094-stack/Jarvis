import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Volume2, Gauge, Activity, Radio, Music } from 'lucide-react';
import { Personality } from '../types';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  personality: Personality;
  onUpdatePersonality: (p: Personality) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  personality, 
  onUpdatePersonality,
  availableVoices
}) => {
  const britishVoices = availableVoices.filter(v => v.lang.includes('en-GB'));
  
  // If no GB voices, show all English as fallback
  const displayVoices = britishVoices.length > 0 ? britishVoices : availableVoices.filter(v => v.lang.includes('en'));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
        >
          <div className="glass w-full max-w-xl rounded-[2.5rem] p-8 border-sky-500/20 shadow-[0_0_100px_rgba(56,189,248,0.2)] bg-slate-950/90 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
             <div className="scanline opacity-10" />

             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3 text-sky-400">
                   <Settings className="w-6 h-6 animate-spin-slow" />
                   <h2 className="text-lg font-black uppercase tracking-[0.4em] glow-text italic">Neural_Vocal_Calibration</h2>
                </div>
                <button onClick={onClose} className="p-2 text-sky-100/40 hover:text-sky-400 transition-colors">
                   <X className="w-6 h-6" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Voice Selection */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-sky-400/60 uppercase text-[10px] font-bold tracking-widest">
                      <Radio className="w-4 h-4" /> Accent Matrix
                   </div>
                   <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {displayVoices.map((voice) => (
                        <button
                          key={voice.name}
                          onClick={() => onUpdatePersonality({ ...personality, voice: voice.name })}
                          className={cn(
                            "w-full p-3 rounded-xl border text-left transition-all group",
                            personality.voice === voice.name 
                              ? "bg-sky-500/20 border-sky-500 text-sky-100 shadow-[0_0_15px_rgba(56,189,248,0.2)]" 
                              : "bg-slate-900/40 border-sky-400/5 text-sky-100/40 hover:border-sky-400/30"
                          )}
                        >
                           <p className="text-[10px] font-bold tracking-tight uppercase">{voice.name}</p>
                           <p className="text-[8px] font-mono opacity-50 uppercase">{voice.lang}</p>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Calibration Sliders */}
                <div className="space-y-8">
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                            <span className="flex items-center gap-2"><Volume2 className="w-3.5 h-3.5" /> Pitch_Frequency</span>
                            <span className="text-sky-100">{(personality.pitch * 100).toFixed(0)}%</span>
                         </div>
                         <input 
                           type="range"
                           min="0.5" max="2" step="0.1"
                           value={personality.pitch}
                           onChange={(e) => onUpdatePersonality({ ...personality, pitch: parseFloat(e.target.value) })}
                           className="w-full h-1.5 bg-slate-800 rounded-full accent-sky-400 appearance-none cursor-pointer border border-sky-400/10"
                         />
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                            <span className="flex items-center gap-2"><Gauge className="w-3.5 h-3.5" /> Processing_Speed</span>
                            <span className="text-sky-100">{(personality.speed * 100).toFixed(0)}%</span>
                         </div>
                         <input 
                           type="range"
                           min="0.5" max="2" step="0.1"
                           value={personality.speed}
                           onChange={(e) => onUpdatePersonality({ ...personality, speed: parseFloat(e.target.value) })}
                           className="w-full h-1.5 bg-slate-800 rounded-full accent-sky-400 appearance-none cursor-pointer border border-sky-400/10"
                         />
                      </div>
                   </div>

                   <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-3">
                      <div className="flex items-center gap-2 text-sky-400/40 text-[8px] font-black uppercase tracking-widest">
                         <Activity className="w-3 h-3" /> Diagnostics_Bypass
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <button className="p-2 border border-sky-500/10 rounded-lg text-[9px] uppercase font-bold text-sky-100/40 hover:bg-sky-500/10 hover:text-sky-400 transition-all">Reset Sync</button>
                         <button className="p-2 border border-sky-500/10 rounded-lg text-[9px] uppercase font-bold text-sky-100/40 hover:bg-sky-500/10 hover:text-sky-400 transition-all tracking-tighter">Hard Reboot</button>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-sky-400/10">
                      <p className="text-[8px] font-mono text-sky-100/20 leading-relaxed uppercase">
                         Warning: Excessive vocal modulation may cause temporal dissonance in holographic dialogue streams. calibrating to current user biometric signature: TONY_STARK.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
