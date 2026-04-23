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
    <div className="fixed left-0 top-0 h-full w-80 p-6 flex flex-col gap-6 z-20">
      {/* HUD Edge Decoration */}
      <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/10 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-2 h-0.5 bg-cyan-400 pointer-events-none" />
      <div className="absolute top-3/4 left-0 w-2 h-0.5 bg-cyan-400 pointer-events-none" />

      {/* System Status: Diagnostic Matrix */}
      <div className="relative p-5 border border-cyan-500/20 bg-black/40 backdrop-blur-xl group overflow-hidden">
        {/* Corner Ticks */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60" />

        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-5 relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-2 glow-text">
            <Activity className="w-4 h-4 animate-pulse" /> Diagnostic_Link
          </h3>
          <button 
             onClick={onOpenSettings}
             className="p-1.5 hover:bg-cyan-500/20 rounded-sm transition-all text-cyan-400/60 hover:text-cyan-400"
          >
             <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="flex justify-between text-[8px] uppercase font-bold tracking-[0.2em] text-cyan-100/60">
              <span className="flex items-center gap-1.5">
                <div className="w-1 h-3 bg-cyan-500/40 rounded-full" />
                Cognitive_Sync
              </span>
              <span className="text-cyan-400 font-mono">92.44%</span>
            </div>
            <div className="w-full h-[3px] bg-cyan-900/40 overflow-hidden relative">
              <motion.div 
                 animate={{ 
                    width: "92%",
                    opacity: [0.6, 1, 0.6]
                 }} 
                 transition={{ duration: 4, repeat: Infinity }}
                 className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.8)]" 
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold tracking-[0.2em] text-cyan-100/40 uppercase">Neural_Uplink</span>
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2 px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/5 text-[9px] font-black text-emerald-400 rounded-sm"
            >
               SECURE_PROTOCOL_v5
            </motion.div>
          </div>
        </div>
      </div>

      {/* Habitat Ecosystem: Matrix Grid */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-4 bg-cyan-500 rounded-sm" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 glow-text">
            Matrix_Control
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
          {devices.map((device, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={device.id}
              onClick={() => onToggleDevice(device.id)}
              className={cn(
                "p-4 border transition-all cursor-pointer group relative overflow-hidden",
                device.status === 'on' 
                  ? "bg-cyan-500/10 border-cyan-500/40 shadow-[inset_0_0_20px_rgba(0,242,255,0.1)]" 
                  : "bg-black/40 border-cyan-400/10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
              )}
            >
              {device.status === 'on' && (
                <>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
                  <div className="absolute top-0 left-0 w-6 h-full bg-cyan-400/5 -skew-x-[20deg] animate-pulse" />
                </>
              )}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black tracking-widest text-cyan-100 uppercase">{device.name}</p>
                  <p className="text-[7px] opacity-40 uppercase tracking-[0.3em] font-mono mt-1">{device.room}</p>
                </div>
                {device.status === 'on' ? (
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-4 h-4 rounded-full border border-cyan-400 flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,242,255,1)]" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-cyan-400/20" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Console: High-Flow Telemetry */}
      <div className="h-72 border border-cyan-500/20 bg-black/60 font-mono text-[9px] overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30" />
        
        <div className="flex items-center justify-between px-4 py-3 text-cyan-400 border-b border-cyan-400/10 bg-cyan-500/5 relative z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 animate-pulse" /> 
            <span className="tracking-[0.4em] font-black uppercase">TELEMETRY_UPLINK</span>
          </div>
          <span className="text-[7px] opacity-40 font-mono">NODE_ALFA_7</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1.5 p-4 opacity-80 custom-scrollbar relative z-10">
          {logs.slice(-20).reverse().map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx} 
              className="group flex gap-2 items-start opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="text-cyan-500/40 font-mono text-[7px] mt-0.5">&gt;&gt;</span>
              <span className="text-cyan-100 leading-tight tracking-tight uppercase border-b border-transparent group-hover:border-cyan-400/20 pb-0.5"> 
                {log.replace(/_/g, ' ')}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="p-3 border-t border-cyan-500/10 flex items-center justify-between bg-cyan-500/5">
           <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 h-3 bg-cyan-400 rounded-[1px]" 
                />
              ))}
           </div>
           <span className="text-[7px] text-cyan-500/60 uppercase tracking-widest font-black">Sync_Buffered</span>
        </div>
      </div>
    </div>
  );
};
