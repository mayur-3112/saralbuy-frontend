import React from 'react';

export default function Metrics() {
  return (
    <section className="border-y border-slate-200/80 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="border-r border-slate-100 last:border-0 md:border-r">
          <p className="text-3xl font-black text-orange-600 md:text-4xl">500+</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-bold tracking-wider">Verified Suppliers</p>
        </div>
        <div className="border-r border-slate-100 last:border-0 md:border-r">
          <p className="text-3xl font-black text-orange-600 md:text-4xl">₹12 Cr+</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-bold tracking-wider">Deals Facilitated</p>
        </div>
        <div className="border-r border-slate-100 last:border-0 md:border-r">
          <p className="text-3xl font-black text-orange-600 md:text-4xl">100%</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-bold tracking-wider">GST & PAN Vetted</p>
        </div>
        <div>
          <p className="text-3xl font-black text-orange-600 md:text-4xl">18+</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-bold tracking-wider">Industrial Sectors</p>
        </div>
      </div>
    </section>
  );
}
