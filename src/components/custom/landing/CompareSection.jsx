import React from 'react';
import { X, Check } from 'lucide-react';

export default function CompareSection() {
  const comparisons = [
    {
      feature: 'Supplier Reach',
      traditional: 'Call individual vendors one-by-one',
      Quotex: 'Post once, reach dozens of verified sellers instantly',
      better: true,
    },
    {
      feature: 'Price Discovery',
      traditional: 'Negotiating manually (zero price comparison)',
      Quotex: 'Transparent bidding drives competitive prices down',
      better: true,
    },
    {
      feature: 'Chat & Coordination',
      traditional: 'Messy WhatsApp chats, emails, and phone calls',
      Quotex: 'Centralized live chat room for each order',
      better: true,
    },
    {
      feature: 'Vendor Safety',
      traditional: 'Risk of advance payment scams / unverified vendors',
      Quotex: 'Mandatory GSTIN and Aadhaar business vetting',
      better: true,
    },
    {
      feature: 'Intermediary Cost',
      traditional: 'Brokers charging 2% to 5% commission',
      Quotex: '0% commission. Deal directly with the supplier.',
      better: true,
    },
  ];

  return (
    <section className="bg-white text-slate-900 py-20 border-t border-slate-200/60 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 tracking-tight">
            Why Use Quotex Over Traditional Ways?
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Buying via bulk phone directories, middleman brokers, or random WhatsApp groups is slow, expensive, and risky. Here is how Quotex simplifies it.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden border border-slate-200/80 rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 font-bold text-slate-700 w-[25%] text-sm uppercase tracking-wider">Feature</th>
                  <th className="p-5 font-bold text-slate-400 w-[37.5%] text-sm uppercase tracking-wider">Brokers & WhatsApp</th>
                  <th className="p-5 font-bold text-orange-600 w-[37.5%] text-sm uppercase tracking-wider">The Quotex Way</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-5 font-semibold text-slate-800 text-sm">{row.feature}</td>
                    <td className="p-5 text-slate-500 text-sm">
                      <span className="flex items-center gap-2">
                        <X className="w-4.5 h-4.5 text-red-500 shrink-0" /> {row.traditional}
                      </span>
                    </td>
                    <td className="p-5 text-slate-900 font-medium text-sm">
                      <span className="flex items-center gap-2">
                        <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" /> {row.Quotex}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
