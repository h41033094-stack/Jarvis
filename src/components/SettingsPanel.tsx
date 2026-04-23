import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Volume2, Gauge, Activity, Radio, Music, Zap, Globe, Cpu, Eye } from 'lucide-react';
import { Personality } from '../types';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  personality: Personality;
  onUpdatePersonality: (p: Personality) => void;
  availableVoices: SpeechSynthesisVoice[];
  // Tactical controls
  telemetryLevel: number;
  setTelemetryLevel: (v: number) => void;
  satelliteStatus: 'online' | 'limited' | 'offline';
  setSatelliteStatus: (v: 'online' | 'limited' | 'offline') => void;
  powerEfficiency: number;
  setPowerEfficiency: (v: number) => void;
  activeArmor: string;
  setActiveArmor: (v: string) => void;
  isSentinelActive: boolean;
  setSentinelActive: (v: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  personality, 
  onUpdatePersonality,
  availableVoices,
  telemetryLevel,
  setTelemetryLevel,
  satelliteStatus,
  setSatelliteStatus,
  powerEfficiency,
  setPowerEfficiency,
  activeArmor,
  setActiveArmor,
  isSentinelActive,
  setSentinelActive
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
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
        >
          <div className="glass w-full max-w-xl rounded-[2.5rem] p-8 border-sky-500/20 shadow-[0_0_100px_rgba(56,189,248,0.2)] bg-slate-950/90 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
             <div className="scanline opacity-10" />

             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3 text-sky-400">
                   <Settings className="w-6 h-6 animate-spin-slow" />
                   <h2 className="text-lg font-black uppercase tracking-[0.4em] glow-text italic">Neural_Tactical_Calibration</h2>
                </div>
                <button onClick={onClose} className="p-2 text-sky-100/40 hover:text-sky-400 transition-colors">
                   <X className="w-6 h-6" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Left Column: Voice & Network */}
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sky-400/60 uppercase text-[10px] font-bold tracking-widest">
                         <Radio className="w-4 h-4" /> Accent Matrix
                      </div>
                      <div className="space-y-2 h-44 overflow-y-auto pr-2 custom-scrollbar">
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

                   <div className="pt-4 border-t border-sky-400/10 space-y-4">
                      <div className="flex items-center gap-2 text-sky-400/60 uppercase text-[10px] font-bold tracking-widest">
                         <Globe className="w-4 h-4" /> Satellite_Network
                      </div>
                      <div className="flex gap-2">
                         {(['online', 'limited', 'offline'] as const).map((status) => (
                           <button
                             key={status}
                             onClick={() => setSatelliteStatus(status)}
                             className={cn(
                               "flex-1 p-2 rounded-lg border text-[9px] font-bold uppercase transition-all",
                               satelliteStatus === status 
                                 ? "bg-sky-500/20 border-sky-500 text-sky-400" 
                                 : "bg-slate-900 border-sky-400/10 text-sky-100/30 hover:border-sky-400/30"
                             )}
                           >
                             {status}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="pt-4 border-t border-sky-400/10 space-y-4">
                       <div className="flex items-center gap-2 text-sky-400/60 uppercase text-[10px] font-bold tracking-widest">
                          <Eye className="w-4 h-4" /> Sentinel_Guard
                       </div>
                       <button
                          onClick={() => setSentinelActive(!isSentinelActive)}
                          className={cn(
                            "w-full p-3 rounded-xl border flex items-center justify-between transition-all group",
                            isSentinelActive 
                              ? "bg-red-500/20 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                              : "bg-slate-900 border-sky-400/10 text-sky-100/30 hover:border-sky-400/30"
                          )}
                       >
                          <span className="text-[10px] font-bold tracking-widest uppercase">
                            {isSentinelActive ? "SENTINEL_ACTIVE" : "SENTINEL_DISENGAGED"}
                          </span>
                          <div className={cn(
                             "w-4 h-4 rounded-full border-2 transition-all",
                             isSentinelActive ? "bg-red-500 border-white/20 animate-pulse" : "border-sky-400/20"
                          )} />
                       </button>
                    </div>
                </div>

                {/* Right Column: Suit & Power */}
                <div className="space-y-6">
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                            <span className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Armor_Sync</span>
                            <span className="text-sky-100">{activeArmor}</span>
                         </div>
                         <select 
                           value={activeArmor}
                           onChange={(e) => setActiveArmor(e.target.value)}
                           className="w-full bg-slate-900/60 border border-sky-500/20 rounded-xl p-3 text-[10px] text-sky-100 outline-none focus:border-sky-500/50 appearance-none"
                         >
                           <option value="MARK_85">MARK_85 (NANO-TECH)</option>
                           <option value="MARK_50">MARK_50 (EXTREMIS)</option>
                           <option value="MARK_43">MARK_43 (SENTRY)</option>
                           <option value="HULKBUSTER">MARK_44 (HULKBUSTER)</option>
                         </select>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                            <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Power_Efficiency</span>
                            <span className="text-sky-100">{powerEfficiency.toFixed(0)}%</span>
                         </div>
                         <input 
                           type="range"
                           min="10" max="100" step="1"
                           value={powerEfficiency}
                           onChange={(e) => setPowerEfficiency(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-800 rounded-full accent-cyan-400 appearance-none cursor-pointer border border-sky-400/10"
                         />
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                            <span className="flex items-center gap-2"><Gauge className="w-3.5 h-3.5" /> Speech_Cadence</span>
                            <span className="text-sky-100">{personality.speed.toFixed(1)}x</span>
                         </div>
                         <input 
                           type="range"
                           min="0.5" max="2" step="0.1"
                           value={personality.speed}
                           onChange={(e) => onUpdatePersonality({ ...personality, speed: parseFloat(e.target.value) })}
                           className="w-full h-1.5 bg-slate-800 rounded-full accent-cyan-400 appearance-none cursor-pointer border border-sky-400/10"
                         />
                      </div>

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
                   </div>

                   <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-3">
                      <div className="flex items-center gap-2 text-sky-400/40 text-[8px] font-black uppercase tracking-widest">
                         <Activity className="w-3 h-3" /> System_Integrity
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <button className="p-2 border border-sky-500/10 rounded-lg text-[9px] uppercase font-bold text-sky-100/40 hover:bg-sky-500/10 hover:text-sky-400 transition-all">Clear Logs</button>
                         <button className="p-2 border border-sky-500/10 rounded-lg text-[9px] uppercase font-bold text-sky-100/40 hover:bg-sky-500/10 hover:text-sky-400 transition-all tracking-tighter">Full Reboot</button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-4 border-t border-sky-400/10">
                <p className="text-[8px] font-mono text-sky-100/20 leading-relaxed uppercase">
                   Warning: Tactical sensor integration requires active satellite uplink. power efficiency fluctuations may impact real-time telemetry resolution. synchronizing with user signature: TONY_STARK.
                </p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
