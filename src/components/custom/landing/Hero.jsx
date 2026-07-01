import { useState, useEffect } from 'react';
import { ArrowRight, Search, Zap, Users, ShieldCheck } from 'lucide-react';
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
 * Structure: pain-line + promise-line + search + universal CTAs + inline
 * trust anchors (numbers). No decorative fluff — every element is either a
 * conversion driver, a proof point, or an action.
 */
export default function Hero({ onOpenAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUserState();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const HERO_IMAGES = [
    { url: '/image/Category/building_materials.png', caption: 'Building Materials' },
    { url: '/image/Category/electrical_lights.png', caption: 'Electrical & Lighting' },
    { url: '/image/Category/plumbing_sanitary.png', caption: 'Plumbing & Sanitary' },
    { url: '/image/Category/tiles_flooring.png', caption: 'Tiles & Flooring' },
    { url: '/image/Category/paints_waterproofing.png', caption: 'Paints & Waterproofing' },
    { url: '/image/Category/plywood_hardware.png', caption: 'Plywood & Hardware' },
    { url: '/image/Category/safetyEquipment.png', caption: 'Safety Equipment' },
    { url: '/image/Category/industrial_tools.png', caption: 'Industrial Tools' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem('pending_rfq_product', searchQuery);
      localStorage.setItem('pending_rfq_qty', 'Bulk');
      onOpenAuth('buyer');
    }
  };

  const handlePostRequirement = () => {
    if (user) navigate('/requirement');
    else onOpenAuth('buyer');
  };

  const handleFindLeads = () => {
    if (user) navigate('/dashboard');
    else onOpenAuth('seller');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-orange-500/20">
      {/* Industrial grid + accent glow — restrained, weighty B2B feel */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.18), transparent 70%)' }} />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.10), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16 grid lg:grid-cols-12 gap-10 items-center">

        {/* Left: pain → promise → action */}
        <div className="lg:col-span-7 space-y-7">
          {/* Eyebrow — anchors the category with a specific proof */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-300 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            India&apos;s procurement exchange for construction materials
          </div>

          {/* Pain-line headline — the sentence a contractor would say out loud */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Stop chasing suppliers.
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              Post once, get quotes in hours.
            </span>
          </h1>

          {/* Promise-line — specific, universal, no filler */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Whether you&apos;re building a home, running a site, or fitting out an office &mdash;
            SaralBuy sends your requirement to verified suppliers across Karnataka.
            <span className="font-bold text-white"> One post. Multiple quotes. Anonymous until you choose.</span>
          </p>

          {/* Search — the primary conversion path */}
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="group flex items-center bg-white rounded-xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 focus-within:ring-4 focus-within:ring-orange-500/40 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What material are you looking for?"
                className="flex-1 px-3 py-4 text-sm focus:outline-none text-slate-900 placeholder-slate-400 bg-transparent"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-sm font-black px-6 py-4 cursor-pointer transition-all"
              >
                Get Quotes
              </button>
            </div>
            {/* Popular searches — real product names, keeps it tangible */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Popular:</span>
              {['OPC 53 Cement', 'TMT Steel', 'Vitrified Tiles', 'PVC Pipes', 'Wall Putty'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/40 text-slate-300 hover:text-orange-300 text-xs font-semibold rounded-full cursor-pointer transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Dual action — one primary, one alt-persona */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handlePostRequirement}
              className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 text-white font-black text-sm px-7 py-4 rounded-xl cursor-pointer transition-all"
            >
              Post a Requirement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleFindLeads}
              className="group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 active:scale-95 text-white font-bold text-sm px-7 py-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm"
            >
              I&apos;m a Supplier &mdash; Find Leads
            </button>
          </div>

          {/* Inline trust anchors — the payoff numbers below CTAs */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <TrustAnchor icon={Zap} value="4 hrs" label="Avg. first quote" />
            <TrustAnchor icon={Users} value="8+" label="Quotes per RFQ" />
            <TrustAnchor icon={ShieldCheck} value="GSTIN" label="Verified suppliers" />
          </div>
        </div>

        {/* Right: category carousel — kept, but now tighter and darker to fit */}
        <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 hidden lg:block">
          {HERO_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover"
                style={{ transform: index === currentSlide ? 'scale(1.04)' : 'scale(1)', transition: 'transform 4500ms ease-out' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 z-20 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded">
                  Live category
                </span>
                <p className="font-black text-xl text-white drop-shadow-lg">{img.caption}</p>
              </div>
            </div>
          ))}
          {/* Dots — subtle */}
          <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
            {HERO_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? 'bg-orange-400 w-6' : 'bg-white/50 hover:bg-white w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustAnchor({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-orange-300" />
      </div>
      <div>
        <div className="text-lg sm:text-xl font-black text-white leading-none">{value}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">{label}</div>
      </div>
    </div>
  );
}
