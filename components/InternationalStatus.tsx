"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

export default function InternationalStatus() {
  const [times, setTimes] = useState({
    lisbon: "",
    newYork: "",
    tokyo: ""
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      const format = (tz: string) => 
        new Intl.DateTimeFormat('pt-BR', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);

      setTimes({
        lisbon: format('Europe/Lisbon'),
        newYork: format('America/New_York'),
        tokyo: format('Asia/Tokyo')
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-600/10 border-y border-blue-500/10 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-400">Suporte Online Agora</span>
        </div>
        
        <div className="h-3 w-[1px] bg-white/10 hidden sm:block"></div>
        
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-blue-500" />
          <span>Lisboa/Dublin: <span className="text-white">{times.lisbon}</span></span>
        </div>
        
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-purple-500" />
          <span>Nova York/Miami: <span className="text-white">{times.newYork}</span></span>
        </div>
        
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-red-500" />
          <span>Tóquio: <span className="text-white">{times.tokyo}</span></span>
        </div>
      </div>
    </div>
  );
}
