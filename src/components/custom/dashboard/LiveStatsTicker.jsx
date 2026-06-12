import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';

export default function LiveStatsTicker() {
  const { fn: fetchStats, data: stats, loading } = useFetch(productService.getLiveStats);
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  useEffect(() => {
    fetchStats();
    // Poll every 30 seconds to keep stats genuine and fresh
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stats?.activities?.length) return;
    const activityInterval = setInterval(() => {
      setActiveActivityIndex(prev => (prev + 1) % stats.activities.length);
    }, 5000);
    return () => clearInterval(activityInterval);
  }, [stats]);

  const activities = stats?.activities || [
    { type: 'requirement', title: 'Bulk Sourcing RFQ posted for TMT Steel Rebars in Peenya, Bangalore' },
    { type: 'quote', title: 'Supplier quote submitted for OPC 53 Cement from Hubballi' },
    { type: 'requirement', title: 'Bulk Sourcing RFQ posted for CPVC Pipes in Mysuru' },
    { type: 'quote', title: 'Supplier quote submitted for LED Panel Lights from Bangalore' }
  ];

  return (
    <div className="w-full bg-slate-900 text-white rounded-xl py-2.5 px-4 shadow-sm mt-4 overflow-hidden flex items-center gap-4 border border-slate-800">
      <div className="flex items-center gap-2 shrink-0 border-r border-slate-700 pr-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 whitespace-nowrap">
          Live Activity Feed
        </span>
      </div>
      
      {/* Animated Slide Ticker */}
      <div className="flex-1 overflow-hidden h-5 relative flex items-center">
        {activities.length > 0 && (
          <div 
            key={activeActivityIndex}
            className="text-xs text-slate-200 font-medium animate-slide-up flex items-center gap-2 truncate"
          >
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
              activities[activeActivityIndex]?.type === 'quote' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}>
              {activities[activeActivityIndex]?.type === 'quote' ? 'Bid Placed' : 'RFQ Posted'}
            </span>
            <span className="truncate">{activities[activeActivityIndex]?.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
