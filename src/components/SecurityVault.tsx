import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Lock, Cloud, HardDrive, AlertTriangle, Fingerprint, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const SecurityVault: React.FC<{ isOpen: boolean; onClose: () => void; onLog: (msg: string) => void }> = ({ isOpen, onClose, onLog }) => {
  const [authStep, setAuthStep] = useState<'none' | 'biometric' | 'mfa' | 'granted'>('none');
  const [cloudServices, setCloudServices] = useState([
    { name: 'STARK_DRIVE', provider: 'Google Cloud', encrypted: true, active: true },
    { name: 'SHIELD_SECURE', provider: 'Azure', encrypted: true, active: false },
    { name: 'VAULT_7', provider: 'Dropbox', encrypted: true, active: true },
  ]);

  const handleStartAuth = () => {
    setAuthStep('biometric');
    onLog("SECURITY_CHALLENGE_ISSUED: MFA_REQUIRED");
  };

  const handleBiometric = () => {
    onLog("BIOMETRIC_TOKEN_VERIFIED");
    setAuthStep('mfa');
  };

  const handleMFAGrant = () => {
    onLog("MFA_PASSED: ACCESS_GRANTED");
    setAuthStep('granted');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-4xl h-[600px] glass rounded-[2.5rem] border-sky-500/30 overflow-hidden flex"
          >
            {/* Sidebar Stats */}
            <div className="w-64 border-r border-sky-400/10 p-8 flex flex-col gap-8 bg-black/20">
               <div className="flex flex-col gap-2">
                  <Shield className="w-8 h-8 text-sky-400 animate-pulse" />
                  <h2 className="text-xl font-bold tracking-tight glow-text text-sky-100">STARK_VAULT</h2>
                  <p className="text-[10px] font-mono text-sky-400 uppercase tracking-widest opacity-60">Level 7 Clearance</p>
               </div>

               <div className="space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                     <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Encrypted Tunnel</p>
                     <p className="text-[10px] text-sky-100/60 leading-tight">AES-256 Symmetric key encryption active on all uplink nodes.</p>
                  </div>
                  <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
                     <p className="text-[10px] font-bold text-sky-400 uppercase mb-1">Integrity Scan</p>
                     <p className="text-[10px] text-sky-100/60 leading-tight">Last audit: 3.2ms ago. No irregularities detected Sir.</p>
                  </div>
               </div>
               
               <button 
                  onClick={onClose}
                  className="mt-auto flex items-center gap-2 text-[10px] font-bold text-sky-400/60 uppercase hover:text-sky-400 transition-colors"
               >
                  <X className="w-4 h-4" /> DISCONNECT_VAULT
               </button>
            </div>

            {/* Main Content Areas */}
            <div className="flex-1 p-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">Authenticated Cloud Arrays</h3>
                   <p className="text-sm text-sky-100/60 font-medium">Manage and secure external data nodes.</p>
                </div>
                {authStep !== 'granted' && (
                  <button 
                    onClick={handleStartAuth}
                    className="bg-rose-500/20 border border-rose-500/40 text-rose-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                  >
                    <Lock className="w-3 h-3" /> Secure Access Required
                  </button>
                )}
              </div>

              {authStep === 'granted' ? (
                <div className="grid grid-cols-2 gap-4">
                  {cloudServices.map((service, idx) => (
                    <div key={idx} className="glass p-5 rounded-3xl border-sky-400/10 hover:border-sky-400/30 transition-all group">
                       <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            "p-3 rounded-2xl",
                            service.active ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-500"
                          )}>
                             {service.provider === 'Dropbox' ? <Cloud className="w-5 h-5" /> : <HardDrive className="w-5 h-5" />}
                          </div>
                          {service.encrypted && <Shield className="w-3 h-3 text-emerald-400" />}
                       </div>
                       <h4 className="text-sm font-bold text-sky-100">{service.name}</h4>
                       <p className="text-[10px] text-sky-100/40 uppercase mb-4">{service.provider}</p>
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-bold",
                            service.active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          )}>
                            {service.active ? 'CONNECTED' : 'DISCONNECTED'}
                          </div>
                          <button className="text-[8px] font-bold text-sky-400/60 hover:text-sky-400 uppercase underline ml-auto">Manage Link</button>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 border border-dashed border-sky-400/20 rounded-[3rem]">
                   {authStep === 'none' && (
                     <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-sky-400/40 mx-auto mb-4" />
                        <p className="text-sky-100/40 font-mono text-xs uppercase italic">Awaiting Clearance Initiation...</p>
                     </div>
                   )}
                   {authStep === 'biometric' && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center"
                     >
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          onClick={handleBiometric}
                          className="w-24 h-24 rounded-full border-2 border-sky-400 flex items-center justify-center mb-6 cursor-pointer bg-sky-500/5 hover:bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                        >
                           <Fingerprint className="w-10 h-10 text-sky-400" />
                        </motion.div>
                        <p className="text-sky-100 font-bold uppercase tracking-widest text-xs mb-2">Place Thumb on Sensor</p>
                        <p className="text-sky-100/40 text-[10px] uppercase">Biometric scanning initiated...</p>
                     </motion.div>
                   )}
                   {authStep === 'mfa' && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center w-full max-w-xs"
                     >
                        <Key className="w-12 h-12 text-sky-400 mx-auto mb-6" />
                        <p className="text-sky-100 font-bold uppercase tracking-widest text-xs mb-4">Multi-Factor Token Required</p>
                        <div className="flex gap-2 justify-center mb-6">
                           {[...Array(6)].map((_, i) => (
                             <div key={i} className="w-8 h-10 bg-sky-500/10 border border-sky-500/30 rounded-lg flex items-center justify-center font-mono text-sky-400 text-lg">*</div>
                           ))}
                        </div>
                        <button 
                          onClick={handleMFAGrant}
                          className="w-full bg-sky-500 text-slate-950 py-3 rounded-2xl font-bold uppercase tracking-tighter text-xs shadow-glow"
                        >
                           Verify Security Token
                        </button>
                     </motion.div>
                   )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
