import { Link } from 'react-router-dom';
import SaralBuyLogo from '/footer-logo.png';

const CATEGORIES = [
  'Cement & Concrete',
  'Steel & Structural',
  'Tiles, Stones & Flooring',
  'Plumbing & Sanitary',
  'Electrical & Lighting',
  'Paints & Waterproofing',
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-blue-500/30 overflow-hidden">
      {/* Subtle bottom glowing orb matching the Hero section */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-20"
           style={{ background: 'radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.4), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 z-10">
        {/* Company block */}
        <div className="lg:col-span-5 space-y-5">
          <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <img src={SaralBuyLogo} alt="SaralBuy" className="h-14 w-auto drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]" />
          </Link>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md font-medium">
            SaralBuy connects buyers of construction materials with verified suppliers.
            Post a requirement, receive quotes from multiple suppliers, and stay anonymous
            until you choose one.
          </p>
          <div className="flex gap-4 pt-1">
            <div className="text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.15)]">
              🚀 Audited Suppliers
            </div>
            <div className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              🔒 100% Secure Sourcing
            </div>
          </div>
        </div>

        {/* Sourcing categories */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-400/90 mb-5">
            Sourcing Categories
          </h4>
          <ul className="space-y-3 font-semibold">
            {CATEGORIES.map(c => (
              <li key={c}>
                <Link
                  to="/product-listing"
                  className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company links */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-400/90 mb-5">
            Company
          </h4>
          <ul className="space-y-3 font-semibold">
            <li><Link to="/how-it-works" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">How it works</Link></li>
            <li><Link to="/about-us" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">About Us</Link></li>
            <li><Link to="/contact-us" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">Contact Us</Link></li>
            <li><Link to="/faq" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-400/90 mb-5">
            Legal
          </h4>
          <ul className="space-y-3 font-semibold">
            <li><Link to="/terms" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">Terms of Use</Link></li>
            <li><Link to="/privacy" className="text-sm text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 decoration-2 transition-all">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>© {year} SaralBuy. Serving builders, contractors & suppliers across Karnataka.</div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with 💙 for construction professionals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
