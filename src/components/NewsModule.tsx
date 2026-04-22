import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, ThumbsUp, ThumbsDown, ExternalLink, RefreshCw, X, Radio, Sparkles } from 'lucide-react';
import { NewsArticle, NewsPreference } from '../types';
import { cn } from '../lib/utils';

interface NewsModuleProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (msg: string) => void;
  preferences: NewsPreference;
  onUpdatePreferences: (newPrefs: NewsPreference) => void;
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Stark Industries Unveils Arc Reactor v5',
    summary: 'The new clean energy initiative promises 200% efficiency gains for residential cities.',
    source: 'TechCrunch',
    url: 'https://techcrunch.com/stark-arc-v5',
    topic: 'Technology',
    timestamp: Date.now() - 3600000,
    sentiment: 'positive'
  },
  {
    id: '2',
    title: 'Global Space Agency Announces Mars Colony Phase 1',
    summary: 'Collaborative effort led by major tech leaders to establish a permanent presence by 2030.',
    source: 'Discovery',
    url: 'https://discovery.com/mars-colony',
    topic: 'Space',
    timestamp: Date.now() - 7200000,
    sentiment: 'neutral'
  },
  {
    id: '3',
    title: 'Quantum Computing Reaches Stability Milestone',
    summary: 'Researchers demonstrate error-correcting qubits capable of running complex simulations.',
    source: 'Nature',
    url: 'https://nature.com/quantum-stability',
    topic: 'Science',
    timestamp: Date.now() - 10800000,
    sentiment: 'positive'
  }
];

export const NewsModule: React.FC<NewsModuleProps> = ({ 
  isOpen, 
  onClose, 
  onLog, 
  preferences, 
  onUpdatePreferences 
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFeedback = (id: string, liked: boolean) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    onLog(`NEWS_FEEDBACK_RECEIVED: Article ${id} | ${liked ? 'POSITIVE' : 'NEGATIVE'}`);

    const newFeedback = { articleId: id, liked, timestamp: Date.now() };
    const updatedPrefs = {
      ...preferences,
      feedbackHistory: [...preferences.feedbackHistory, newFeedback],
      topics: liked ? [...new Set([...preferences.topics, article.topic])] : preferences.topics,
      dislikedTopics: !liked ? [...new Set([...preferences.dislikedTopics, article.topic])] : preferences.dislikedTopics
    };

    onUpdatePreferences(updatedPrefs);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const refreshFeed = () => {
    setIsRefreshing(true);
    onLog("RECALIBRATING_NEWS_UPLINK: ANALYZING_PREFERENCES");
    
    setTimeout(() => {
      setIsRefreshing(false);
      onLog("NEWS_FEED_SYNCHRONIZED");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed right-8 top-32 w-96 max-h-[calc(100vh-160px)] z-40 flex flex-col"
        >
          <div className="glass rounded-[2rem] p-6 border-sky-500/20 shadow-[0_0_80px_rgba(56,189,248,0.15)] flex flex-col h-full bg-slate-950/80 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-sky-400">
                <Radio className="w-5 h-5 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] glow-text">Stark_Comm_Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={refreshFeed}
                  className="p-2 text-sky-400/60 hover:text-sky-400 transition-colors"
                >
                  <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                </button>
                <button onClick={onClose} className="p-2 text-sky-100/40 hover:text-rose-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
              {isRefreshing ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 border-2 border-sky-400 border-t-transparent rounded-full shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  />
                  <p className="text-[10px] font-mono text-sky-400 uppercase tracking-widest animate-pulse">Scanning Neural Uplink...</p>
                </div>
              ) : articles.length > 0 ? (
                articles.map((article, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={article.id}
                    className="group relative p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl hover:border-sky-500/30 transition-all hologram-flicker"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[8px] font-bold text-sky-500 uppercase tracking-widest">{article.topic}</span>
                      <span className="text-[8px] text-sky-100/40 font-mono">{article.source}</span>
                    </div>
                    <h4 className="text-xs font-bold text-sky-100 mb-2 leading-tight group-hover:text-sky-400 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-sky-100/60 mb-4 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleFeedback(article.id, true)}
                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleFeedback(article.id, false)}
                          className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => window.open(article.url, '_blank')}
                        className="text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-sky-400/5 rounded-[2rem] border border-dashed border-sky-400/20">
                  <Sparkles className="w-12 h-12 text-sky-500/20 mb-4" />
                  <p className="text-[10px] font-mono text-sky-100/40 uppercase tracking-widest leading-relaxed">
                    Feed Depleted Sir. Preference Matrix Updated. Syncing new articles...
                  </p>
                  <button 
                    onClick={refreshFeed}
                    className="mt-6 px-6 py-2 bg-sky-500/10 border border-sky-500/40 rounded-xl text-[10px] font-bold text-sky-400 hover:bg-sky-500/20 transition-all uppercase tracking-widest"
                  >
                    Recalibrate Buffer
                  </button>
                </div>
              )}
            </div>

            {/* Preference HUD */}
            <div className="mt-6 pt-4 border-t border-sky-400/10">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-3 bg-sky-500 rounded-full" />
                  <span className="text-[8px] font-bold text-sky-100/40 uppercase tracking-widest">Active_Interest_Profile</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {preferences.topics.slice(-3).map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 rounded-md text-[8px] text-sky-400 font-mono">
                      #{topic.toUpperCase()}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
