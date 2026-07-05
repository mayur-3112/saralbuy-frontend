import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Users, ShieldCheck } from 'lucide-react';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

/**
 * Hero — the front door.
 *
 * Tone: name a pain everyone recognizes ("chasing suppliers on WhatsApp") in
 * one line, then commit to a promise ("post once, quotes in hours"). Avoid
 * corporate filler. Every sentence earns its space or gets cut.
 *
 * Structure: light theme matching the rest of the page (the dark-neon pass
 * was reversed). Two columns — pain/promise/CTAs on the left, a crossfading
 * category image carousel on the right — with the trust anchors strip below.
 * Search lives once, in the navbar (visible on every page incl. this one).
 */

const HERO_IMAGES = [
  { url: '/image/Category/building_materials.png', caption: 'Building Materials' },
  { url: '/image/Category/electrical_lights.png', caption: 'Electrical & Lighting' },
  { url: '/image/Category/plumbing_sanitary.png', caption: 'Plumbing & Sanitary' },
  { url: '/image/Category/tiles_flooring.png', caption: 'Tiles & Flooring' },
  { url: '/image/Category/paints_waterproofing.png', caption: 'Paints & Waterproofing' },
  { url: '/image/Category/plywood_hardware.png', caption: 'Plywood & Hardware' },
  { url: '/image/Category/safetyEquipment.png', caption: 'Safety Equipment' },
  { url: '/image/Category/industrial_tools.png', caption: 'Industrial Tools' },
];

export default function Hero({ onOpenAuth }) {
  const { user } = useUserState();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance the carousel; pause while the user hovers it.
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  const handlePostRequirement = () => {
    if (user) navigate('/requirement');
    else onOpenAuth('buyer');
  };

  const handleFindLeads = () => {
    if (user) navigate('/dashboard');
    else onOpenAuth('seller');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-14 sm:py-20">
      {/* Soft background tint — light, unobtrusive */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.10), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* ── Left: message + actions ─────────────────────────────── */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs sm:text-sm font-bold text-orange-700 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Materials Procurement Exchange
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
              Stop chasing suppliers.
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-cyan-500 bg-clip-text text-transparent">
                Post once, get quotes in hours.
              </span>
            </h1>

            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-xl mt-6 font-medium">
              SaralBuy broadcasts your requirements to audited suppliers across Karnataka.
              <span className="block mt-2 font-bold text-slate-800">
                Anonymous sourcing &bull; Competitive pricing &bull; Zero spam
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto">
              <button
                onClick={handlePostRequirement}
                className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-base sm:text-lg px-8 py-4 rounded-xl cursor-pointer shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 w-full sm:w-auto"
              >
                Post a Requirement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleFindLeads}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-orange-500 text-slate-800 hover:text-orange-700 font-bold text-base sm:text-lg px-8 py-4 rounded-xl cursor-pointer active:scale-95 transition-all duration-300 w-full sm:w-auto"
              >
                I&apos;m a Supplier &mdash; Find Leads
              </button>
            </div>
          </div>

          {/* ── Right: category image carousel ──────────────────────── */}
          <div
            className="relative w-full max-w-xl mx-auto lg:max-w-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              {HERO_IMAGES.map((img, index) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.caption}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {/* Caption chip — bottom-left over a readability scrim */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-bold px-3.5 py-1.5 rounded-full shadow-md">
                {HERO_IMAGES[currentSlide].caption}
              </div>
            </div>

            {/* Dots — clickable, big enough to tap */}
            <div className="flex justify-center gap-2 mt-4">
              {HERO_IMAGES.map((img, index) => (
                <button
                  key={img.url}
                  type="button"
                  aria-label={`Show ${img.caption}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-7 bg-orange-600'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust anchors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 border-t border-slate-200 mt-12">
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
    <div className="flex items-center sm:items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-sm transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      <div className="text-left min-w-0">
        <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">{value}</div>
        <div className="text-sm text-slate-500 font-medium mt-1 leading-snug">{label}</div>
      </div>
    </div>
  );
}
