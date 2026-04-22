import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, X, Volume2, Globe2, ArrowRightLeft, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (msg: string) => void;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({ isOpen, onClose, onLog }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Italian', 'Hindi'
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    onLog(`INITIATING_TRANSLATION_CORE: TARGET=${targetLang.toUpperCase()}`);
    
    // In this app, the main jarvisChat handles the complex logic via prompt,
    // but we simulate a dedicated translation UI update here.
    // For the UI-based translation, we'd typically call a service.
    // Since we're integrated with Gemini, we'll let the user know we're processing.
    
    setTimeout(() => {
      // This is a UI simulation of the translation feature being "Ready" 
      // The actual translation usually happens via the main voice/chat loop.
      setIsTranslating(false);
      onLog("TRANSLATION_SUBSYSTEM_NOMINAL");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed left-80 bottom-32 w-96 z-40"
        >
          <div className="glass rounded-[2rem] p-6 border-sky-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400">
                <Languages className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-widest glow-text">Linguistic_Matrix</h3>
              </div>
              <button onClick={onClose} className="text-sky-100/40 hover:text-sky-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Input text for translation..."
                  className="w-full h-24 bg-black/20 border border-sky-400/10 rounded-2xl p-3 text-[10px] font-mono text-sky-100 outline-none focus:border-sky-500/30 transition-all resize-none custom-scrollbar"
                />
                <Globe2 className="absolute bottom-3 right-3 w-3 h-3 text-sky-400/20" />
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="flex-1 bg-black/40 border border-sky-400/10 rounded-xl px-3 py-2 text-[10px] font-bold text-sky-400 outline-none hover:border-sky-500/30 transition-all cursor-pointer appearance-none"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="p-2 glass rounded-full text-sky-400">
                  <ArrowRightLeft className="w-3 h-3" />
                </div>
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="bg-sky-500 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sky-400 transition-all disabled:opacity-50"
                >
                  {isTranslating ? "Processing..." : "Translate"}
                </button>
              </div>

              {translatedText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-sky-500/5 border border-sky-500/20 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span className="text-[8px] font-bold text-sky-400 uppercase tracking-widest">Output_Result</span>
                  </div>
                  <p className="text-xs text-sky-100/90 italic">{translatedText}</p>
                </motion.div>
              )}
            </div>

            <div className="pt-2 border-t border-sky-400/10">
               <p className="text-[8px] text-sky-100/30 uppercase font-mono italic">
                 Note: Voice commands like "Translate 'Hello' to French" are also active Core Protocols.
               </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
