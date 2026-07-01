import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, HandMetal } from 'lucide-react';

/**
 * OnboardingTour — a compact spotlight walkthrough for a user's first Dashboard visit.
 *
 * Old version had six steps of corporate speak ("Karnataka's premier B2B
 * bulk procurement console", "real B2B trading volume", "regional
 * coordinates") and claimed the green pulse "indicates the platform is
 * actively facilitating deals" — nothing of the sort.
 *
 * Rewritten with four steps, each in plain English that tells the user
 * WHAT to do, not what things ARE. No "premier," no claims about live
 * trading volume, no jargon.
 */

const STEPS = [
  {
    title: "You're in.",
    description:
      "This is your workspace. Post a requirement to get quotes, or browse other people's RFQs to quote on. Skip this tour anytime.",
    selector: null,
  },
  {
    title: 'Search across categories',
    description:
      "The nav bar's category dropdown filters the whole site to one type of material — Cement, Steel, Tiles, etc. Useful when you know what you're sourcing.",
    selector: 'nav select',
  },
  {
    title: 'Your quotes and requirements live here',
    description:
      'The tabs below switch between the quotes you\'ve sent and the requirements you\'ve posted. New activity shows up here first.',
    selector: '[data-tour="sourcing-workspace"]',
  },
  {
    title: 'Chat sits in the corner',
    description:
      "When a supplier quotes on your RFQ (or vice versa), the chat bubble in the bottom-right lets you negotiate — files, dates, prices. Phone numbers stay hidden until a deal closes.",
    selector: '.floating-discussions-chatbox',
  },
];

const STORAGE_KEY = 'SaralBuy_onboarded_v2'; // v2 → users who saw the old tour get the new one once

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setIsOpen(true);
    const retake = () => { localStorage.removeItem(STORAGE_KEY); setStep(0); setIsOpen(true); };
    window.addEventListener('trigger-onboarding-tour', retake);
    return () => window.removeEventListener('trigger-onboarding-tour', retake);
  }, []);

  const highlight = (selector) => {
    document.querySelectorAll('.tour-spotlight').forEach(el => el.classList.remove('tour-spotlight'));
    if (!selector) return;
    const el = document.querySelector(selector);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('tour-spotlight'); }
  };

  const next = () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); highlight(STEPS[step + 1].selector); }
    else complete();
  };
  const back = () => { if (step > 0) { setStep(s => s - 1); highlight(STEPS[step - 1].selector); } };
  const complete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    document.querySelectorAll('.tour-spotlight').forEach(el => el.classList.remove('tour-spotlight'));
  };

  // Inject spotlight CSS once
  useEffect(() => {
    const id = 'tour-spotlight-css';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.innerHTML = `
      .tour-spotlight {
        position: relative !important;
        z-index: 10000 !important;
        box-shadow: 0 0 0 9999px rgba(15,23,42,0.7) !important;
        outline: 2px solid #f97316 !important;
        outline-offset: 4px !important;
        border-radius: 10px !important;
        transition: box-shadow 0.25s ease !important;
      }
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  if (!isOpen) return null;

  const current = STEPS[step];
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Dim background for the intro step (no spotlight yet) */}
      {!current.selector && <div className="absolute inset-0 bg-slate-950/70 pointer-events-auto" />}

      <div className="relative pointer-events-auto bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/10 max-w-md m-4 animate-fade-in overflow-hidden">
        <button
          onClick={complete}
          aria-label="Close tour"
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
              <HandMetal className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>

          <h4 className="text-xl font-black text-slate-900 leading-tight mb-2">{current.title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{current.description}</p>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          {step > 0 ? (
            <Button
              onClick={back}
              variant="outline"
              size="sm"
              className="text-xs font-bold border-slate-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <button
              onClick={complete}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline underline-offset-4"
            >
              Skip
            </button>
          )}
          <Button
            onClick={next}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
          >
            {step === STEPS.length - 1 ? 'Got it' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === step ? 'w-6 bg-orange-500' : 'w-1 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
