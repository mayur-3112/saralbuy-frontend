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
      title: 'Get Competitive Quotes',
      desc: 'Our network of verified, GST-registered suppliers review your request and submit direct, competitive price quotes.',
    },
    {
      num: '03',
      title: 'Negotiate Live',
      desc: 'Chat directly with bidding suppliers in real-time. Discuss delivery schedules, credit terms, unloading, or bulk discounts.',
    },
    {
      num: '04',
      title: 'Pay Direct (Early Access)',
      desc: 'Approve the best quote, issue your purchase order, and pay the supplier directly. Currently no commissions during early access.',
    },
  ];

  return (
    <section className="bg-slate-50/70 text-slate-900 py-20 border-t border-slate-200/50 relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-radial from-orange-200/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 tracking-tight">
            How Quotex Works
          </h2>
          <div className="w-12 h-1 bg-orange-550 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-base sm:text-lg">
            Sourcing bulk project materials has never been this simple, transparent, and direct.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div 
              key={index} 
              className="p-6 bg-white border border-orange-100/60 rounded-2xl relative group hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between overflow-hidden"
            >
              {/* Sliding top accent line */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

              <div>
                <span className="text-4xl font-black text-orange-500/10 group-hover:text-orange-500/25 group-hover:scale-110 transition-all duration-300 absolute top-4 right-4 select-none">
                  {item.num}
                </span>
                <h3 className="text-lg font-bold mt-4 text-slate-900 group-hover:text-orange-600 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => onOpenAuth('buyer')}
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-orange-50/50 hover:border-orange-300 border border-slate-200 active:scale-95 text-slate-800 hover:text-orange-700 font-bold rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
          >
            Start Your First Post 
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
