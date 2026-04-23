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
    }, 20000); 
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
        setIsSentinelActive(false);
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
      "w-full h-full relative transition-all duration-500",
      isExpanded && "fixed inset-0 z-[500] bg-slate-950/90 backdrop-blur-3xl p-8 flex items-center justify-center pointer-events-auto"
    )}>
      <motion.div 
        layout
        className={cn(
          "w-full h-full flex flex-col relative",
          isExpanded ? "max-w-5xl rounded-[2.5rem] border border-sky-400/20 bg-slate-900/40 p-8" : ""
        )}
      >
        <div className="flex items-center justify-between mb-2 relative z-10">
          <h3 className="text-[8px] font-black uppercase tracking-widest text-sky-400 flex items-center gap-2 italic">
            <Scan className="w-3 h-3" /> {isExpanded ? "Optical_Interface_Matrix" : "VIS_Core"}
          </h3>
          <div className="flex gap-2 items-center">
            {isActive && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-sky-500/20 rounded-md transition-colors text-sky-400/60 hover:text-sky-400"
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            )}
            <button 
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[8px] border transition-all font-black uppercase tracking-tighter shadow-sm",
                isActive ? "bg-sky-500/20 border-sky-500 text-sky-400" : "bg-slate-800 border-slate-700 text-slate-400"
              )}
            >
              {isActive ? "Sens" : "Sens_Off"}
            </button>
          </div>
        </div>

        <div className={cn(
          "relative bg-black rounded-lg overflow-hidden border border-sky-500/10 mb-2",
          isExpanded ? "flex-1 mb-8" : "aspect-video"
        )}>
          {isActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={cn(
                "w-full h-full object-cover transition-all contrast-110 grayscale hover:grayscale-0",
                isExpanded ? "grayscale-0" : ""
              )} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-50">
               <ShieldAlert className="w-6 h-6 text-slate-500 animate-pulse" />
               <span className="text-[7px] uppercase font-mono tracking-[0.3em] font-bold">Scanning...</span>
            </div>
          )}

          {isActive && (
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[1px] bg-sky-400/40 shadow-[0_0_10px_#38bdf8] z-10"
            />
          )}

          <AnimatePresence>
            {identifiedPerson && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 glass p-4 border-l-4 border-emerald-500 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> 
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">ID_CONFIRMED</span>
                    <span className="text-xs font-bold text-sky-50 uppercase tracking-tight italic">{identifiedPerson}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <button
              disabled={isScanning}
              onClick={() => captureFrameAndAnalyze()}
              className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 p-2 rounded-lg text-[8px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-sky-400"
            >
              {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />}
              Verify
            </button>
            <button
              disabled={isScanning}
              onClick={() => analyzeScene()}
              className="bg-slate-800/40 hover:bg-sky-500/20 border border-sky-400/5 p-2 rounded-lg text-[8px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-sky-100/40"
            >
              <Eye className="w-3 h-3" />
              Scan
            </button>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} width={400} height={300} className="hidden" />
    </div>
  );
};

import { cn } from '../lib/utils';
