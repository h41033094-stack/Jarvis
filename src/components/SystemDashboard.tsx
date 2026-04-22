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

export const SystemDashboard: React.FC = () => {
  const [data, setData] = useState(generateData());
  const [stats, setStats] = useState({
    cpu: 14,
    mem: 32,
    power: 88,
    temp: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), { time: prev.length, value: Math.floor(Math.random() * 40) + 30 }];
        return newData;
      });
      setStats({
        cpu: Math.floor(Math.random() * 10) + 12,
        mem: Math.floor(Math.random() * 5) + 30,
        power: 85 + Math.floor(Math.random() * 10),
        temp: 40 + Math.random() * 5
      });
    }, 2000);
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
          <StatItem icon={<Cpu className="w-2.5 h-2.5" />} label="CPU" value={`${stats.cpu}%`} />
          <StatItem icon={<Database className="w-2.5 h-2.5" />} label="MEM" value={`${stats.mem}%`} />
          <StatItem icon={<Zap className="w-2.5 h-2.5" />} label="PWR" value={`${stats.power}%`} />
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
