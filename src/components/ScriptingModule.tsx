import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Bug, Play, Save, Code, Brackets, Wand2, X, CheckCircle2, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';

export const ScriptingModule: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onLog: (msg: string) => void;
  initialCode?: string;
  initialFilename?: string;
}> = ({ isOpen, onClose, onLog, initialCode, initialFilename }) => {
  const [code, setCode] = useState('// StarkOS Scripting Platform\n// Initializing Neural Interface...\n\nfunction executeProtocol() {\n  console.log("Sir, I am initializing the sub-routine.");\n  // Deploying logic...\n}');
  const [filename, setFilename] = useState('protocol_executor.ts');
  const [output, setOutput] = useState<string[]>(['[SYSTEM] Logic core synchronized.', '[SYSTEM] Press play to begin debugging.']);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setOutput(['[SYSTEM] Logic core synchronized.', '[SYSTEM] New script received from J.A.R.V.I.S.']);
    }
    if (initialFilename) {
      setFilename(initialFilename);
    }
  }, [initialCode, initialFilename, isOpen]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'error' | 'success'>('idle');

  const runCode = () => {
    setIsExecuting(true);
    setStatus('running');
    onLog("COMPILING_NEURAL_SCRIPTOR: OPTIMIZING_SYMBOLS");
    
    setOutput(prev => [...prev, `> Executing script...`]);
    
    setTimeout(() => {
      onLog("DEBUGGING_PHASE: RESOLVING_DEPENDENCIES");
      setOutput(prev => [...prev, `[LOG] Logic gate verified.`]);
      
      setTimeout(() => {
        setIsExecuting(false);
        setStatus('success');
        onLog("SCRIPT_EXECUTION_SUCCESSFUL: DATA_PERSISTED");
        setOutput(prev => [...prev, `[SUCCESS] Sub-routine completed in 14ms.`]);
      }, 1000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -100 }}
          className="fixed left-80 top-32 w-[32rem] z-40 h-[28rem]"
        >
          <div className="glass rounded-[2rem] p-6 border-sky-500/20 shadow-[0_0_80px_rgba(56,189,248,0.15)] flex flex-col h-full bg-slate-950/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-sky-400">
                <Code className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-widest glow-text">Stark_Scripting_IDE</h3>
              </div>
              <button onClick={onClose} className="text-sky-100/40 hover:text-sky-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
               {/* Editor Section */}
               <div className="flex-1 bg-black/40 border border-sky-400/10 rounded-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border-b border-sky-400/10">
                     <Brackets className="w-3 h-3 text-sky-400/60" />
                     <span className="text-[8px] font-mono text-sky-400/60 uppercase">{filename}</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 w-full bg-transparent p-4 text-[10px] font-mono text-sky-300 outline-none resize-none custom-scrollbar selection:bg-sky-500/30"
                    spellCheck={false}
                  />
               </div>

               {/* Toolbar */}
               <div className="flex items-center gap-3">
                  <button 
                    onClick={runCode}
                    disabled={isExecuting}
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 px-4 py-2 rounded-xl transition-all"
                  >
                    {isExecuting ? (
                      <RotateCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest">Execute_Node</span>
                  </button>
                  <button className="p-2.5 glass border-sky-400/10 text-sky-400 hover:border-sky-400/40 transition-all rounded-xl">
                    <Save className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 glass border-sky-400/10 text-sky-400 hover:border-sky-400/40 transition-all rounded-xl">
                    <Bug className="w-4 h-4" />
                  </button>
               </div>

               {/* Terminal Output */}
               <div className="h-24 bg-black/60 border border-sky-400/10 rounded-2xl p-3 font-mono overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-2 mb-2 text-sky-400/40">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[8px] uppercase tracking-widest">Debug_Output</span>
                  </div>
                  {output.map((line, i) => (
                    <div key={i} className="text-[9px] text-sky-200/80 mb-1 flex items-start gap-2">
                      <span className="text-sky-500/40 select-none">[{i}]</span>
                      <span>{line}</span>
                    </div>
                  ))}
                  {status === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-400 text-[9px] pt-1">
                       <CheckCircle2 className="w-3 h-3" /> 
                       <span>Protocol optimization complete. Ready for deployment, Sir.</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-400/10 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[8px] text-sky-100/30 uppercase font-mono italic">
                  <Wand2 className="w-2.5 h-2.5" />
                  <span>AI_Co-Pilot: Active and assisting with logic flows</span>
               </div>
               <span className="text-[8px] font-bold text-sky-500/40 tracking-widest">TS_V5.4.2</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
