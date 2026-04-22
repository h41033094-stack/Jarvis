import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Terminal, Cloud, Shield, Power, Activity, Settings, User } from 'lucide-react';
import { SmartDevice } from '../types';
import { cn } from '../lib/utils';

interface SidePanelProps {
  devices: SmartDevice[];
  onToggleDevice: (id: string) => void;
  onOpenSettings?: () => void;
  logs: string[];
}

export const SidePanel: React.FC<SidePanelProps> = ({ devices, onToggleDevice, onOpenSettings, logs }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-80 p-4 flex flex-col gap-4 z-20">
      {/* System Status */}
      <div className="jarvis-panel p-4 border-l-4 border-sky-500 bg-slate-900/40 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2 glow-text">
            <Activity className="w-4 h-4 animate-pulse" /> System Diagnostics
          </h3>
          <button 
             onClick={onOpenSettings}
             className="p-1.5 hover:bg-sky-500/20 rounded-lg transition-colors text-sky-400/60 hover:text-sky-400"
          >
             <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter text-sky-100/60">
              <span>Cognitive Stability</span>
              <span className="text-sky-400">92%</span>
            </div>
            <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden border border-sky-400/10">
              <motion.div 
                 animate={{ 
                   width: "92%",
                   backgroundColor: ["#38bdf8", "#0ea5e9", "#38bdf8"]
                 }} 
                 transition={{ duration: 4, repeat: Infinity }}
                 className="h-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" 
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter">
            <span className="opacity-60">Neural Uplink</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-ping" />
               SECURE
            </div>
          </div>
        </div>
      </div>

      {/* Habitat Ecosystem */}
      <div className="jarvis-panel flex-1 p-4 flex flex-col min-h-0 bg-slate-900/40 backdrop-blur-md border-r-2 border-sky-500/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4 flex items-center gap-2 glow-text">
          <Power className="w-4 h-4" /> Habitat Matrix
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {devices.map((device, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={device.id}
              onClick={() => onToggleDevice(device.id)}
              className={cn(
                "p-4 rounded-2xl border transition-all hover:bg-sky-500/10 cursor-pointer group relative overflow-hidden",
                device.status === 'on' 
                  ? "bg-sky-500/10 border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.15)]" 
                  : "bg-slate-900/40 border-sky-400/5 opacity-50 grayscale"
              )}
            >
              {device.status === 'on' && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 blur-2xl -z-10" />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-tight text-sky-100 uppercase">{device.name}</p>
                  <p className="text-[9px] opacity-40 uppercase tracking-widest font-mono">{device.room}</p>
                </div>
                {device.status === 'on' ? (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" 
                  />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50 border border-slate-600" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Console */}
      <div className="jarvis-panel h-64 p-4 bg-black/60 font-mono text-[9px] overflow-hidden relative border-t-4 border-sky-500/30 flex flex-col">
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
        <div className="flex items-center justify-between mb-3 text-sky-400 border-b border-sky-400/10 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" /> <span className="tracking-[0.3em] font-bold uppercase">Stark_OS Terminal</span>
          </div>
          <span className="text-[8px] opacity-40">UTC-01</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 opacity-90 custom-scrollbar relative z-10 pr-2">
          {logs.slice(-15).reverse().map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx} 
              className="flex gap-3 items-start border-l-2 border-transparent hover:border-sky-500/40 hover:bg-sky-500/5 pl-2 py-0.5 transition-all"
            >
              <span className="opacity-30 text-[8px] text-sky-400 font-mono flex-shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
              <span className="text-sky-100 font-medium tracking-tight"> {log.toUpperCase()}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
