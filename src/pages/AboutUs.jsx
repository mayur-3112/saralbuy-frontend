import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MessageCircleWarning, Users } from 'lucide-react';

/**
 * AboutUs — three paragraphs that answer three questions: what SaralBuy does,
 * why it exists, and who it's for. No "leading platform," no "revolutionizing"
 * — just plain English.
 */
export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
            About SaralBuy
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Sourcing construction materials should be simple.
            <span className="block bg-gradient-to-r from-blue-300 to-amber-300 bg-clip-text text-transparent">
              We&apos;re building the tool for that.
            </span>
          </h1>
          <p className="text-slate-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            SaralBuy is a procurement exchange for construction materials in Karnataka.
            Post a requirement, get quotes from verified suppliers, choose the one that
            fits — anonymously until you commit.
          </p>
        </div>
      </section>

      {/* Body — three pillars */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <Pillar
            icon={MessageCircleWarning}
            eyebrow="The problem"
            title="Sourcing is broken by WhatsApp"
          >
            Every buyer sends the same requirement to 12 suppliers on WhatsApp. Half don&apos;t
            reply. The ones that do quote inconsistently — different units, different brands,
            no delivery date, no basis. Suppliers waste time on requests they&apos;ll never win.
            Buyers pick blind. Nobody enjoys any of it.
          </Pillar>

          <Pillar
            icon={ShieldCheck}
            eyebrow="What we do"
            title="One post reaches every relevant supplier"
          >
            When you post a requirement on SaralBuy, verified suppliers in that category
            see it and quote in a structured format — price, brand, delivery window,
            payment terms. You compare like-for-like. Chat with any of them inside the
            platform. Your contact details stay hidden until you choose one and commit.
          </Pillar>

          <Pillar
            icon={Users}
            eyebrow="Who it's for"
            title="Anyone with a real requirement"
          >
            Homeowners building a house. Contractors running a site. Interior teams
            fitting out an office. Small builders. Anyone whose day involves getting
            construction materials on time at a fair price. If you&apos;re sourcing, you fit.
          </Pillar>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The rest gets built as we go.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            SaralBuy is a small team based in Karnataka. If something on the platform doesn&apos;t
            work, tell us at{' '}
            <Link to="/contact-us" className="font-bold text-blue-700 hover:text-blue-800 underline underline-offset-4">
              contact
            </Link>
            . We read every message.
          </p>
          <Link
            to="/how-it-works"
            className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm px-6 py-3 rounded-xl transition-colors"
          >
            See how it works
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Pillar({ icon: Icon, eyebrow, title, children }) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
          {eyebrow}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
          {title}
        </h3>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}
