import { Link } from 'react-router-dom';
import SaralBuyLogo from '/footer-logo.png';

/**
 * Footer — descriptive, not superlative.
 *
 * Old version claimed "Karnataka's leading B2B bulk procurement platform,"
 * showed a placeholder phone number (98765 43210), and displayed PayPal +
 * Visa payment icons even though we don't process payments (deals happen
 * off-platform between buyer and supplier per product design).
 *
 * Rebuilt with: honest description, only-real links, no payment icons, no
 * social icons pointing nowhere, current year.
 */
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
    <footer className="bg-slate-950 text-slate-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Company block */}
        <div className="lg:col-span-5">
          <Link to="/" className="inline-block">
            <img src={SaralBuyLogo} alt="SaralBuy" className="h-14 w-auto" />
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mt-4 max-w-md">
            SaralBuy connects buyers of construction materials with verified suppliers.
            Post a requirement, receive quotes from multiple suppliers, and stay anonymous
            until you choose one.
          </p>
        </div>

        {/* Sourcing categories */}
        <div className="lg:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
            Sourcing categories
          </h4>
          <ul className="space-y-2">
            {CATEGORIES.map(c => (
              <li key={c}>
                <Link
                  to="/product-listing"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company links */}
        <div className="lg:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
            Company
          </h4>
          <ul className="space-y-2">
            <li><Link to="/how-it-works" className="text-sm text-slate-300 hover:text-white">How it works</Link></li>
            <li><Link to="/about-us" className="text-sm text-slate-300 hover:text-white">About</Link></li>
            <li><Link to="/contact-us" className="text-sm text-slate-300 hover:text-white">Contact</Link></li>
            <li><Link to="/faq" className="text-sm text-slate-300 hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="lg:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
            Legal
          </h4>
          <ul className="space-y-2">
            <li><Link to="/terms" className="text-sm text-slate-300 hover:text-white">Terms</Link></li>
            <li><Link to="/privacy" className="text-sm text-slate-300 hover:text-white">Privacy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© {year} SaralBuy. Serving buyers and suppliers across Karnataka.</div>
          <div>Made for the builders, contractors, and homeowners actually doing the work.</div>
        </div>
      </div>
    </footer>
  );
}
