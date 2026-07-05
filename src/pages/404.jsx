import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

/**
 * 404 — matches the site's dark hero aesthetic. Not a dead-end apology;
 * offers three real next steps (post an RFQ, browse leads, go home).
 */
export default function NoRouteFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Same industrial grid + accent glow as Hero, for cohesion */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246,0.15), transparent 70%)' }}
      />

      <div className="relative z-10 text-center max-w-lg">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">
          Page not found · 404
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
          Nothing here.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mt-5 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Try one of these instead.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/requirement"
            className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm px-6 py-3.5 rounded-xl transition-all"
          >
            Post a requirement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/product-listing"
            className="group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
          >
            <Search className="w-4 h-4" />
            Browse live RFQs
          </Link>
        </div>

        <Link
          to="/"
          className="mt-6 inline-block text-xs font-bold text-slate-500 hover:text-white underline underline-offset-4"
        >
          Or head back home
        </Link>
      </div>
    </div>
  );
}
