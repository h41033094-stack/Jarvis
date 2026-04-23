import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Search, X, Zap, Cpu, Activity, LayoutGrid } from 'lucide-react';
import { desktopBridge } from '../services/desktopBridge';

interface AppLatticeProps {
  isOpen: boolean;
  onClose: () => void;
  apps: { name: string; path: string }[];
  onLog: (msg: string) => void;
}

export const AppLattice: React.FC<AppLatticeProps> = ({ isOpen, onClose, apps, onLog }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const launchApp = async (app: { name: string; path: string }) => {
    onLog(`INITIATING_SOFTWARE_LAUNCH: ${app.name.toUpperCase()}`);
    const success = await desktopBridge.openApp(app.path);
    if (success) {
      onLog(`LAUNCH_SUCCESS: ${app.name.toUpperCase()}`);
      onClose();
    } else {
      onLog(`LAUNCH_ERROR: ${app.name.toUpperCase()} [SYSTEM_DENIED]`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
        >
          <div className="glass w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] p-8 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <LayoutGrid className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-[0.3em] glow-text italic text-sky-400">SOFTWARE_LATTICE_SYNC</h2>
                  <p className="text-sky-100/40 text-[9px] font-mono tracking-widest uppercase">{apps.length} ACTIVE_NODES_IDENTIFIED_IN_LOCAL_ROOT</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/40 group-focus-within:text-sky-400 transition-colors" />
                   <input 
                      type="text" 
                      placeholder="SEARCH_NODE..."
                      className="bg-slate-900/60 border border-sky-500/20 rounded-xl py-2 pl-10 pr-4 text-[10px] uppercase font-bold tracking-widest text-sky-100 outline-none focus:border-sky-500/50 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <button onClick={onClose} className="p-2 text-sky-100/40 hover:text-sky-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
              {filteredApps.map((app, i) => (
                <motion.button
                  key={app.path + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => launchApp(app)}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-sky-500/5 border border-sky-500/10 hover:border-sky-500/50 transition-all text-center gap-3"
                >
                  <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/5 transition-all rounded-2xl" />
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-100 truncate w-full max-w-[120px]">{app.name}</p>
                    <p className="text-[7px] font-mono opacity-30 text-sky-100/80 truncate w-full max-w-[120px] pb-1 border-b border-sky-500/0 group-hover:border-sky-500/20 transition-all">{app.path}</p>
                  </div>
                </motion.button>
              ))}
              
              {filteredApps.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-sky-100/20">
                  <Activity className="w-12 h-12" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No nodes match current search parameters</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-sky-400/10 flex justify-between items-center">
              <div className="flex items-center gap-4 text-[8px] font-mono text-sky-100/20 uppercase">
                <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> Core_Sync: ACTIVE</span>
                <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Uplink: NOMINAL</span>
              </div>
              <p className="text-[8px] font-mono text-sky-500/40 uppercase animate-pulse">Monitoring_System_Lattice_v1.4.2</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
