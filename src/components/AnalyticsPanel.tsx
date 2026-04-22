import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Link, AlignLeft, X, Sparkles, Loader2 } from 'lucide-react';
import { summarizeDocument } from '../services/geminiService';
import { SummaryLength } from '../types';
import { cn } from '../lib/utils';

export const AnalyticsPanel: React.FC<{ isOpen: boolean; onClose: () => void; onLog: (msg: string) => void }> = ({ isOpen, onClose, onLog }) => {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [content, setContent] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!content.trim()) return;
    setIsSummarizing(true);
    setResult(null);
    onLog(`ANALYZING_DOCUMENT: ${mode.toUpperCase()}...`);

    const summary = await summarizeDocument(content, length);
    setResult(summary || "Analysis failed, Sir.");
    setIsSummarizing(false);
    onLog("ANALYSIS_COMPLETE");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: '100%' }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: '100%' }}
          className="fixed inset-y-0 right-0 w-[500px] z-50 p-6"
        >
          <div className="w-full h-full glass rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -z-10 rounded-full" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-tight glow-text text-sky-100 uppercase">Document Analysis</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-sky-400/50 hover:text-sky-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
              <button
                onClick={() => setMode('text')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                  mode === 'text' ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-lg" : "text-sky-100/40 hover:text-sky-100"
                )}
              >
                <AlignLeft className="w-3 h-3" /> Raw Text
              </button>
              <button
                onClick={() => setMode('url')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                  mode === 'url' ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-lg" : "text-sky-100/40 hover:text-sky-100"
                )}
              >
                <Link className="w-3 h-3" /> Intel URL
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={mode === 'text' ? "Sir, please provide the text data here..." : "Provide the document URL for ingestion..."}
                className="flex-1 w-full bg-black/20 rounded-2xl p-4 text-sm font-mono outline-none border border-sky-400/10 focus:border-sky-400/30 placeholder:opacity-20 resize-none transition-all custom-scrollbar"
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {(['short', 'medium', 'detailed'] as SummaryLength[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                        length === l ? "bg-sky-500/20 border-sky-500 text-sky-400" : "bg-transparent border-sky-400/10 text-sky-100/40"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing || !content.trim()}
                  className="bg-sky-500 text-slate-950 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-sky-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                  {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Execute Analysis
                </button>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-64 glass rounded-2xl p-4 flex flex-col gap-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                    <span>Summary_Output</span>
                    <span className="opacity-50">v4.0.2_Core</span>
                  </div>
                  <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-sky-100/80 pr-2 custom-scrollbar italic">
                    {result}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
