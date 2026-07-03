import { useEffect, useState } from 'react';
import { X, ArrowRight, Building2, Truck, HardHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';

const STORAGE_KEY = 'sb_first_visit_seen_v1';

/**
 * FirstVisitWelcome — a soft, dismissible orientation card that appears once
 * per browser (localStorage-scoped) for new visitors.
 *
 * Not a lightbox that hijacks the page. Not an aggressive signup wall. Just
 * a "which door is yours?" choice, then either post an RFQ, browse leads,
 * or take the site tour. Users who already have an account never see it.
 *
 * Design principle: assume every visitor is 30 seconds from bouncing. Give
 * them one clear next step, not a menu.
 */
export default function FirstVisitWelcome({ onOpenAuth }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserState();

  useEffect(() => {
    if (user) return; // logged-in users never see this
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    // Small delay so it feels like a welcome, not a demand
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  const pickBuyer = () => {
    localStorage.setItem('auth_default_role', 'buyer');
    dismiss();
    onOpenAuth('buyer');
  };
  const pickSupplier = () => {
    localStorage.setItem('auth_default_role', 'seller');
    dismiss();
    onOpenAuth('seller');
  };
  const justBrowse = () => {
    dismiss();
    // No nav — user stays on the landing page they were exploring
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 mb-3">
            <HardHat className="w-4 h-4" />
            Welcome to SaralBuy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            What brings you here today?
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Pick a door — we&apos;ll tailor what you see next. You can change this anytime.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {/* Buyer path */}
            <button
              onClick={pickBuyer}
              className="group text-left p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-black text-slate-900">I need materials</div>
              <p className="text-sm text-slate-600 mt-1 leading-snug">
                Post a requirement in 90 seconds. Get quotes from multiple suppliers &mdash; anonymously.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-blue-600 font-bold text-sm">
                Post a requirement
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Supplier path */}
            <button
              onClick={pickSupplier}
              className="group text-left p-5 rounded-xl border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-slate-700" />
              </div>
              <div className="font-black text-slate-900">I supply materials</div>
              <p className="text-sm text-slate-600 mt-1 leading-snug">
                Browse live requirements. Quote in one click. Earn a Verified badge.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-slate-800 font-bold text-sm">
                Find sourcing leads
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <button
              onClick={justBrowse}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline underline-offset-4"
            >
              Just let me browse first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
