import { ArrowRight, Zap, Users, ShieldCheck } from 'lucide-react';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

/**
 * Hero — the front door.
 *
 * Tone: name a pain everyone recognizes ("chasing suppliers on WhatsApp") in
 * one line, then commit to a promise ("one place, 24 hours"). Avoid corporate
 * filler ("leading," "seamless," "empowering"). Every sentence earns its space
 * or gets cut.
 *
 * Structure: pain-line + promise-line + universal CTAs + inline trust anchors.
 * A single focused full-width column — no carousel, no hero search (search lives
 * once in the navbar). Every element is either a conversion driver, a proof
 * point, or an action.
 */
export default function Hero({ onOpenAuth }) {
  const { user } = useUserState();
  const navigate = useNavigate();

  const handlePostRequirement = () => {
    if (user) navigate('/requirement');
    else onOpenAuth('buyer');
  };

  const handleFindLeads = () => {
    if (user) navigate('/dashboard');
    else onOpenAuth('seller');
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-blue-500/30 py-16 sm:py-24">
      {/* Absolute high-tech glowing backgrounds & vector grids */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
        backgroundSize: '56px 56px'
      }} />
      
      {/* Colorful high-contrast abstract blurred orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)' }} />
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-30"
           style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35), transparent 70%)' }} />
      <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none opacity-30"
           style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-4 text-center flex flex-col items-center z-10">
        
        {/* Eyebrow badge with dynamic gradient and glowing border */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/60 bg-blue-950/80 px-4 py-2 text-xs sm:text-sm font-bold text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-bounce mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          Next-Gen Materials Procurement Exchange
        </div>

        {/* Crazy, punchy bold headline with gradient fills */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
          Stop chasing suppliers.
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
            Post once, get quotes in hours.
          </span>
        </h1>

        {/* High-visibility promise line */}
        <p className="text-slate-200 text-lg sm:text-2xl leading-relaxed max-w-3xl mt-6 text-slate-300 font-medium">
          SaralBuy broadcasts your requirements to audited suppliers across Karnataka.
          <span className="text-white block mt-3 font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            ✦ Anonymous sourcing &bull; Competitive pricing &bull; Zero spam ✦
          </span>
        </p>

        {/* Dual Actions with Neon and Premium borders */}
        <div className="flex flex-col sm:flex-row gap-4 pt-12 justify-center w-full sm:w-auto">
          <button
            onClick={handlePostRequirement}
            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base sm:text-lg px-10 py-5 rounded-2xl cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] active:scale-98 transition-all duration-300 w-full sm:w-auto"
          >
            Post a Requirement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <button
            onClick={handleFindLeads}
            className="group inline-flex items-center justify-center gap-2 bg-slate-950/60 hover:bg-slate-900 border-2 border-slate-800 hover:border-blue-500 active:scale-98 text-white font-bold text-base sm:text-lg px-10 py-5 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md w-full sm:w-auto"
          >
            I&apos;m a Supplier &mdash; Find Leads
          </button>
        </div>

        {/* Neon Border Separator & Core Feature Anchors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-900 w-full max-w-5xl mt-12">
          <TrustAnchor icon={Zap} value="One Post Broadcast" label="Connect with verified distributors instantly" />
          <TrustAnchor icon={Users} value="100% Anonymous" label="Hide identity until you approve quotes" />
          <TrustAnchor icon={ShieldCheck} value="Verified & Vetted" label="Anti-fraud protection on every trade" />
        </div>
      </div>
    </section>
  );
}

function TrustAnchor({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center sm:items-start gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900 hover:border-blue-500/20 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className="text-left min-w-0">
        <div className="text-base sm:text-lg font-black text-white leading-tight">{value}</div>
        <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-snug">{label}</div>
      </div>
    </div>
  );
}
