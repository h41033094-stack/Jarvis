import React from 'react';
import { motion } from 'motion/react';
import { Folder, File, Cpu, Activity, Globe, Keyboard as KeyboardIcon, Terminal } from 'lucide-react';

export const EdexKeyboard = () => {
  const rows = [
    ["ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BSPC"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ENTER"],
    ["SHFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHFT"],
    ["CTRL", "OPT", "CMD", "SPACE", "CMD", "OPT", "CTRL"]
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 p-4 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md h-full">
      <div className="flex items-center gap-2 mb-2 text-[8px] font-bold tracking-widest text-[var(--accent-primary)]/40 uppercase">
        <KeyboardIcon className="w-3 h-3" /> Virtual_Peripheral_Lattice_v4.2
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {row.map((key) => (
            <div 
              key={key} 
              className={`
                h-10 flex items-center justify-center rounded-sm border border-[var(--panel-border)] bg-[var(--accent-primary)]/5 
                text-[9px] font-mono font-bold transition-all hover:bg-[var(--accent-primary)]/20 hover:text-[var(--accent-primary)]
                ${key === 'SPACE' ? 'flex-[6]' : 'flex-1'}
                ${['SHFT', 'ENTER', 'BSPC', 'TAB', 'CAPS', 'CTRL', 'OPT', 'CMD'].includes(key) ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]/60' : 'text-[var(--accent-primary)]/40'}
              `}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const EdexFileTree = () => {
  const folders = [
    { name: 'SYSTEM_ROOT', items: ['kernel.sys', 'drivers/', 'config/'] },
    { name: 'NEURAL_NET', items: ['nlp_core.bin', 'vision_proc/', 'audio_synth/'] },
    { name: 'USER_DATA', items: ['documents/', 'vault/', 'logs/'] },
    { name: 'SATELLITE_LINK', items: ['uplink.io', 'downlink/', 'encryption/'] }
  ];

  return (
    <div className="w-full h-full p-6 space-y-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2">
         <span className="text-[10px] font-black tracking-widest text-[var(--accent-primary)] italic">STORAGE_LATTICE</span>
         <Folder className="w-3 h-3 text-[var(--accent-primary)]/40" />
      </div>
      
      {folders.map((folder, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[var(--accent-primary)]" 
            />
            <span className="text-[9px] font-bold tracking-widest text-[var(--accent-primary)]/80 uppercase">{folder.name}</span>
          </div>
          <div className="pl-6 space-y-2 border-l border-[var(--panel-border)] ml-1">
            {folder.items.map((item, j) => (
              <div key={j} className="flex items-center justify-between group cursor-pointer">
                <span className="text-[8px] font-mono text-[var(--accent-primary)]/40 group-hover:text-[var(--accent-primary)] transition-colors">{item}</span>
                {item.endsWith('/') ? <Folder className="w-2.5 h-2.5 text-[var(--accent-primary)]/20" /> : <File className="w-2.5 h-2.5 text-[var(--accent-primary)]/10" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const EdexSystemMonitor = () => {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2">
         <span className="text-[10px] font-black tracking-widest text-[var(--accent-primary)] italic">RESOURCE_MONITOR</span>
         <Activity className="w-3 h-3 text-[var(--accent-primary)]/40" />
      </div>
      
      <div className="space-y-4">
        {[
          { label: 'CPU_LOAD', val: '42.8%', icon: <Cpu className="w-3 h-3" /> },
          { label: 'NET_TRAFFIC', val: '128KB/S', icon: <Globe className="w-3 h-3" /> },
          { label: 'MEM_BUFFER', val: '6.4GB', icon: <Terminal className="w-3 h-3" /> }
        ].map((stat, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-center text-[8px] font-bold text-[var(--accent-primary)]/40 tracking-widest uppercase">
              <span className="flex items-center gap-1">{stat.icon} {stat.label}</span>
              <span className="text-[var(--accent-primary)]">{stat.val}</span>
            </div>
            <div className="h-1 w-full bg-[var(--accent-primary)]/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: stat.val }}
                 className="h-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" 
               />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 border border-[var(--panel-border)] bg-[var(--accent-primary)]/5 rounded-lg flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-[var(--accent-primary)]" />
            ))}
         </div>
         <Globe className="w-24 h-24 text-[var(--accent-primary)]/20 animate-spin-slow" />
         <div className="absolute bottom-2 right-2 text-[7px] font-mono text-[var(--accent-primary)]/40 uppercase tracking-tighter">Geo_Sync: ACTIVE</div>
      </div>
    </div>
  );
};
