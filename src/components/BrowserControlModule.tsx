import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ExternalLink, MousePointer2, Keyboard, CheckCircle2, X, AlertCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface WebTask {
  id: string;
  url: string;
  action: 'open' | 'fill' | 'search' | 'click';
  status: 'pending' | 'executing' | 'completed';
  description: string;
  payload?: any;
}

export const BrowserControlModule: React.FC<{
  tasks: WebTask[];
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onAddTask: (task: Omit<WebTask, 'id' | 'status'>) => void;
}> = ({ tasks, onComplete, onCancel, onAddTask }) => {
  const [manualUrl, setManualUrl] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!manualUrl.trim()) {
      setError("Coordinates required, Sir.");
      return;
    }

    if (!isValidUrl(manualUrl)) {
      setError("Invalid protocol string. URL must be a valid web coordinate.");
      return;
    }

    const formattedUrl = manualUrl.startsWith('http') ? manualUrl : `https://${manualUrl}`;
    
    onAddTask({
      url: formattedUrl,
      action: 'open',
      description: `Manual Uplink: ${formattedUrl.replace(/^https?:\/\//, '').split('/')[0]}`,
    });
    
    setManualUrl('');
  };

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4 flex flex-col gap-3">
      {/* Manual Input Panel */}
      <div className="jarvis-panel p-3 border-sky-500/30 bg-slate-900/80 backdrop-blur-2xl">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={manualUrl}
              onChange={(e) => {
                setManualUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter URL for deep-packet inspection..."
              className={cn(
                "w-full bg-black/40 border rounded-xl px-4 py-2 text-[11px] font-mono outline-none transition-all",
                error ? "border-rose-500/50 text-rose-200" : "border-sky-500/20 text-sky-100 focus:border-sky-500/50"
              )}
            />
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-0 right-0 bg-rose-500/90 text-white text-[9px] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg"
              >
                <AlertCircle className="w-3 h-3" />
                {error}
              </motion.div>
            )}
          </div>
          <button 
            type="submit"
            className="p-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="jarvis-panel p-4 mb-3 border-l-4 border-sky-500 bg-slate-900/60 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-4">
                <div className={cn(
                  "p-3 rounded-2xl border",
                  task.status === 'executing' ? "bg-sky-500/20 border-sky-400 animate-pulse" : "bg-slate-800 border-slate-700"
                )}>
                  {task.action === 'open' && <Globe className="w-5 h-5 text-sky-400" />}
                  {task.action === 'fill' && <Keyboard className="w-5 h-5 text-amber-400" />}
                  {task.action === 'click' && <MousePointer2 className="w-5 h-5 text-emerald-400" />}
                  {task.action === 'search' && <Globe className="w-5 h-5 text-sky-400" />}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Web_Interaction_Protocol</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300/80 border border-sky-500/20 uppercase font-mono">
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-sky-50 uppercase tracking-tight mb-1">{task.description}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-100/40 font-mono italic">
                    <Globe className="w-3 h-3" />
                    {task.url.replace(/^https?:\/\//, '').split('/')[0]}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onCancel(task.id)}
                  className="p-2 hover:bg-rose-500/20 rounded-xl transition-colors text-slate-500 hover:text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const win = window.open(task.url, '_blank');
                    
                    // If it's a fill/neural task, send the injection request through the bridge
                    if (task.action === 'fill' && task.payload && win) {
                      // We wait for the load and then send the message
                      // Note: In a real extension, the content script handles this automatically on load
                      // Here we simulate the trigger from the OS HUD
                      setTimeout(() => {
                        win.postMessage({
                          type: "JARVIS_INJECTION_REQUEST",
                          payload: {
                            action: "fill",
                            selector: task.payload.selector || "input", // Default to first input if selector missing
                            value: task.payload.value || Object.values(task.payload)[0]
                          }
                        }, "*");
                      }, 2000);
                    }
                    onComplete(task.id);
                  }}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  <ExternalLink className="w-3 h-3" />
                  Execute
                </button>
              </div>
            </div>

            {task.action === 'fill' && task.payload && (
              <div className="mt-4 p-3 bg-black/40 rounded-xl border border-sky-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Keyboard className="w-3 h-3 text-amber-400/60" />
                  <span className="text-[8px] font-black text-amber-400/60 uppercase tracking-widest">Injection_Payload</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(task.payload).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-[8px] text-sky-100/30 uppercase font-mono">{k}</span>
                      <span className="text-[10px] text-sky-100/70 truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar */}
            {task.status === 'executing' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="absolute bottom-0 left-0 h-1 bg-sky-500 shadow-[0_0_10px_#0ea5e9]"
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
