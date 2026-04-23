import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Cpu, LayoutGrid, FileText, Globe, Volume2, Shield, Languages, Search, Code, Layout, MapPin, Cloud } from 'lucide-react';
import { VisionModule } from './components/VisionModule';
import { JarvisOrb } from './components/JarvisOrb';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { SecurityVault } from './components/SecurityVault';
import { TranslationPanel } from './components/TranslationPanel';
import { ScriptingModule } from './components/ScriptingModule';
import { BrowserControlModule, WebTask } from './components/BrowserControlModule';
import { VoiceVisualization } from './components/VoiceVisualization';
import { Particles } from './components/Particles';
import { StartupSequenceOnboarding } from './components/StartupSequence';
import { NewsModule } from './components/NewsModule';
import { ExtensionBridgeModule } from './components/ExtensionBridgeModule';
import { SettingsPanel } from './components/SettingsPanel';
import { LockOverlay } from './components/LockOverlay';
import { UISelector } from './components/UISelector';
import { AppLattice } from './components/AppLattice';
import { EdexKeyboard, EdexFileTree, EdexSystemMonitor } from './components/EdexComponents';
import { HolographicDesignModule, SceneElement } from './components/HolographicDesignModule';
import { jarvisChat, fetchRealTimeWeather } from './services/geminiService';
import { desktopBridge } from './services/desktopBridge';
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
  const [localApps, setLocalApps] = useState<{name: string, path: string}[]>([]);
  const [isUISelectorOpen, setIsUISelectorOpen] = useState(false);
  const [isAppLatticeOpen, setIsAppLatticeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'vanguard' | 'zenith' | 'edex'>('vanguard');

  // Sync "Devices" with real browser capabilities
  useEffect(() => {
    const syncHardware = async () => {
      const newDevices = [...INITIAL_SMART_HOME];
      
      // Sync Primary Display
      const displayIdx = newDevices.findIndex(d => d.id === 'l1');
      if (displayIdx > -1) {
        newDevices[displayIdx].name = `UHD Display (${window.screen.width}x${window.screen.height})`;
        newDevices[displayIdx].value = `${window.devicePixelRatio}x Scaling`;
      }

      // Sync Audio
      const audioIdx = newDevices.findIndex(d => d.id === 'a1');
      if (audioIdx > -1) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasAudio = devices.some(d => d.kind === 'audiooutput');
          newDevices[audioIdx].status = hasAudio ? 'on' : 'off';
          newDevices[audioIdx].name = 'Master Audio Array';
        } catch (e) {
          console.warn("Audio enumeration blocked.");
        }
      }

      // Sync Biometrics (Camera)
      const camIdx = newDevices.findIndex(d => d.id === 'c1');
      if (camIdx > -1) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCam = devices.some(d => d.kind === 'videoinput');
          newDevices[camIdx].status = hasCam ? 'on' : 'off';
          newDevices[camIdx].name = 'Retina Scanner (Webcam)';
        } catch (e) {
          console.warn("Camera enumeration blocked.");
        }
      }

      setDevices(newDevices);
    };

    syncHardware();

    // Initial App Sync for Desktop Mode
    if (desktopBridge.isSupported) {
      desktopBridge.syncApps().then(apps => {
        setLocalApps(apps);
        onLog(`INITIAL_SOFTWARE_SYNC: ${apps.length} NODES_IDENTIFIED`);
      });
    }
  }, []);

  const [logs, setLogs] = useState<string[]>(['CORE_INIT_COMPLETE', 'SUBSYSTEMS_NOMINAL']);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [isScriptingOpen, setIsScriptingOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isExtensionBridgeOpen, setIsExtensionBridgeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSentinelActive, setIsSentinelActive] = useState(false);
  const [isVisionHUDOpen, setIsVisionHUDOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isHologramOpen, setIsHologramOpen] = useState(false);
  const [hologramElements, setHologramElements] = useState<SceneElement[]>([]);
  const [hologramTitle, setHologramTitle] = useState("MARK_85_SCHEMATIC");
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
  
  // Tactical States
  const [telemetryLevel, setTelemetryLevel] = useState(98.45);
  const [satelliteStatus, setSatelliteStatus] = useState<'online' | 'limited' | 'offline'>('online');
  const [powerEfficiency, setPowerEfficiency] = useState(85.22);
  const [activeArmor, setActiveArmor] = useState('MARK_85');
  
  // Real-time Telemetry Stimulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryLevel(prev => {
        const jitter = (Math.random() - 0.5) * 0.1;
        return Math.max(90, Math.min(100, prev + jitter));
      });
      setPowerEfficiency(prev => {
        const jitter = (Math.random() - 0.5) * 0.2;
        return Math.max(80, Math.min(99, prev + jitter));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryLevel(prev => Math.min(100, Math.max(90, prev + (Math.random() - 0.5))));
      setPowerEfficiency(prev => Math.min(100, Math.max(70, prev + (Math.random() - 0.5))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    if (!isInitializing && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        setLocation(coords);
        addLog("GEOLOCATION_ACQUIRED");
        
        // Fetch real-time weather
        onLog("FETCHING_ATMOSPHERIC_DATA: SYNCHRONIZING_METEOROLOGY");
        fetchRealTimeWeather(coords.lat, coords.long).then(weather => {
          setLocation(prev => prev ? { ...prev, weather } : null);
          onLog(`METEOROLOGY_SYNCED: ${weather.toUpperCase()}`);
        });
      }, (error) => {
        console.error("Location error:", error);
        addLog("GEOLOCATION_FAULT: PERMISSION_DENIED");
      });
    }
  }, [isInitializing]);

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

  const addWebTask = (task: Omit<WebTask, 'id' | 'status'>) => {
    const newTask: WebTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
    };
    setWebTasks(prev => [...prev, newTask]);
    addLog(`WEB_TASK_QUEUED: ${task.url}`);
  };

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

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

    if (text.toLowerCase().includes('design') || text.toLowerCase().includes('3d') || text.toLowerCase().includes('model') || text.toLowerCase().includes('schematic')) {
      addLog("INITIATING_SPATIAL_DESIGN_PROTOCOL");
    }

    // Augmented System Instruction with Geolocation and Time context
    const currentTime = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let envCtx = `\n[ENVIRONMENT_STAMP]\nSystem Time: ${currentTime}\nTimezone: ${timezone}\n`;
    
    // Tactical Context
    envCtx += `\n[TACTICAL_TELEMETRY]\nActive Armor: ${activeArmor}\nTelemetry Integrity: ${telemetryLevel}%\nSatellite Network: ${satelliteStatus}\nPower Management Efficiency: ${powerEfficiency}%\nSentinel Guard: ${isSentinelActive ? 'ACTIVE' : 'DISENGAGED'}\n`;
    
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
        const url = cmd.url || 'https://google.com';
        
        if (isValidUrl(url)) {
          addWebTask({
            url: url,
            action: cmd.action || 'open',
            description: cmd.desc || 'System-Initiated Web Task',
            payload: cmd.data || null,
          });
          addLog(`WEB_COMMAND_INTERCEPTED: ${cmd.action?.toUpperCase() || 'OPEN'}`);
        } else {
          addLog("WEB_COMMAND_REJECTED: INVALID_URL_PROTOCOL");
        }
        cleanedResponse = cleanedResponse.replace(/\[WEB_CMD:\s*{[^\]]+}\]/gi, '').trim();
      } catch (e) {
        console.error("Web CMD parse error:", e);
      }
    }
    
    // Handle OPEN_URL tag
    const urlMatch = responseText.match(/\[OPEN_URL:\s*(https?:\/\/[^\s\]]+)\]/i);
    if (urlMatch && urlMatch[1]) {
      const url = urlMatch[1];
      if (isValidUrl(url)) {
        addWebTask({
          url: url,
          action: 'open',
          description: `Open Remote Site: ${url.replace(/^https?:\/\//, '').split('/')[0]}`,
        });
        addLog(`EXTERNAL_UPLINK_SEQUENCED: ${url}`);
      } else {
        addLog("EXTERNAL_UPLINK_ABORTED: MALFORMED_COORDINATES");
      }
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

    // Handle 3D_DESIGN tag
    const designMatch = responseText.match(/\[3D_DESIGN:\s*({[^\]]+})\]/i);
    if (designMatch && designMatch[1]) {
      try {
        const cmd = JSON.parse(designMatch[1]);
        setHologramElements(cmd.elements || []);
        setHologramTitle(cmd.title || "NEURAL_FABRICATION_SCHEMATIC");
        setIsHologramOpen(true);
        addLog(`HOLOGRAPHIC_PROJECTION_ENGAGED: ${cmd.title || 'UNKNOWN_DESIGN'}`);
        cleanedResponse = cleanedResponse.replace(/\[3D_DESIGN:\s*{[^\]]+}\]/gi, '').trim();
      } catch (e) {
        console.error("3D Design parse error:", e);
      }
    }

    // Handle SYNC_APPS tag
    if (responseText.includes('[SYNC_APPS]')) {
      addLog("INITIATING_SOFTWARE_SYNC_PROTOCOL");
      desktopBridge.syncApps().then(apps => {
        setLocalApps(apps);
        onLog(`SOFTWARE_LATTICE_SYNCED: ${apps.length} NODES_IDENTIFIED`);
      });
      cleanedResponse = cleanedResponse.replace(/\[SYNC_APPS\]/gi, '').trim();
    }

    // Handle OPEN_APP tag
    const openAppMatch = responseText.match(/\[OPEN_APP:\s*([^\]]+)\]/i);
    if (openAppMatch && openAppMatch[1]) {
      const targetApp = openAppMatch[1].trim();
      
      // Attempt to find app by name in localApps if not a direct path
      const appRef = localApps.find(a => a.name.toLowerCase().includes(targetApp.toLowerCase()));
      const appPath = appRef ? appRef.path : targetApp;
      
      desktopBridge.openApp(appPath).then(res => {
        if (res.status === 'success') {
          onLog(`SOFTWARE_EXECUTED: ${targetApp.toUpperCase()}`);
        } else {
          onLog(`EXECUTION_FAULT: UNABLE_TO_LOCATE_${targetApp.toUpperCase()}`);
        }
      });
      cleanedResponse = cleanedResponse.replace(/\[OPEN_APP:\s*[^\]]+\]/gi, '').trim();
    }

    // Handle LOCK_SYSTEM tag
    if (responseText.includes('[LOCK_SYSTEM]')) {
      addLog("ENGAGING_SYSTEM_WIDE_SECURITY_LOCKDOWN");
      desktopBridge.lockSystem();
      setIsLocked(true);
      cleanedResponse = cleanedResponse.replace(/\[LOCK_SYSTEM\]/gi, '').trim();
    }

    // Simulate real-time interaction
    const botMessage: Message = { role: 'model', text: cleanedResponse, timestamp: Date.now(), lang: detectedLang };
    setMessages(prev => [...prev, botMessage]);
    setIsProcessing(false);
    addLog("OS_RESPONSE_READY");

    // Autonomic vocalization is now handled by useEffect monitoring the messages array
  };

  const handleSecurityAction = (action: 'lock' | 'unlock' | 'enroll', data?: any) => {
    if (action === 'lock') {
      setIsLocked(true);
      desktopBridge.lockSystem(); // Lock the actual desktop
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

  const handleThemeChange = (theme: 'vanguard' | 'zenith' | 'edex') => {
    setCurrentTheme(theme);
    setIsUISelectorOpen(false);
    addLog(`NEURAL_SKIN_INITIALIZED: ${theme.toUpperCase()}`);
    
    // JARVIS verbally acknowledges the new skin
    let themeDescription = '';
    if (theme === 'vanguard') themeDescription = 'Vanguard Tactical HUD';
    else if (theme === 'edex') themeDescription = 'eDEX Cinematic Terminal';
    else themeDescription = 'Zenith Executive Glass';

    const ack: Message = {
      role: 'model',
      text: `Sir, I have initialized the ${themeDescription} interface. Recalibrating sensory arrays for optimal performance.`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, ack]);
  };

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'on' ? 'off' : 'on' } : d
    ));
    const device = devices.find(d => d.id === id);
    addLog(`TOGGLE_STATE: ${device?.name.toUpperCase()} => ${device?.status === 'on' ? 'OFF' : 'ON'}`);
  };

  const speak = (text: string, lang: string = 'en-GB') => {
    if (!text) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = personality.speed;
    utterance.pitch = personality.pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isVoiceMode) {
        setTimeout(startVoiceCapture, 400);
      }
    };
    utterance.onerror = (e) => {
      console.error("Speech error", e);
      setIsSpeaking(false);
    };

    // Voice Selection Logic
    if (lang.startsWith('en')) {
      const preferred = personality.voice;
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = preferred 
        ? voices.find(v => v.name === preferred)
        : voices.find(v => v.lang.includes('en-GB') || v.name.includes('Daniel') || v.name.includes('Google UK English Male'));
      
      if (selectedVoice) utterance.voice = selectedVoice;
    } else {
      const langVoice = availableVoices.find(v => v.lang.startsWith(lang));
      if (langVoice) utterance.voice = langVoice;
    }

    addLog(`VOCALIZING: "${text.substring(0, 20)}..."`);
    window.speechSynthesis.speak(utterance);
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

  // Autonomic Vocalization Trigger
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'model') {
      speak(lastMessage.text, lastMessage.lang || 'en-GB');
    }
  }, [messages.length]);

  const toggleVoiceMode = () => {
    // Interrupt if speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      addLog("VOCAL_INTERRUPT_TRIGGERED: RE-ENGAGING_INPUT_LATTICE");
      if (isVoiceMode) {
        setTimeout(startVoiceCapture, 300);
      }
      return;
    }

    if (!isVoiceMode) {
      setIsVoiceMode(true);
      // Brief delay to ensure state update before sensor activation
      setTimeout(startVoiceCapture, 300);
    } else {
      setIsVoiceMode(false);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  return (
    <div className="hud-container scanline-overlay bg-[#020406]">
      <AnimatePresence>
        {isInitializing && <StartupSequenceOnboarding onComplete={() => setIsInitializing(false)} />}
      </AnimatePresence>

      <Particles />

      {/* COLUMN 1: SYSTEM DIAGNOSTICS & LOGS */}
      <aside className="hud-panel border-l-0 flex flex-col">
        <div className="hud-header-label">
          <span>SYSTEM_LOG_ARRAY</span>
          <Cpu className="w-3 h-3 opacity-50" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar font-mono text-[9px] text-sky-400/60 uppercase">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="hud-header-label border-t">
          <span>SOFTWARE_LATTICE</span>
          <LayoutGrid className="w-3 h-3 opacity-50" />
        </div>
        <div className="h-64 p-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <Layout className="w-4 h-4" />, label: 'UI', onClick: () => setIsUISelectorOpen(true) },
              { icon: <LayoutGrid className="w-4 h-4" />, label: 'APPS', onClick: () => setIsAppLatticeOpen(true) },
              { icon: <FileText className="w-4 h-4" />, label: 'ANLZ', onClick: () => setIsAnalyticsOpen(true) },
              { icon: <Languages className="w-4 h-4" />, label: 'TRNS', onClick: () => setIsTranslationOpen(true) },
              { icon: <Code className="w-4 h-4" />, label: 'SCRP', onClick: () => setIsScriptingOpen(true) },
              { icon: <Shield className="w-4 h-4" />, label: 'VLT', onClick: () => setIsVaultOpen(true) },
              { icon: <Globe className="w-4 h-4" />, label: 'News', onClick: () => setIsNewsOpen(true) },
              { icon: <Search className="w-4 h-4" />, label: 'Ext', onClick: () => setIsExtensionBridgeOpen(true) },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="aspect-square flex flex-col items-center justify-center border border-sky-500/10 hover:border-sky-500/40 hover:bg-sky-500/5 transition-all text-sky-400 group"
              >
                {item.icon}
                <span className="text-[7px] font-bold mt-1 opacity-40 group-hover:opacity-100">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* COLUMN 2: NEURAL COMMUNICATIONS & CORE */}
      <main className="flex flex-col relative">
        <header className="h-16 px-8 flex items-center justify-between border-b border-[var(--panel-border)] bg-sky-500/5">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_#38bdf8]" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono tracking-widest text-sky-400/40 uppercase">System_Status: Nominal</span>
              <span className="text-sm font-bold tracking-tighter text-white uppercase italic">J.A.R.V.I.S. Core_v4.2</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-[9px] text-sky-400/60 uppercase">
             <div className="flex flex-col items-end">
                <span>Telemetry</span>
                <span className="text-white font-bold">{telemetryLevel.toFixed(2)}%</span>
             </div>
             <div className="flex flex-col items-end">
                <span>Power</span>
                <span className="text-white font-bold">{powerEfficiency.toFixed(2)}%</span>
             </div>
             <div className="flex flex-col items-end">
                <span>Armor</span>
                <span className="text-white font-bold">{activeArmor}</span>
             </div>
          </div>
        </header>

        <section className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <JarvisOrb 
              isListening={isListening} 
              isActive={isVoiceMode} 
              isProcessing={isProcessing}
              onClick={toggleVoiceMode}
            />
            <div className="mt-8 flex flex-col items-center gap-4">
              <VoiceVisualization isSpeaking={isSpeaking} />
              <div className="flex gap-2 p-1 px-3 rounded-full bg-sky-500/5 border border-sky-500/10">
                 {[...Array(9)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ 
                       opacity: [0.1, 0.4, 0.1],
                       height: isSpeaking ? [4, 12, 4] : 4
                     }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                     className="w-0.5 h-4 bg-sky-400/40 rounded-full" 
                   />
                 ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-end z-20">
             {/* Interaction Area */}
             <div className="w-full max-w-xl group relative">
                <AnimatePresence mode="wait">
                  {isVoiceMode ? (
                    <motion.div 
                      key="voice"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl backdrop-blur-xl"
                    >
                       <span className="text-xs font-mono tracking-widest text-sky-400 animate-pulse">
                         {isListening ? "AWAITING_VOCAL_INPUT..." : "SYNAPTIC_ARRAY_READY"}
                       </span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 p-2 bg-slate-900/80 border border-sky-500/20 rounded-xl backdrop-blur-3xl w-full"
                    >
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="COMMAND_INPUT_SIR..."
                        className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-sky-100 font-mono placeholder:text-sky-400/20"
                      />
                      <button 
                        onClick={() => handleSend()}
                        className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 p-2 rounded-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </section>

        <section className="h-[200px] border-t border-[var(--panel-border)] bg-slate-900/40 p-6 overflow-hidden flex flex-col">
           <div className="flex items-center gap-2 mb-4 opacity-40">
              <Volume2 className="w-3 h-3 text-sky-400" />
              <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-sky-400">Communication_Lattice</span>
           </div>
           
           <div 
             ref={scrollRef}
             className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
           >
             <AnimatePresence>
               {messages.map((msg, i) => (
                 <motion.div
                   key={msg.timestamp + i}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={cn(
                     "flex flex-col gap-1",
                     msg.role === 'user' ? "items-end" : "items-start"
                   )}
                 >
                   <span className="text-[7px] font-black uppercase tracking-widest text-sky-500/40">
                     {msg.role === 'user' ? 'AUTH_USER' : 'COGNITIVE_OS'}
                   </span>
                   <div className={cn(
                     "max-w-[80%] p-3 rounded-lg text-xs leading-relaxed transition-all",
                     msg.role === 'user' 
                       ? "bg-sky-500/10 border border-sky-500/20 text-sky-100 italic" 
                       : "bg-slate-800/80 border border-sky-500/5 text-sky-50"
                   )}>
                     {msg.text}
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </section>
      </main>

      {/* COLUMN 3: ENVIRONMENTAL TELEMETRY & CONTROLS */}
      <aside className="hud-panel border-r-0 flex flex-col">
        <div className="hud-header-label">
          <span>OPTICAL_FEED_MATRIX</span>
          <Globe className="w-3 h-3 opacity-50" />
        </div>
        <div className="h-48 relative overflow-hidden bg-black/40 border-b border-sky-500/10 grayscale hover:grayscale-0 transition-all duration-700">
           <VisionModule 
             onLog={onLog} 
             onSecurityAction={handleSecurityAction} 
             isOwnerVerified={isOwnerVerified} 
           />
        </div>

        <div className="hud-header-label">
          <span>ENVIRONMENTAL_DOMINANCE</span>
          <Globe className="w-3 h-3 opacity-50" />
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
           <div className="tech-card space-y-3">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                 <div className="flex items-center gap-2 font-black italic"><MapPin className="w-3 h-3" /> Locus</div>
                 <span className="text-white">{location?.timezone.split('/')[1] || 'Malibu'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-sky-400/60">
                 <div className="flex items-center gap-2 font-black italic"><Cloud className="w-3 h-3" /> Atmosphere</div>
                 <span className="text-white">{location?.weather || 'NOMINAL'}</span>
              </div>
           </div>

           <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-sky-400/40 uppercase">Hardware_Node_Lattice</span>
              <div className="space-y-1.5 font-mono">
                 {devices.map((device) => (
                   <button
                     key={device.id}
                     onClick={() => toggleDevice(device.id)}
                     className={cn(
                       "w-full p-2.5 rounded-lg border text-left transition-all group flex items-center justify-between",
                       device.status === 'on' 
                         ? "bg-sky-500/10 border-sky-400/30 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.05)]" 
                         : "bg-white/[0.02] border-white/5 text-white/20"
                     )}
                   >
                      <span className="text-[9px] font-bold tracking-tighter uppercase italic">{device.name}</span>
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        device.status === 'on' ? "bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" : "bg-white/10"
                      )} />
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-4 border-t border-sky-500/10 bg-sky-500/5">
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="w-full py-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-sky-500/20 transition-all flex items-center justify-center gap-3 shadow-[inset_0_0_20px_rgba(56,189,248,0.1)] group"
           >
             <Cpu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" />
             System_Calibrator
           </button>
        </div>
      </aside>

      {/* OVERLAY MODULES */}
      <UISelector 
        isOpen={isUISelectorOpen}
        onClose={() => setIsUISelectorOpen(false)}
        onSelect={handleThemeChange}
        currentTheme={currentTheme}
      />

      <AppLattice 
        isOpen={isAppLatticeOpen}
        onClose={() => setIsAppLatticeOpen(false)}
        apps={localApps}
        onLog={onLog}
      />

      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        personality={personality}
        onUpdatePersonality={setPersonality}
        availableVoices={availableVoices}
        telemetryLevel={telemetryLevel}
        setTelemetryLevel={setTelemetryLevel}
        satelliteStatus={satelliteStatus}
        setSatelliteStatus={setSatelliteStatus}
        powerEfficiency={powerEfficiency}
        setPowerEfficiency={setPowerEfficiency}
        activeArmor={activeArmor}
        setActiveArmor={setActiveArmor}
        isSentinelActive={isSentinelActive}
        setSentinelActive={setIsSentinelActive}
      />

      <LockOverlay 
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        onLog={onLog}
      />

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

      <HolographicDesignModule 
        isOpen={isHologramOpen}
        onClose={() => setIsHologramOpen(false)}
        elements={hologramElements}
        deviceName={hologramTitle}
        onLog={onLog}
      />

      <ExtensionBridgeModule 
        isOpen={isExtensionBridgeOpen}
        onClose={() => setIsExtensionBridgeOpen(false)}
      />

      {!isLocked && <BrowserControlModule 
        tasks={webTasks} 
        onComplete={(id) => setWebTasks(prev => prev.filter(t => t.id !== id))}
        onCancel={(id) => setWebTasks(prev => prev.filter(t => t.id !== id))}
        onAddTask={addWebTask}
      />}
    </div>
  );
}
