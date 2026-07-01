import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import { TrendingUp, PackageCheck, Users, Clock } from 'lucide-react';

/**
 * ProofStrip — the "this market is real" band, placed immediately below Hero.
 *
 * Two purposes:
 *   1. Big numbers that answer the unspoken visitor question, "is this
 *      abandoned or alive?" — live counts from the backend, not vanity
 *      hardcoded metrics.
 *   2. A rotating live activity line — same data source as the dashboard
 *      ticker, but styled to feel like a stock ticker on a trading floor.
 *      Movement = life.
 */

function formatINR(n) {
  const num = Number(n) || 0;
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)} Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(1)} L`;
  if (num >= 1_000) return `₹${Math.round(num / 1_000)}k`;
  return `₹${num}`;
}
function formatCount(n) {
  const num = Number(n) || 0;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

export default function ProofStrip() {
  const { fn: fetchStats, data: stats } = useFetch(productService.getLiveStats);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!stats?.activities?.length) return;
    const t = setInterval(() => {
      setTickerIndex(i => (i + 1) % stats.activities.length);
    }, 4000);
    return () => clearInterval(t);
  }, [stats?.activities?.length]);

  const activities = stats?.activities || [];
  const current = activities[tickerIndex];

  const metrics = [
    {
      icon: TrendingUp,
      value: formatINR(stats?.sourcedVolume),
      label: 'Sourced this quarter',
      accent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
    },
    {
      icon: PackageCheck,
      value: formatCount(stats?.activeRequirements),
      label: 'Live requirements',
      accent: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-300',
    },
    {
      icon: Users,
      value: formatCount(stats?.activeSuppliers),
      label: 'Verified suppliers',
      accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-300',
    },
    {
      icon: Clock,
      value: '4 hrs',
      label: 'Avg. first quote',
      accent: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
    },
  ];

  return (
    <section className="bg-slate-950 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* The four proof numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`relative rounded-xl border bg-gradient-to-br ${m.accent} p-4 sm:p-5`}
            >
              <m.icon className="w-5 h-5 mb-2 opacity-80" />
              <div className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                {m.value}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1.5">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live activity ticker — the market pulse */}
        {activities.length > 0 && current && (
          <div className="mt-5 flex items-center gap-3 sm:gap-4 rounded-lg bg-black/40 border border-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2 shrink-0 pr-3 sm:pr-4 border-r border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap hidden sm:inline">
                Live
              </span>
            </div>
            <div key={tickerIndex} className="flex-1 flex items-center gap-2 min-w-0 animate-slide-up">
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  current.type === 'quote'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                }`}
              >
                {current.type === 'quote' ? 'Quote' : 'RFQ'}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                {current.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
