import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle, Search, ClipboardList } from 'lucide-react';

export default function Hero({ onOpenAuth }) {
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save partial form details to local storage so the auth/signup flow can pre-fill them
    localStorage.setItem('pending_rfq_product', product);
    localStorage.setItem('pending_rfq_qty', qty);
    localStorage.setItem('pending_rfq_phone', phone);
    
    // Open the auth popup as buyer
    onOpenAuth('buyer');
  };

  return (
    <section className="bg-slate-100 text-slate-800 pt-16 pb-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Upper mini-banner */}
        <div className="bg-orange-600 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-md flex flex-wrap justify-between items-center gap-2 mb-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-white text-orange-600 text-[10px] uppercase font-black px-1.5 py-0.5 rounded">NEW</span>
            <span>Over 140+ verified cement, steel, and electrical suppliers in Karnataka are online today.</span>
          </div>
          <span className="underline cursor-pointer" onClick={() => onOpenAuth('seller')}>Register as Supplier &rarr;</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side Copy */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Get Wholesale Price Quotes Directly From Builders & Suppliers
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              SaralBuy is Karnataka's business directory for building materials, TMT steel, plumbing conduits, and electrical contract goods. Post what you need and local vetted suppliers will bid their lowest rates.
            </p>

            {/* Bullet Points */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                <span>0% Commission / Deal Directly</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                <span>GST Verified Regional Suppliers</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                <span>Real-Time Live Chat Negotiation</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                <span>Aadhaar & PAN Inspected Traders</span>
              </div>
            </div>

            {/* Quick Sourcing Tags */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase">Popular:</span>
              {['OPC 53 Cement', 'Fe 550 Steel', 'PVC Conduits', 'Vitrified Tiles', 'Granite Slabs'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setProduct(tag);
                    setQty('100');
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium rounded cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Classic RFQ Form */}
          <div className="lg:col-span-5 bg-white border border-slate-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
              <ClipboardList className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-black text-slate-900">Post Sourcing Requirement</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">What product do you need? *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Enter item name (e.g. TMT Steel, Cement)"
                    className="pl-9 w-full rounded border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Quantity / Units *</label>
                <input
                  type="text"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="e.g. 500 Bags, 10 Tons, 1200 Sq Ft"
                  className="w-full rounded border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number (For SMS Verification) *</label>
                <div className="flex">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l px-3 py-2 text-sm font-bold text-slate-600">+91</span>
                  <input
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="w-full rounded-r border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded text-sm transition-colors duration-150 shadow-md shadow-orange-600/10 cursor-pointer flex items-center justify-center gap-2"
              >
                Submit & Get Bids From Sellers <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                By submitting, you agree to verify your identity via OTP. Your mobile number remains secure.
              </p>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
