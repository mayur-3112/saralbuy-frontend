import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * FAQ — real answers to real questions, not "standard B2B platform Q&A."
 *
 * Every question below is one an actual buyer or supplier has asked (or
 * will ask on day one). Grouped by section so the page scans fast. Kept
 * to ~10 questions — anything longer is documentation, not FAQ.
 */

const FAQS = [
  {
    section: 'Basics',
    items: [
      {
        q: 'What does SaralBuy do?',
        a: 'You post what you need. Verified suppliers in that category quote. You compare all quotes side-by-side and chat with any supplier before deciding. Your contact details stay hidden until you commit to a deal.',
      },
      {
        q: 'What does it cost?',
        a: 'Nothing to post a requirement. Nothing to receive quotes. Nothing to chat. Payment happens directly between you and the supplier — SaralBuy does not process payments or take a cut on early access.',
      },
      {
        q: 'What kinds of materials can I source?',
        a: 'Cement, steel, tiles, plumbing, electrical, paints, plywood, glass, tools, and roughly a hundred subcategories underneath. If you\'re building or renovating something in Karnataka, we probably have suppliers in that space.',
      },
    ],
  },
  {
    section: 'For buyers',
    items: [
      {
        q: 'How long until I get my first quote?',
        a: 'Most first quotes arrive within a few hours during business hours. Complete quotes for a mid-sized order usually take a working day. Complex or brand-specific requirements can take longer.',
      },
      {
        q: 'Can suppliers see my phone or address?',
        a: 'No. Suppliers see your material requirement, quantity, and an approximate area (like the city). Full name, phone, and address are only shared with the specific supplier you choose to proceed with.',
      },
      {
        q: 'Do I have to accept any of the quotes?',
        a: 'No. If none of them fit, ignore all of them. Your requirement expires; no obligation.',
      },
    ],
  },
  {
    section: 'For suppliers',
    items: [
      {
        q: 'How do I become a Verified Supplier?',
        a: 'Add your GSTIN (and optionally PAN + business docs) in your Account Settings and submit for verification. Our team reviews within one business day. Once approved, the green "Verified" badge appears next to your quotes — buyers strongly prefer verified suppliers.',
      },
      {
        q: 'How do I find requirements to quote on?',
        a: 'Browse the live board on the homepage or your dashboard. Filter by category, location, or keyword. Every RFQ has a "Quote Now" button that opens the structured quote form.',
      },
      {
        q: 'What happens when a buyer accepts my quote?',
        a: 'Both of you get each other\'s contact details, and the deal moves off-platform to complete. You then coordinate delivery, payment, and paperwork directly. SaralBuy records the deal for review counts but does not stand between you.',
      },
    ],
  },
];

export default function FAQ() {
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState(null);

  const filtered = FAQS.map(g => ({
    ...g,
    items: g.items.filter(it =>
      !query ||
      it.q.toLowerCase().includes(query.toLowerCase()) ||
      it.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
            FAQ
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            The questions we hear most.
          </h1>
          <p className="text-slate-300 mt-3 text-sm sm:text-base">
            Can&apos;t find your answer?{' '}
            <Link to="/contact-us" className="text-blue-300 hover:text-blue-200 font-bold underline underline-offset-4">
              Ask us directly
            </Link>
            .
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs (e.g. 'phone number', 'GSTIN')"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-bold">No FAQs match that.</p>
              <Link to="/contact-us" className="mt-3 inline-block font-bold text-blue-700 hover:text-blue-800 underline underline-offset-4">
                Ask us directly →
              </Link>
            </div>
          ) : (
            filtered.map(group => (
              <div key={group.section}>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
                  {group.section}
                </div>
                <div className="space-y-2">
                  {group.items.map((it, i) => {
                    const key = `${group.section}-${i}`;
                    const open = openKey === key;
                    return (
                      <div key={key} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenKey(open ? null : key)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                        >
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">{it.q}</h3>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {open && (
                          <div className="px-5 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                            {it.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
