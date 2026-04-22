import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Cpu, LayoutGrid, FileText, Globe, Volume2, Shield, Languages, Search, Code } from 'lucide-react';
import { SidePanel } from './components/SidePanel';
import { VisionModule } from './components/VisionModule';
import { JarvisOrb } from './components/JarvisOrb';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { SecurityVault } from './components/SecurityVault';
import { TranslationPanel } from './components/TranslationPanel';
import { ScriptingModule } from './components/ScriptingModule';
import { BrowserControlModule, WebTask } from './components/BrowserControlModule';
import { SystemDashboard } from './components/SystemDashboard';
import { VoiceVisualization } from './components/VoiceVisualization';
import { Particles } from './components/Particles';
import { StartupSequenceOnboarding } from './components/StartupSequence';
import { NewsModule } from './components/NewsModule';
import { ExtensionBridgeModule } from './components/ExtensionBridgeModule';
import { SettingsPanel } from './components/SettingsPanel';
import { LockOverlay } from './components/LockOverlay';
import { jarvisChat } from './services/geminiService';
import { Message, SmartDevice, SystemState, NewsPreference, Personality } from './types';
import { JARVIS_SYSTEM_PROMPT, INITIAL_SMART_HOME } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Cognitive systems online. Standing by for your instructions, Sir.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_SMART_HOME);
  const [logs, setLogs] = useState<string[]>(['CORE_INIT_COMPLETE', 'SUBSYSTEMS_NOMINAL']);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [isScriptingOpen, setIsScriptingOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isExtensionBridgeOpen, setIsExtensionBridgeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVisionHUDOpen, setIsVisionHUDOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [webTasks, setWebTasks] = useState<WebTask[]>([]);
  const [scriptingInitialState, setScriptingInitialState] = useState<{ code?: string, filename?: string }>({});
  const [isOwnerVerified, setIsOwnerVerified] = useState(false);
  const [ownerDescription, setOwnerDescription] = useState<string | null>(null);
  const [personality, setPersonality] = useState<Personality>({
    name: 'J.A.R.V.I.S.',
    voice: '', // Default to standard
    pitch: 1.0,
    speed: 1.05,
    humor: 40,
    formality: 90
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [newsPreferences, setNewsPreferences] = useState<NewsPreference>({
    topics: ['technology', 'science', 'space'],
    sources: [],
    dislikedTopics: [],
    feedbackHistory: []
  });
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [location, setLocation] = useState<{ lat: number; long: number; timezone: string; weather?: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Neural Bridge Feedback Listener
  useEffect(() => {
    const handleBridgeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "JARVIS_BRIDGE_FEEDBACK") {
        const { status, message } = event.data;
        addLog(`BRIDGE_FEEDBACK_${status}: ${message.toUpperCase()}`);
        
        // JARVIS verbally acknowledges bridge success
        if (status === "SUCCESS") {
          const feedbackMsg: Message = { 
            role: 'model', 
            text: `Sir, the neural bridge confirms: ${message}.`, 
            timestamp: Date.now() 
          };
          setMessages(prev => [...prev, feedbackMsg]);
        }
      }
    };

    window.addEventListener("message", handleBridgeMessage);
    return () => window.removeEventListener("message", handleBridgeMessage);
  }, []);

  // Fetch Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          weather: Math.random() > 0.3 ? "Clear Skies" : "Slight Precipitation"
        });
        addLog("GEOLOCATION_ACQUIRED");
      }, (error) => {
        console.error("Location error:", error);
        addLog("GEOLOCATION_FAULT: PERMISSION_DENIED");
      });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Persistent Synthesis Loop for Voice Assistant experience
  useEffect(() => {
    if (isVoiceMode && !isProcessing && !isVaultOpen && !isAnalyticsOpen && !isTranslationOpen && !isScriptingOpen) {
      const timer = setTimeout(() => {
        if (!isListening && !window.speechSynthesis.speaking) {
          startVoiceCapture();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVoiceMode, isProcessing, isListening, isVaultOpen, isAnalyticsOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg].slice(-20));
  };

  const onLog = (msg: string) => {
    addLog(msg);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Attempt to pick a default British voice if not set
      if (voices.length > 0 && !personality.voice) {
        const jarvisVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('Daniel') || v.name.includes('Google UK English Male'));
        if (jarvisVoice) {
          setPersonality(prev => ({ ...prev, voice: jarvisVoice.name }));
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input;
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    addLog(`VOICE_IN: "${text.toUpperCase().substring(0, 30)}..."`);

    // Enhanced Command Logic
    if (text.toLowerCase().includes('summarize') || text.toLowerCase().includes('analyze')) {
      setIsAnalyticsOpen(true);
      addLog("INITIATING_ANALYTICS_PROTOCOL");
    }

    if (text.toLowerCase().includes('vault') || text.toLowerCase().includes('secure') || text.toLowerCase().includes('cloud')) {
      setIsVaultOpen(true);
      addLog("INITIATING_VAULT_CLEARANCE");
    }

    if (text.toLowerCase().includes('translate') || text.toLowerCase().includes('language')) {
      setIsTranslationOpen(true);
      addLog("INITIATING_LINGUISTIC_MATRIX");
    }

    if (text.toLowerCase().includes('play') || text.toLowerCase().includes('music') || text.toLowerCase().includes('song')) {
      addLog("MUSIC_QUERY_SEQUENCE_INITIATED");
    }

    if (text.toLowerCase().includes('browser') || text.toLowerCase().includes('website') || text.toLowerCase().includes('google') || text.toLowerCase().includes('open')) {
      addLog("WEB_UPLINK_PROTOCOL_QUEUED");
    }

    if (text.toLowerCase().includes('code') || text.toLowerCase().includes('program') || text.toLowerCase().includes('script') || text.toLowerCase().includes('debug')) {
      setIsScriptingOpen(true);
      addLog("INITIATING_SCRIPT_PROTOCOL");
    }

    if (text.toLowerCase().includes('settings') || text.toLowerCase().includes('voice') || text.toLowerCase().includes('pitch') || text.toLowerCase().includes('accent')) {
      setIsSettingsOpen(true);
      addLog("INITIATING_VOCAL_CALIBRATION_PROTOCOL");
    }

    if (text.toLowerCase().includes('lock') || text.toLowerCase().includes('secure the system')) {
      setIsLocked(true);
      addLog("CORE_LOCKDOWN_PROTOCOL_INITIATED");
    }

    if (text.toLowerCase().includes('camera') || text.toLowerCase().includes('vision') || text.toLowerCase().includes('mirror') || text.toLowerCase().includes('reflection')) {
      setIsVisionHUDOpen(true);
      addLog("INITIATING_OPTICAL_INTERFACE_MATRIX");
    }

    // Augmented System Instruction with Geolocation and Time context
    const currentTime = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let envCtx = `\n[ENVIRONMENT_STAMP]\nSystem Time: ${currentTime}\nTimezone: ${timezone}\n`;
    
    if (location) {
      envCtx += `Position: ${location.lat}, ${location.long}\n`;
      envCtx += `Local Context: ${new Date().toLocaleString('en-US', { timeZone: location.timezone })}\n`;
      envCtx += `Meteorological Data: ${location.weather}\n`;
    } else {
      envCtx += `Position: Unknown (Sir, permission to verify your exact coordinates was denied. DO NOT assume you are in Malibu. Rely ONLY on the Provided System Time for chronological accuracy.)\n`;
    }
    
    const augmentedInstruction = JARVIS_SYSTEM_PROMPT + envCtx;

    const responseText = await jarvisChat([...messages, userMessage], augmentedInstruction);
    
    // Parse for Autonomous Module Activation
    let cleanedResponse = responseText;
    let detectedLang = 'en-GB';

    // Handle LANG tag
    const langMatch = responseText.match(/\[LANG:\s*([a-z]{2}(?:-[A-Z]{2})?)\]/i);
    if (langMatch && langMatch[1]) {
      detectedLang = langMatch[1];
      cleanedResponse = responseText.replace(/\[LANG:\s*[a-z]{2}(?:-[A-Z]{2})?\]/gi, '').trim();
      addLog(`LINGUISTIC_SYNC_ACTIVE: ${detectedLang.toUpperCase()}`);
    }

    // Handle WEB_CMD tag
    const webCmdMatch = responseText.match(/\[WEB_CMD:\s*({[^\]]+})\]/i);
    if (webCmdMatch && webCmdMatch[1]) {
      try {
        const cmd = JSON.parse(webCmdMatch[1]);
        const newTask: WebTask = {
          id: Math.random().toString(36).substr(2, 9),
          url: cmd.url || 'https://google.com',
          action: cmd.action || 'open',
          status: 'pending',
          description: cmd.desc || 'System-Initiated Web Task',
          payload: cmd.data || null,
        };
        setWebTasks(prev => [...prev, newTask]);
        addLog(`WEB_COMMAND_INTERCEPTED: ${newTask.action.toUpperCase()}`);
        cleanedResponse = cleanedResponse.replace(/\[WEB_CMD:\s*{[^\]]+}\]/gi, '').trim();
      } catch (e) {
        console.error("Web CMD parse error:", e);
      }
    }
    
    // Handle OPEN_URL tag
    const urlMatch = responseText.match(/\[OPEN_URL:\s*(https?:\/\/[^\s\]]+)\]/i);
    if (urlMatch && urlMatch[1]) {
      const url = urlMatch[1];
      const newTask: WebTask = {
        id: Math.random().toString(36).substr(2, 9),
        url: url,
        action: 'open',
        status: 'pending',
        description: `Open Remote Site: ${url.replace(/^https?:\/\//, '').split('/')[0]}`,
      };
      setWebTasks(prev => [...prev, newTask]);
      addLog(`EXTERNAL_UPLINK_SEQUENCED: ${url}`);
      cleanedResponse = cleanedResponse.replace(/\[OPEN_URL:\s*https?:\/\/[^\s\]]+\]/gi, '').trim();
    }

    if (responseText.includes('[ACTIVATE_MODULE:')) {
      if (responseText.includes('ANALYTICS')) setIsAnalyticsOpen(true);
      if (responseText.includes('VAULT')) setIsVaultOpen(true);
      if (responseText.includes('TRANSLATION')) setIsTranslationOpen(true);
      if (responseText.includes('SCRIPTING')) setIsScriptingOpen(true);
      if (responseText.includes('NEWS')) setIsNewsOpen(true);
      if (responseText.includes('EXTENSIONS')) setIsExtensionBridgeOpen(true);
      if (responseText.includes('SETTINGS')) setIsSettingsOpen(true);
      
      // Clean tags from speech
      cleanedResponse = responseText.replace(/\[ACTIVATE_MODULE: [A-Z]+\]/g, '').trim();
    }

    // Handle DEPLOY_SCRIPT tag
    const scriptMatch = responseText.match(/\[DEPLOY_SCRIPT:\s*({[^\]]+})\]/i);
    if (scriptMatch && scriptMatch[1]) {
      try {
        const cmd = JSON.parse(scriptMatch[1]);
        setScriptingInitialState({
          code: cmd.code,
          filename: cmd.filename
        });
        setIsScriptingOpen(true);
        addLog(`SCRIPT_DEPLOYMENT_SEQUENCED: ${cmd.filename || 'UNDEFINED'}`);
        cleanedResponse = cleanedResponse.replace(/\[DEPLOY_SCRIPT:\s*{[^\]]+}\]/gi, '').trim();
      } catch (e) {
        console.error("Script CMD parse error:", e);
      }
    }

    // Simulate real-time interaction
    const botMessage: Message = { role: 'model', text: cleanedResponse, timestamp: Date.now() };
    setMessages(prev => [...prev, botMessage]);
    setIsProcessing(false);
    addLog("OS_RESPONSE_READY");

    // "Speak" the response
    const utterance = new SpeechSynthesisUtterance(cleanedResponse);
    utterance.lang = detectedLang;
    utterance.rate = personality.speed;
    utterance.pitch = personality.pitch;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isVoiceMode) {
        setTimeout(startVoiceCapture, 500);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);
    
    if (detectedLang.startsWith('en')) {
      if (personality.voice) {
        const selectedVoice = availableVoices.find(v => v.name === personality.voice);
        if (selectedVoice) utterance.voice = selectedVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const jarvisVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('Daniel') || v.name.includes('Google UK English Male'));
        if (jarvisVoice) utterance.voice = jarvisVoice;
      }
    } else {
      // Try to find a voice matching the detected language
      const langVoice = availableVoices.find(v => v.lang.startsWith(detectedLang));
      if (langVoice) utterance.voice = langVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleSecurityAction = (action: 'lock' | 'unlock' | 'enroll', data?: any) => {
    if (action === 'lock') {
      setIsLocked(true);
      addLog("UNAUTHORIZED_ACCESS_DETECTED: LOCKDOWN_ENGAGED");
    } else if (action === 'unlock') {
      setIsLocked(false);
      setIsOwnerVerified(true);
      addLog("IDENTITY_VERIFIED: SYSTEM_RESTORED");
    } else if (action === 'enroll') {
      setIsOwnerVerified(true);
      setOwnerDescription(data?.description || "Tony Stark");
      addLog("BIOMETRIC_ENROLLMENT_SUCCESSFUL: OWNER_SYNCED");
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'on' ? 'off' : 'on' } : d
    ));
    const device = devices.find(d => d.id === id);
    addLog(`TOGGLE_STATE: ${device?.name.toUpperCase()} => ${device?.status === 'on' ? 'OFF' : 'ON'}`);
  };

  const startVoiceCapture = () => {
    if (isProcessing || window.speechSynthesis.speaking) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addLog("SENSORS_LISTENING...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        recognitionRef.current = null;
        if (event.error !== 'no-speech') {
          addLog(`SENSOR_FAULT: ${event.error.toUpperCase()}`);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.error("Recognition start failed:", e);
      }
    } else {
      addLog("SPEECH_HARDWARE_NOT_FOUND");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden mesh-bg font-sans text-sky-50">
      <AnimatePresence>
        {isInitializing && <StartupSequenceOnboarding onComplete={() => setIsInitializing(false)} />}
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <div className="scanline" />
      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none z-[100] hologram-flicker" />

      {/* Background HUD Layer */}
      <Particles />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <SidePanel 
        devices={devices} 
        onToggleDevice={toggleDevice} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        logs={logs} 
      />

      <VisionModule 
        onLog={onLog} 
        onSecurityAction={handleSecurityAction}
        isOwnerVerified={isOwnerVerified}
        isExpandedOverride={isVisionHUDOpen}
      />
      
      <SystemDashboard />

      <AnalyticsPanel 
        isOpen={isAnalyticsOpen} 
        onClose={() => setIsAnalyticsOpen(false)} 
        onLog={onLog} 
      />

      <SecurityVault 
        isOpen={isVaultOpen} 
        onClose={() => setIsVaultOpen(false)} 
        onLog={onLog} 
      />

      <TranslationPanel 
        isOpen={isTranslationOpen} 
        onClose={() => setIsTranslationOpen(false)} 
        onLog={onLog} 
      />

      <ScriptingModule 
        isOpen={isScriptingOpen} 
        onClose={() => setIsScriptingOpen(false)} 
        onLog={onLog} 
        initialCode={scriptingInitialState.code}
        initialFilename={scriptingInitialState.filename}
      />

      <NewsModule 
        isOpen={isNewsOpen}
        onClose={() => setIsNewsOpen(false)}
        onLog={onLog}
        preferences={newsPreferences}
        onUpdatePreferences={setNewsPreferences}
      />

      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        personality={personality}
        onUpdatePersonality={setPersonality}
        availableVoices={availableVoices}
      />

      <LockOverlay 
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        onLog={onLog}
      />

      {/* Static HUD Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-sky-500/20 m-4 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-sky-500/20 m-4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-sky-500/20 m-4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-sky-500/20 m-4 pointer-events-none" />

      {/* Main Interface */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-between p-8 pl-80">
        {/* Top Indicators */}
        <header className="w-full flex justify-between items-center mb-6 h-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-full border-2 border-sky-400/50 flex items-center justify-center relative group">
              <div className="w-4 h-4 bg-sky-400 rounded-full animate-ping absolute opacity-20"></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-[0_0_12px_#38bdf8]"></div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-sky-400 rounded-full opacity-40"
              />
            </div>
            <div>
              <h1 className="text-[10px] font-mono uppercase tracking-[0.4em] text-sky-400/60">Core_Identity_Protocol</h1>
              <p className="text-2xl font-bold tracking-tighter glow-text text-sky-100 uppercase italic">J.A.R.V.I.S. OS_v4.0</p>
            </div>
          </motion.div>

          <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-sky-100/40">Active_Tactical_Grid</p>
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-1.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400 text-[11px] uppercase font-black tracking-widest shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]"
            >
              House Party Protocol 
            </motion.div>
            <div className="flex gap-1">
               {[...Array(5)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ backgroundColor: ["#38bdf8", "#0ea5e9", "#1e1b4b"] }}
                   transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                   className="w-4 h-0.5" 
                 />
               ))}
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-60">User Authenticated</p>
            <p className="text-lg font-semibold text-sky-100 tracking-tight">Tony Stark</p>
            {location && (
              <div className="mt-1 flex items-center justify-end gap-2 text-[8px] font-mono text-sky-400 opacity-60">
                <Globe className="w-2.5 h-2.5" />
                <span>{location.lat.toFixed(4)}, {location.long.toFixed(4)} | {location.timezone}</span>
              </div>
            )}
          </div>
        </header>

        {/* Central Orb & Interaction */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-12">
          <JarvisOrb 
            isListening={isListening} 
            isActive={isVoiceMode} 
            isProcessing={isProcessing}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-24">
            <VoiceVisualization isSpeaking={isSpeaking} />
          </div>
          
          <div className="max-w-2xl w-full flex flex-col items-center gap-6 mt-16">
            <AnimatePresence mode="wait">
              {isVoiceMode ? (
                <motion.div 
                  key="voice-status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setIsVoiceMode(false)}
                        className="px-4 py-2 glass text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest"
                     >
                        Disable Voice Mode
                     </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isListening ? "bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" : "bg-slate-700"
                    )} />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-100/60">
                      {isListening ? "Sensors_Active: Listening_Sir" : "Sensors_Idle: Standby"}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="chat-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative glass p-2 flex gap-2 rounded-2xl w-full"
                >
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="AWAITING_INPUT_SIR..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm placeholder:text-sky-400/30 text-sky-100 font-mono"
                  />
                  <button 
                    onClick={() => setIsVoiceMode(true)}
                    className="p-3 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-xl transition-all"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={isProcessing}
                    className="bg-sky-500 text-slate-950 p-3 rounded-xl hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(56,189,248,0.5)] active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* HUD Elements */}
        {!isLocked && <BrowserControlModule 
          tasks={webTasks} 
          onComplete={(id) => setWebTasks(prev => prev.filter(t => t.id !== id))}
          onCancel={(id) => setWebTasks(prev => prev.filter(t => t.id !== id))}
        />}
        
        <ExtensionBridgeModule 
          isOpen={isExtensionBridgeOpen}
          onClose={() => setIsExtensionBridgeOpen(false)}
        />
        
        {/* Dialogue Viewport */}
        <div className="w-full max-w-2xl glass h-64 p-6 border-b-0 rounded-t-[2.5rem] flex flex-col translate-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-sky-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4 border-b border-sky-400/10 pb-2 relative z-10">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.3em]">Holographic_Comm_Link</span>
             </div>
             <Volume2 className="w-3.5 h-3.5 text-sky-400/40" />
          </div>
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar relative z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%)]"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.timestamp + i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "relative p-4 rounded-2xl text-[11px] leading-relaxed group transition-all h-fit",
                    msg.role === 'user' 
                      ? "ml-16 bg-sky-500/5 border border-sky-500/20 text-sky-100/90 italic hologram-flicker" 
                      : "mr-16 bg-slate-900/60 border border-sky-400/10 text-sky-50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  )}
                >
                   <div className={cn(
                     "absolute -top-5 text-[8px] font-black uppercase tracking-widest",
                     msg.role === 'user' ? "right-0 text-sky-400/40" : "left-0 text-sky-500"
                   )}>
                     {msg.role === 'user' ? 'USER_AUTH_SESSION_482' : 'JARVIS_COGNITIVE_CORE'}
                   </div>
                   {msg.text}
                   <div className="absolute -bottom-4 right-0 text-[7px] font-mono opacity-20 uppercase">
                     {new Date(msg.timestamp).toLocaleTimeString()}
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isProcessing && (
              <div className="flex gap-1 p-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-sky-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute right-8 bottom-8 flex flex-col gap-4">
          {[
            { icon: <LayoutGrid className="w-5 h-5" />, label: 'Apps', onClick: () => {} },
            { icon: <FileText className="w-5 h-5" />, label: 'Analyze', onClick: () => setIsAnalyticsOpen(true) },
            { icon: <Languages className="w-5 h-5" />, label: 'Translate', onClick: () => setIsTranslationOpen(true) },
            { icon: <Code className="w-5 h-5" />, label: 'Script', onClick: () => setIsScriptingOpen(true) },
            { icon: <Shield className="w-5 h-5" />, label: 'Vault', onClick: () => setIsVaultOpen(true) },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              onClick={item.onClick}
              whileHover={{ scale: 1.1, x: -5 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <span className="text-[10px] uppercase font-bold text-sky-500/0 group-hover:text-sky-500 transition-all tracking-widest">
                {item.label}
              </span>
              <div className="p-3 glass border-sky-400/20 text-sky-400 rounded-xl hover:border-sky-400/40 transition-colors">
                {item.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Decorative corners */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-sky-500/10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-sky-500/10 pointer-events-none" />
    </div>
  );
}
