import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenAuth }) {
  const steps = [
    {
      num: '01',
      title: 'Post Your Project Need',
      desc: 'Fill in what materials your project needs (e.g. cement, TMT steel, plumbing conduits), quantities required, and upload drawings or specs in 60 seconds.',
    },
    {
      num: '02',
      title: 'Get Competitive Bids',
      desc: 'Our network of verified, GST-registered suppliers review your request and submit direct, competitive price Bids.',
    },
    {
      num: '03',
      title: 'Negotiate Live',
      desc: 'Chat directly with bidding suppliers in real-time. Discuss delivery schedules, credit terms, unloading, or bulk discounts.',
    },
    {
      num: '04',
      title: 'Pay Direct (0% Fee)',
      desc: 'Approve the best bid, issue your purchase order, and pay the supplier directly. No commissions, no middleman markups.',
    },
  ];

  return (
    <section className="bg-slate-50 text-slate-900 py-20 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 tracking-tight">
            How SaralBuy Works
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Sourcing bulk project materials has never been this simple, transparent, and direct.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div 
              key={index} 
              className="p-6 bg-white border border-slate-200/80 rounded-2xl relative group hover:border-orange-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-orange-600/10 group-hover:text-orange-600/25 transition-colors duration-300 absolute top-4 right-4">
                  {item.num}
                </span>
                <h3 className="text-lg font-bold mt-4 text-slate-900 group-hover:text-orange-600 transition-colors duration-200">{item.title}</h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Action Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => onOpenAuth('buyer')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-lg text-sm transition-colors cursor-pointer"
          >
            Start Your First Post <ArrowRight className="w-4 h-4 text-orange-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
