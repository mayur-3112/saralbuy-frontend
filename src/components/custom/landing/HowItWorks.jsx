import { ArrowRight, MessageCircleWarning, Sparkles, Check, X } from 'lucide-react';

/**
 * HowItWorks — the closer. Frames SaralBuy as the specific fix for a
 * specific pain, not another generic 3-step SaaS explainer.
 *
 * Before/After structure lands harder than a numbered list. Left column
 * shows what sourcing looks like today (chaos everyone recognizes); right
 * column shows what SaralBuy does with the same request. No stock photos,
 * no metrics — just two side-by-side realities.
 */

const OLD_WAY = [
  '12 different WhatsApp forwards',
  '4 suppliers ignore you',
  '2 quote by voice call, no record',
  '1 sends a PDF with different units',
  'You still have no idea what fair price is',
];

const NEW_WAY = [
  'One post, one form',
  'Reaches every supplier in that category',
  'Quotes arrive structured, comparable',
  'Chat inside the platform, files stay',
  'Compare like-for-like. Pick with confidence.',
];

export default function HowItWorks({ onOpenAuth }) {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 mb-2">
            The difference
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Sourcing materials, before and after.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            No jargon, no salesy fluff. Here&apos;s what actually changes.
          </p>
        </div>

        {/* Before / After split */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* BEFORE — the pain */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <MessageCircleWarning className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  The old way
                </div>
                <div className="font-black text-slate-800 text-lg leading-tight">
                  WhatsApp roulette
                </div>
              </div>
            </div>
            <ul className="space-y-3">
              {OLD_WAY.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <X className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER — the fix */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-900 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(59, 130, 246,0.25), transparent 70%)' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-300" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-300">
                    With SaralBuy
                  </div>
                  <div className="font-black text-white text-lg leading-tight">
                    One post. Structured quotes.
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {NEW_WAY.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" strokeWidth={3} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onOpenAuth('buyer')}
                className="mt-6 group inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-black text-sm px-5 py-3 rounded-lg transition-all"
              >
                Post your first requirement
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
