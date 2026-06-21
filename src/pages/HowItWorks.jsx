import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Truck } from 'lucide-react';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-100/20 border-b border-orange-100/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial from-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 py-20 sm:py-32 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
            How <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">SaralBuy</span> Works
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            Choose your role to see a step-by-step guide tailored to you.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Buyer Card */}
            <div
              onClick={() => navigate('/how-it-works/buyers')}
              className="group bg-white border border-orange-200 hover:border-orange-400 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
              style={{ background: 'linear-gradient(135deg, #ffffff 60%, #fff7ed 100%)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">I'm a Buyer</h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Contractor, builder, or project manager looking to source bulk materials at wholesale prices.
              </p>
              <span className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all duration-200">
                Learn how to source
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            {/* Supplier Card */}
            <div
              onClick={() => navigate('/how-it-works/suppliers')}
              className="group bg-white border border-blue-200 hover:border-blue-400 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
              style={{ background: 'linear-gradient(135deg, #ffffff 60%, #eff6ff 100%)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">I'm a Supplier</h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Manufacturer, distributor, or dealer looking to win direct orders from verified contractors.
              </p>
              <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all duration-200">
                Learn how to sell
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
