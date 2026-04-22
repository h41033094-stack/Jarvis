import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puzzle, ShieldCheck, Zap, Database, Terminal, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface Extension {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive';
  description: string;
  permissions: string[];
}

const REGISTERED_EXTENSIONS: Extension[] = [
  {
    id: 'jarvis-dom-bridge',
    name: 'J.A.R.V.I.S. Neural Link',
    version: '2.4.0',
    status: 'active',
    description: 'Enables deep-level DOM interaction and real-time site manipulation.',
    permissions: ['activeTab', 'scripting', 'storage']
  },
  {
    id: 'vault-sync',
    name: 'Vault Security Bridge',
    version: '1.2.1',
    status: 'active',
    description: 'Securely accesses saved credentials and environment variables from your local vault.',
    permissions: ['credentials', 'encryption']
  }
];

export const ExtensionBridgeModule: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'network'>('installed');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40"
        >
          <div className="w-full max-w-2xl jarvis-panel relative overflow-hidden bg-slate-900/80 border border-sky-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="p-6 border-b border-sky-400/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/20 rounded-lg border border-sky-500/40">
                  <Puzzle className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-sky-50 uppercase tracking-tighter">Extension_Uplink_Matrix</h2>
                  <p className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-sky-500/20 rounded-full transition-colors text-sky-400"
              >
                <Database className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 h-[400px] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {REGISTERED_EXTENSIONS.map((ext) => (
                  <motion.div
                    key={ext.id}
                    layoutId={ext.id}
                    className="p-4 bg-slate-800/40 border border-sky-500/10 rounded-2xl group hover:border-sky-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3">
                        <div className="p-2 bg-sky-500/10 rounded-xl group-hover:bg-sky-500/20 transition-colors">
                          <Zap className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-sky-100">{ext.name}</h3>
                          <span className="text-[9px] font-mono text-sky-400/60 uppercase tracking-widest">v{ext.version}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          ext.status === 'active' ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                        )} />
                        <span className="text-[9px] font-bold text-sky-100/40 uppercase">{ext.status}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-sky-100/60 mb-4 leading-relaxed italic">{ext.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {ext.permissions.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-sky-500/5 border border-sky-500/10 text-[8px] font-mono text-sky-400/60 uppercase">
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-sky-400/5 flex justify-end gap-3">
                      <button className="text-[10px] font-black text-sky-400 hover:text-sky-100 transition-colors uppercase tracking-widest flex items-center gap-1">
                        <Terminal className="w-3 h-3" />
                        Log_Stream
                      </button>
                      <button className="text-[10px] font-black text-sky-400 hover:text-sky-100 transition-colors uppercase tracking-widest flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        Configure
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-sky-500/5 border-t border-sky-400/10 flex items-center justify-between">
              <span className="text-[9px] text-sky-400/40 font-mono uppercase tracking-[0.2em]">Bridge_Status: STABLE_CONNECTION</span>
              <button className="px-6 py-2 bg-sky-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                Sync_Extensions
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
