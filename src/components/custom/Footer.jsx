import { Link } from 'react-router-dom';
import SaralBuyLogo from '/image/Logo/navbarLogo.png';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">
        {/* Company block */}
        <div className="lg:col-span-6 space-y-5">
          <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <img
              src={SaralBuyLogo}
              alt="SaralBuy"
              className="h-20 w-auto object-contain mix-blend-darken -ml-4"
            />
          </Link>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md font-medium">
            SaralBuy connects buyers of construction materials with verified suppliers.
            Post a requirement, receive quotes from multiple suppliers, and stay anonymous
            until you choose one.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <div className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
              🚀 Trusted Suppliers
            </div>
            <div className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3.5 py-1.5 rounded-full">
              🔒 100% Secure Sourcing
            </div>
          </div>
        </div>

        {/* Company links */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-5">
            Company
          </h4>
          <ul className="space-y-3 font-semibold">
            <li><Link to="/how-it-works" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">How it works</Link></li>
            <li><Link to="/about-us" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">About Us</Link></li>
            <li><Link to="/contact-us" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">Contact Us</Link></li>
            <li><Link to="/faq" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-5">
            Legal
          </h4>
          <ul className="space-y-3 font-semibold">
            <li><Link to="/terms" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">Terms of Use</Link></li>
            <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>© {year} SaralBuy. Serving builders, contractors & suppliers across Karnataka.</div>
          <div className="flex items-center gap-1">
            <span>Made with 💙 for construction professionals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
