import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import { TrendingUp, PackageCheck, Users, Clock } from 'lucide-react';

/**
 * ProofStrip — the "this market is real" band, placed immediately below Hero.
 *
 * HONEST NUMBERS ONLY. A metric that comes back as 0 (or null for "not
 * enough data yet") gets hidden — not shown as "0" and never padded to
 * look bigger. A visible "1 verified supplier" beats "142"; a hidden tile
 * beats both when we genuinely don't have the data. If the entire band
 * would be empty (pre-launch DB), the whole component collapses so we
 * don't ship a row of question marks.
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
function formatDurationMs(ms) {
  if (!ms || ms <= 0) return null;
  const hrs = ms / (1000 * 60 * 60);
  if (hrs < 1) {
    const mins = Math.round(ms / (1000 * 60));
    return `${mins} min`;
  }
  if (hrs < 48) return `${hrs.toFixed(1)} hrs`;
  return `${Math.round(hrs / 24)} days`;
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

  // Each tile is included only if the underlying number is genuinely present.
  // A 0 count → hide (no "0 verified suppliers" on the front page).
  const rawMetrics = [
    stats?.sourcedVolume > 0 && {
      icon: TrendingUp,
      value: formatINR(stats.sourcedVolume),
      label: 'Sourced through platform',
      accent: 'from-emerald-50 to-white border-emerald-200 text-emerald-600',
    },
    stats?.activeRequirements > 0 && {
      icon: PackageCheck,
      value: formatCount(stats.activeRequirements),
      label: 'Live requirements',
      accent: 'from-orange-50 to-white border-orange-200 text-orange-600',
    },
    stats?.activeSuppliers > 0 && {
      icon: Users,
      value: formatCount(stats.activeSuppliers),
      label: 'Verified suppliers',
      accent: 'from-orange-50 to-white border-orange-200 text-orange-600',
    },
    formatDurationMs(stats?.avgFirstQuoteMs) && {
      icon: Clock,
      value: formatDurationMs(stats.avgFirstQuoteMs),
      label: 'Avg. first quote',
      accent: 'from-amber-50 to-white border-amber-200 text-amber-600',
    },
  ];
  const metrics = rawMetrics.filter(Boolean);

  // Pre-launch state: nothing to prove yet, don't ship a hollow band.
  // Skip if we have zero metrics AND zero activities.
  if (metrics.length === 0 && activities.length === 0) return null;

  // Adapt columns to how many tiles we actually have — a single tile at
  // md:grid-cols-4 looks stubby, four at grid-cols-2 wraps awkwardly.
  const gridCols = {
    1: 'grid-cols-1 max-w-sm mx-auto',
    2: 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[metrics.length] || 'grid-cols-2 md:grid-cols-4';

  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 py-10 sm:py-14">
        {/* Honest proof numbers — larger, more readable tiles */}
        {metrics.length > 0 && (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`relative rounded-xl border bg-gradient-to-br ${m.accent} p-5 sm:p-6`}
            >
              <m.icon className="w-6 h-6 mb-3 opacity-90" />
              <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-none tracking-tight">
                {m.value}
              </div>
              <div className="text-sm font-bold text-slate-600 mt-2 leading-snug">
                {m.label}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Live activity ticker — the market pulse */}
        {activities.length > 0 && current && (
          <div className="mt-5 flex items-center gap-3 sm:gap-4 rounded-lg bg-white border border-slate-200 px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-2 shrink-0 pr-3 sm:pr-4 border-r border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap hidden sm:inline">
                Live
              </span>
            </div>
            <div key={tickerIndex} className="flex-1 flex items-center gap-2 min-w-0 animate-slide-up">
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  current.type === 'quote'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}
              >
                {current.type === 'quote' ? 'Quote' : 'RFQ'}
              </span>
              <span className="text-xs sm:text-sm text-slate-700 font-medium truncate">
                {current.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
