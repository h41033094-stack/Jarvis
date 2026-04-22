import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, UserCheck, ShieldAlert, Scan, Maximize2, Minimize2, Eye, ShieldCheck, ShieldOff } from 'lucide-react';
import { analyzeVision, verifyOwner } from '../services/geminiService';

export const VisionModule: React.FC<{ 
  onLog: (msg: string) => void;
  onSecurityAction: (action: 'lock' | 'unlock' | 'enroll', data?: any) => void;
  isOwnerVerified: boolean;
  isExpandedOverride?: boolean;
}> = ({ onLog, onSecurityAction, isOwnerVerified, isExpandedOverride = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSentinelActive, setIsSentinelActive] = useState(false);
  const [identifiedPerson, setIdentifiedPerson] = useState<string | null>(null);
  const [sceneData, setSceneData] = useState<string | null>(null);

  const sentinelTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isExpandedOverride) setIsExpanded(true);
  }, [isExpandedOverride]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
      setIsSentinelActive(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (isSentinelActive && isActive) {
      onLog("SENTINEL_MODE_ENGAGED: CONTINUOUS_SURVEILLANCE_ACTIVE");
      startSentinelScanning();
    } else {
      if (sentinelTimerRef.current) {
        clearInterval(sentinelTimerRef.current);
        sentinelTimerRef.current = null;
      }
    }
    return () => {
      if (sentinelTimerRef.current) clearInterval(sentinelTimerRef.current);
    };
  }, [isSentinelActive, isActive]);

  const startSentinelScanning = () => {
    if (sentinelTimerRef.current) clearInterval(sentinelTimerRef.current);
    sentinelTimerRef.current = setInterval(() => {
      if (!isScanning && !isEnrolling) {
        captureFrameAndAnalyze(true);
      }
    }, 20000); // Scan every 20 seconds
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      onLog("VISUAL_SENSORS_ONLINE: STREAM_ESTABLISHED");
    } catch (err) {
      console.error("Camera error:", err);
      onLog("VISUAL_SENSOR_FAILED: PERMISSION_DENIED");
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    onLog("VISUAL_SENSORS_OFFLINE");
  };

  const captureFrameAndAnalyze = async (isSentinel = false) => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!isSentinel) setIsScanning(true);
    
    if (isSentinel) {
      onLog("SENTINEL_SCAN: VERIFYING_CLEARANCE...");
    } else {
      onLog("INITIATING_RETINAL_SCAN...");
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

    try {
      const result = await verifyOwner(base64);
      
      if (result?.includes("AUTHORIZED")) {
        setIdentifiedPerson("Tony Stark (Verified)");
        if (!isSentinel) onLog("PERSONA_IDENTIFIED: WELCOME_BACK_SIR");
        onSecurityAction('unlock');
      } else {
        setIdentifiedPerson("Unknown Biomass");
        onLog("SECURITY_ALERT: UNRECOGNIZED_USER_DETECTED");
        onSecurityAction('lock');
        setIsSentinelActive(false); // Stop sentinel after locking to prevent loops
      }
    } catch (error) {
      onLog("VISION_CORE_ERROR: VERIFICATION_FAILED");
    }

    if (!isSentinel) setIsScanning(false);
    setTimeout(() => setIdentifiedPerson(null), 5000);
  };

  const analyzeScene = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    onLog("INITIATING_SCENE_ANALYSIS...");

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

    const result = await analyzeVision(base64);
    setSceneData(result || "No data.");
    onLog("SCENE_ANALYSIS_COMPLETE");
    setIsScanning(false);
    setTimeout(() => setSceneData(null), 10000);
  };

  const enrollFace = async () => {
     if (!videoRef.current || !canvasRef.current) return;
     setIsEnrolling(true);
     onLog("INITIATING_BIOMETRIC_ENROLLMENT...");

     const context = canvasRef.current.getContext('2d');
     if (!context) return;
     context.drawImage(videoRef.current, 0, 0, 400, 300);
     const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
     
     const result = await analyzeVision(base64);
     onLog(`ENROLLMENT_STATUS: SYNC_COMPLETE`);
     onSecurityAction('enroll', { description: result });
     
     setIsEnrolling(false);
  };

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-500",
      isExpanded 
        ? "inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-8" 
        : "right-4 top-4 w-64"
    )}>
      <motion.div 
        layout
        className={cn(
          "jarvis-panel border-r-4 border-sky-500 bg-slate-900/40 backdrop-blur-md relative overflow-hidden group shadow-2xl",
          isExpanded ? "w-full max-w-4xl p-6 rounded-[2.5rem]" : "p-3"
        )}
      >
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className={cn(
            "font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2 glow-text italic",
            isExpanded ? "text-lg" : "text-xs"
          )}>
            <Camera className={isExpanded ? "w-5 h-5" : "w-3 h-3"} /> 
            {isExpanded ? "Optical_Interface_Matrix" : "Vision Core"}
          </h3>
          <div className="flex gap-3 items-center">
            {isActive && (
              <button 
                onClick={() => setIsSentinelActive(!isSentinelActive)}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isSentinelActive ? "bg-rose-500/20 text-rose-400" : "hover:bg-sky-500/20 text-sky-400/60 hover:text-sky-400"
                )}
                title={isSentinelActive ? "Sentinel Mode: ACTIVE" : "Engage Sentinel Mode"}
              >
                {isSentinelActive ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
              </button>
            )}
            {isActive && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-sky-500/20 rounded-lg transition-colors text-sky-400/60 hover:text-sky-400"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
            {!isOwnerVerified && isActive && (
               <button 
                onClick={enrollFace}
                disabled={isEnrolling}
                className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-400/60 hover:text-emerald-400"
                title="Enroll Face"
               >
                 <UserCheck className={cn("w-4 h-4", isEnrolling && "animate-pulse")} />
               </button>
            )}
            <button 
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] border transition-all font-black uppercase tracking-tighter shadow-sm",
                isActive ? "bg-sky-500/20 border-sky-500 text-sky-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              )}
            >
              {isActive ? "Sensors_Active" : "Sensors_Offline"}
            </button>
          </div>
        </div>

        <div className={cn(
          "relative bg-black rounded-[1.5rem] overflow-hidden border border-sky-500/20 mb-4 shadow-[0_0_50px_rgba(56,189,248,0.1)]",
          isExpanded ? "aspect-video h-[60vh]" : "aspect-video"
        )}>
          {isActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={cn(
                "w-full h-full object-cover transition-all contrast-110",
                isExpanded ? "grayscale-0" : "grayscale brightness-110 contrast-125"
              )} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-50">
              <div className="relative">
                 <ShieldAlert className="w-12 h-12 text-slate-500 animate-pulse" />
                 <div className="absolute inset-0 animate-ping border border-sky-500/20 rounded-full" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold">Visual_Sensors_Standby</span>
            </div>
          )}

          {isActive && (
            <>
              {/* Scan Overlay */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-sky-400/30 shadow-[0_0_20px_#38bdf8] z-10"
              />
              
              <div className="absolute inset-0 border-[40px] border-transparent p-8 pointer-events-none">
                <div className="w-full h-full border border-sky-400/10 rounded-2xl relative">
                  {/* Technical Markers */}
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-400 shadow-[-4px_-4px_10px_rgba(56,189,248,0.2)]" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sky-400 shadow-[4px_-4px_10px_rgba(56,189,248,0.2)]" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sky-400 shadow-[-4px_4px_10px_rgba(56,189,248,0.2)]" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-400 shadow-[4px_4px_10px_rgba(56,189,248,0.2)]" />
                   
                   {/* Grid Overlay */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
              </div>

              {isExpanded && (
                 <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="glass px-3 py-1 rounded-full flex items-center gap-2 border border-sky-500/20">
                       <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                       <span className="text-[10px] font-mono text-sky-400 uppercase font-bold tracking-widest">LIVE_FEED_STREAM</span>
                    </div>
                    <div className="glass px-3 py-1 rounded-full border border-sky-500/20 text-[8px] font-mono text-sky-100/50 uppercase">
                       FPS: 60 // RES: 1080P // SENSOR: MK_VII
                    </div>
                 </div>
              )}
            </>
          )}

          <AnimatePresence>
            {identifiedPerson && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl border-l-4 border-emerald-500 shadow-xl backdrop-blur-md",
                  isExpanded ? "max-w-md" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-emerald-400" /> 
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Identity_Confirmed</span>
                    <span className="text-sm font-bold text-sky-50 uppercase glow-text tracking-tight italic">{identifiedPerson}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {sceneData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 right-6 w-80 glass p-5 rounded-3xl border border-sky-500/30 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest italic">Scene_Extraction</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-sky-100/80 italic font-mono uppercase tracking-tight">
                  {sceneData}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button
              disabled={isScanning}
              onClick={captureFrameAndAnalyze}
              className="group bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 p-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              {isScanning ? (
                <div className="animate-spin w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full" />
              ) : (
                <Scan className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              {isExpanded ? "Identify_Subject" : "Verify"}
            </button>
            <button
              disabled={isScanning}
              onClick={analyzeScene}
              className="group bg-slate-800/40 hover:bg-sky-500/20 border border-sky-400/5 hover:border-sky-500/30 p-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-sky-100/40 hover:text-sky-400"
            >
              <Eye className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              {isExpanded ? "Analyze_Environment" : "Scan"}
            </button>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} width={400} height={300} className="hidden" />
    </div>
  );
};

import { cn } from '../lib/utils';
