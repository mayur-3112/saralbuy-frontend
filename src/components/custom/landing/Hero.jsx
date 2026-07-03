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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-blue-500/20">
      {/* Industrial grid + accent glow — restrained, weighty B2B feel */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246,0.18), transparent 70%)' }} />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246,0.10), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16 grid grid-cols-1 gap-10 items-center justify-center">

        {/* Center/Full-Width: pain → promise → action */}
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-7 text-center flex flex-col items-center">
          {/* Eyebrow — bigger and clearer for older / non-tech eyes */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-500/15 px-4 py-1.5 text-sm font-bold text-blue-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            Procurement exchange for construction materials
          </div>

          {/* Pain-line headline — the sentence a contractor would say out loud */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Stop chasing suppliers.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              Post once, get quotes in hours.
            </span>
          </h1>

          {/* Promise-line — larger body text for readability */}
          <p className="text-slate-200 text-lg sm:text-xl leading-relaxed max-w-2xl text-center">
            Whether you&apos;re building a home, running a site, or fitting out an office &mdash;
            SaralBuy sends your requirement to verified suppliers across Karnataka.
            <span className="font-bold text-white block mt-2"> One post. Multiple quotes. Anonymous until you choose.</span>
          </p>

          {/* Search — bigger input, bigger button, ready for real fingers */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mt-2">
            <div className="group flex items-center bg-white rounded-xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 focus-within:ring-4 focus-within:ring-blue-500/40 transition-all">
              <Search className="w-6 h-6 text-slate-500 ml-5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What material are you looking for?"
                className="flex-1 px-3 py-5 text-base focus:outline-none text-slate-900 placeholder-slate-500 bg-transparent"
              />
              <button
                type="submit"
                className="sb-big-tap bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-base font-black px-6 sm:px-7 cursor-pointer transition-all"
              >
                Get Quotes
              </button>
            </div>
            {/* Popular searches — bigger label so it's actually noticed */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-slate-300 font-bold">Popular:</span>
              {['OPC 53 Cement', 'TMT Steel', 'Vitrified Tiles', 'PVC Pipes', 'Wall Putty'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-blue-400/60 text-slate-100 hover:text-blue-200 text-sm font-semibold rounded-full cursor-pointer transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Dual action — both buttons big + readable + always labelled */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center w-full sm:w-auto">
            <button
              onClick={handlePostRequirement}
              className="sb-big-tap group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 text-white font-black text-base px-8 py-4 rounded-xl cursor-pointer transition-all w-full sm:w-auto"
            >
              Post a Requirement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleFindLeads}
              className="sb-big-tap group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 hover:border-white/50 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm w-full sm:w-auto"
            >
              I&apos;m a Supplier &mdash; Find Leads
            </button>
          </div>

          {/* Process truths — three sentences about HOW SaralBuy works, not
              stats. These are always true regardless of user count or
              deal volume; the actual metrics live in ProofStrip below and
              self-hide when they'd be zero. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full mt-6">
            <TrustAnchor icon={Zap} value="One post" label="Reaches every supplier in your category" />
            <TrustAnchor icon={Users} value="Anonymous" label="Your details stay hidden until you choose" />
            <TrustAnchor icon={ShieldCheck} value="Reviewed" label="Every supplier vetted by our team" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustAnchor({ icon: Icon, value, label }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-blue-300" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-white leading-tight">{value}</div>
        <div className="text-sm text-slate-300 font-medium mt-1 leading-snug">{label}</div>
      </div>
    </div>
  );
}
