import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface HudDecorationsProps {
  telemetryLevel?: number;
  satelliteStatus?: string;
  powerEfficiency?: number;
  activeArmor?: string;
}

export const HudDecorations: React.FC<HudDecorationsProps> = ({
  telemetryLevel = 98.45,
  satelliteStatus = 'ONLINE',
  powerEfficiency = 85.22,
  activeArmor = 'MARK_85'
}) => {
  const [randomData, setRandomData] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(48.65);
  const [systemUptime, setSystemUptime] = useState(52.87);

  useEffect(() => {
    const ram = (window.navigator as any).deviceMemory || 8;
    const cores = window.navigator.hardwareConcurrency || 4;
    const platform = window.navigator.platform;

    const interval = setInterval(() => {
      const paths = [
        `SYS.NODE.${window.location.hostname.toUpperCase()}`,
        `PROC.ID.${Math.floor(Math.random() * 99999)}`,
        `HW.CORES.${cores}`,
        `LOC.TZ.${Intl.DateTimeFormat().resolvedOptions().timeZone.toUpperCase()}`
      ];
      setRandomData(paths);
      setCpuUsage(prev => +(Math.floor(Math.random() * (15 / cores)) + 5 + Math.random()).toFixed(2));
      setSystemUptime(prev => +(Math.floor(Math.random() * (4 / ram)) + 15 + Math.random()).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />

      {/* Central Diagnostic Ring (Eye of J.A.R.V.I.S.) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
        <div className="absolute inset-0 border-[40px] border-cyan-500/10 rounded-full animate-spin-slow" />
        <div className="absolute inset-20 border-[1px] border-dashed border-cyan-400/40 rounded-full animate-spin-reverse-slow" />
        <div className="absolute inset-[300px] border-[2px] border-cyan-500/20 rounded-full shadow-[0_0_50px_rgba(0,242,255,0.2)]" />
        
        {/* Orbiting Points */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{
              rotate: [i * 45, (i * 45) + 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              transformOrigin: '-350px 0px',
              left: 'calc(50% + 350px)'
            }}
          />
        ))}
      </div>

      {/* Top Left: System Codification */}
      <div className="absolute top-10 left-12 hud-text animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-12 h-0.5 bg-cyan-500/50" />
          <span className="text-[10px] tracking-[0.4em] uppercase">{activeArmor}_TELEMETRY</span>
          <div className="w-12 h-0.5 bg-cyan-500/50" />
        </div>
        <div className="font-mono text-[8px] leading-relaxed text-cyan-400/60 uppercase">
          <div>ARMOR_INTEGRITY: {telemetryLevel.toFixed(2)}%</div>
          <div>SATELLITE_UPLINK: {satelliteStatus.toUpperCase()}</div>
          <div>PWR_EFFICIENCY: {powerEfficiency.toFixed(2)}%</div>
        </div>
        <div className="mt-4 border border-cyan-400/40 px-3 py-1 bg-cyan-400/10 inline-block rounded-sm">
          <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase">SYNCHRONIZED</span>
        </div>
      </div>

      {/* Top Center: Bar Graph */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-end gap-1 mb-2 h-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-cyan-500/40"
              animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
            />
          ))}
        </div>
        <div className="font-mono text-[10px] text-cyan-400/80 tracking-widest border-t border-cyan-500/30 pt-1">
          234756900%
        </div>
      </div>

      {/* Top Right: HUD Header */}
      <div className="absolute top-10 right-12 text-right">
        <div className="text-4xl font-black text-cyan-400 tracking-tighter glow-text leading-none">HUD</div>
        <div className="text-[10px] tracking-[0.5em] text-cyan-400/60 uppercase mt-1">FUTURISTIC</div>
        
        <div className="mt-8 border border-cyan-500/40 p-4 inline-block bg-cyan-400/5">
          <div className="flex items-center gap-3">
             <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
             <div className="text-xl font-bold tracking-widest glow-text">LOADING</div>
          </div>
        </div>
      </div>

      {/* Bottom Left: Access Levels & Barcode */}
      <div className="absolute bottom-12 left-12">
        <div className="hud-text text-[9px] mb-6">
          <div className="text-cyan-400/40 mb-1">ACCESS LEVELS &gt;&gt; 2379044</div>
          <div className="text-cyan-400/60">YEOGDFGLJTRERXXVBTIEPW</div>
          <div className="text-cyan-400/60">35780-AKLEPQWETYU-7831</div>
        </div>

        <div className="flex items-end gap-[2px]">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="bg-cyan-500/40"
              style={{ width: i % 4 === 0 ? '4px' : '1px', height: `${15 + Math.random() * 15}px` }}
            />
          ))}
        </div>
        <div className="text-[7px] text-cyan-400/40 font-mono mt-1 tracking-[0.5em]">
          245789YDX2-D2789-1456YKLJH
        </div>
      </div>

      {/* Bottom Right: Circular Meter */}
      <div className="absolute bottom-12 right-12 flex items-center gap-6">
        <div className="text-right">
          <div className="font-mono text-[7px] text-cyan-400/40 tracking-widest leading-relaxed">
            35609000015608721<br/>
            DSGHJKUETOLGYQWXC<br/>
            GTPLZSAHJL23409568
          </div>
        </div>
        
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              className="fill-none stroke-cyan-500/10 stroke-[2]"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="364"
              strokeDashoffset="255"
              className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-black glow-text">30%</div>
            <div className="text-[6px] tracking-[0.2em] opacity-60 uppercase text-center">Reading<br/>System</div>
          </div>
          
          {/* Decorative outer ticks */}
          <div className="absolute -inset-2 border-[1px] border-dashed border-cyan-500/20 rounded-full" />
        </div>
      </div>

      {/* Side Meter: Vertical Scale (Right Edge) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
         {[...Array(15)].map((_, i) => (
           <div key={i} className="flex items-center gap-2 group">
              <div className="text-[8px] font-mono text-cyan-500/40 w-4 tracking-tighter">
                {(120 - i * 10).toString().padStart(3, '0')}
              </div>
              <div className={i === 8 ? "w-6 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.8)]" : "w-3 h-0.5 bg-cyan-500/20"} />
              {i === 8 && (
                <div className="absolute right-full mr-4 text-4xl font-black italic glow-text opacity-80 decoration-cyan-400 underline underline-offset-8">
                  40
                  <div className="absolute top-1/2 left-[calc(100%+8px)] w-0 h-0 border-y-4 border-y-transparent border-l-[6px] border-l-cyan-400" />
                </div>
              )}
           </div>
         ))}
      </div>

      {/* Floating System Stats (Middle Right) */}
      <div className="absolute top-1/3 right-40 text-left scale-90">
         <div className="hud-text text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400/60">USER &gt;&gt;</span>
              <span className="font-bold">57,54% IDLE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400/60">CPU USAGE &gt;&gt;</span>
              <span className="font-bold">{cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="text-cyan-400/60">SYSTEM &gt;&gt;</span>
              <span className="font-bold">{systemUptime}%</span>
            </div>
         </div>
         
         <div className="mt-4 flex gap-4">
            <div className="w-0.5 h-12 bg-cyan-500/40" />
            <div className="w-32 h-12 border-b border-cyan-500/30 relative">
               <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-cyan-400 glow-text" />
            </div>
         </div>
      </div>
      
      {/* Floating System Stats (Middle Left) */}
      <div className="absolute top-2/3 left-40 text-left scale-90">
         <div className="hud-text text-xs space-y-1 opacity-70">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400/60">USER &gt;&gt;</span>
              <span className="font-bold">89,54% IDLE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400/60">CPU USAGE &gt;&gt;</span>
              <span className="font-bold">56,78%</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="text-cyan-400/60">SYSTEM &gt;&gt;</span>
              <span className="font-bold">43,67%</span>
            </div>
         </div>
      </div>
    </div>
  );
};
