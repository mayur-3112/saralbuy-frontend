import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Gavel } from 'lucide-react';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

export default function Hero({ onOpenAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUserState();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const HERO_IMAGES = [
    { url: '/image/Category/building_materials.png', caption: 'Building & Structural Materials' },
    { url: '/image/Category/electrical_lights.png', caption: 'Electrical & Lighting Products' },
    { url: '/image/Category/plumbing_sanitary.png', caption: 'Plumbing & Sanitaryware' },
    { url: '/image/Category/tiles_flooring.png', caption: 'Flooring, Tiles & Granite' },
    { url: '/image/Category/paints_waterproofing.png', caption: 'Interior Finishing & Paints' },
    { url: '/image/Category/plywood_hardware.png', caption: 'Plywood & Hardware' },
    { url: '/image/Category/safetyEquipment.png', caption: 'Safety Gear & Uniforms' },
    { url: '/image/Category/industrial_tools.png', caption: 'Industrial Tools & Pumps' }
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
      // Save search as a pending RFQ product
      localStorage.setItem('pending_rfq_product', searchQuery);
      localStorage.setItem('pending_rfq_qty', 'Bulk');
      onOpenAuth('buyer');
    }
  };

  const handlePostRequirement = () => {
    if (user) {
      navigate('/requirement');
    } else {
      onOpenAuth('buyer');
    }
  };

  const handleFindLeads = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onOpenAuth('seller');
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-100/20 border-b border-orange-100/60 relative overflow-hidden">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial from-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-radial from-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Headline, Search & CTAs */}
        <div className="lg:col-span-7 text-left space-y-8">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Get Wholesale Price Quotes & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Direct Sourcing Leads in Karnataka</span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            SaralBuy is the leading B2B exchange connecting contractors and builders with verified materials suppliers. Post bulk requirements to get quotes, or browse live requests to submit bids.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, e.g. TMT Steel, Cement, PVC Pipes..."
                className="flex-1 px-3 py-4 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-sm font-bold px-6 py-4 cursor-pointer transition-all duration-200 shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Popular:</span>
            {['OPC 53 Cement', 'Fe 550 Steel', 'PVC Conduits', 'Vitrified Tiles', 'Granite Slabs'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:-translate-y-0.5 hover:shadow-sm text-slate-600 text-xs font-semibold rounded-full cursor-pointer transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Dual CTAs for Buyer and Seller */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={handlePostRequirement}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-95 text-white font-bold text-sm px-7 py-4 rounded-xl cursor-pointer transition-all duration-200"
            >
              Post a Requirement (For Buyers)
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={handleFindLeads}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50/50 border border-orange-200 hover:border-orange-400 hover:shadow-md active:scale-95 text-slate-800 hover:text-orange-700 font-bold text-sm px-7 py-4 rounded-xl cursor-pointer transition-all duration-200"
            >
              Find Sourcing Leads (For Sellers)
              <Gavel className="w-4 h-4 text-orange-500 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Right Column: Auto-playing Image Carousel Banner */}
        <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-orange-100/50 hidden lg:block bg-slate-100">
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
                className="w-full h-full object-cover transition-transform duration-[4500ms] ease-out scale-100 group-hover:scale-105"
                style={{ transform: index === currentSlide ? 'scale(1.03)' : 'scale(1)' }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
              
              {/* Floating Tag */}
              <div className="absolute bottom-6 left-6 text-white z-20 space-y-1 text-left">
                <span className="text-[9px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-md">
                  SaralBuy Wholesale
                </span>
                <p className="font-extrabold text-lg drop-shadow-md">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
            {HERO_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? 'bg-orange-500 w-4.5' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
