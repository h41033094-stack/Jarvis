import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Database, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 40) + 30
  }));
};

interface SystemDashboardProps {
  telemetryLevel?: number;
  powerEfficiency?: number;
  activeArmor?: string;
  satelliteStatus?: string;
}

export const SystemDashboard: React.FC<SystemDashboardProps> = ({
  telemetryLevel = 98.45,
  powerEfficiency = 85.22,
  activeArmor = 'MARK_85',
  satelliteStatus = 'ONLINE'
}) => {
  const [data, setData] = useState(generateData());
  
  // Attempt to grab real baseline stats from the browser environment
  const getHardwareBaseline = () => {
    // navigator.deviceMemory gives RAM in GB (approx)
    // navigator.hardwareConcurrency gives number of logical processors
    const ram = (window.navigator as any).deviceMemory || 8;
    const cores = window.navigator.hardwareConcurrency || 4;
    return { ram, cores };
  };

  const [stats, setStats] = useState({
    cpu: 10,
    mem: 0,
    power: 0,
    temp: 42
  });

  useEffect(() => {
    const hardware = getHardwareBaseline();
    
    // Attempt to get real battery status
    const updateBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setStats(prev => ({ 
            ...prev, 
            power: Math.round(battery.level * 100),
            isCharging: battery.charging
          }));

          battery.addEventListener('levelchange', () => {
            setStats(prev => ({ ...prev, power: Math.round(battery.level * 100) }));
          });
        }
      } catch (e) {
        console.warn("Battery status unavailable, using synthetic power metrics.");
        setStats(prev => ({ ...prev, power: 85 + Math.floor(Math.random() * 10) }));
      }
    };

    updateBattery();
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), { time: prev.length, value: Math.floor(Math.random() * 40) + 30 }];
        return newData;
      });
      
      setStats(prev => {
        // Real memory usage if available
        let memUsage = prev.mem;
        if ((performance as any).memory) {
          const mem = (performance as any).memory;
          memUsage = Math.round((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100);
        } else {
          memUsage = Math.floor((2 / hardware.ram) * 100) + Math.floor(Math.random() * 5);
        }

        return {
          ...prev,
          cpu: Math.floor(Math.random() * (20 / hardware.cores)) + 5, 
          mem: memUsage,
          temp: 34 + Math.random() * 6
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-32 left-8 transition-all">
      <div className="glass p-3 border-l-4 border-sky-400 bg-slate-900/60 flex flex-col gap-4 w-48 shadow-2xl">
        <div className="flex items-center gap-2 text-sky-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Core_Metrics</h3>
        </div>

        <div className="space-y-3">
          <StatItem icon={<Cpu className="w-2.5 h-2.5" />} label="ARMOR" value={`${telemetryLevel.toFixed(1)}%`} />
          <StatItem icon={<Zap className="w-2.5 h-2.5" />} label="PWR" value={`${powerEfficiency.toFixed(1)}%`} />
          <StatItem icon={<Activity className="w-2.5 h-2.5" />} label="SYNC" value={satelliteStatus.toUpperCase()} />
        </div>

        <div className="h-12 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#38bdf8" 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false} 
              />
              <YAxis hide domain={[0, 100]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center justify-between border-b border-sky-400/10 pb-1">
    <div className="flex items-center gap-2">
      <div className="text-sky-400/60">{icon}</div>
      <span className="text-[8px] font-mono text-sky-100/40 uppercase">{label}</span>
    </div>
    <span className="text-[9px] font-mono font-bold text-sky-400">{value}</span>
  </div>
);
