import React, { useState } from 'react';
import { Calculator, IndianRupee, TrendingUp, TrendingDown, ArrowRight, Settings2, LayoutDashboard, Truck, Users, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupplierTools() {
  const navigate = useNavigate();
  
  // Form state
  const [sellingPrice, setSellingPrice] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [transportCost, setTransportCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [otherCosts, setOtherCosts] = useState('');

  // Calculations
  const revenue = parseFloat(sellingPrice) || 0;
  const costOfGoods = parseFloat(materialCost) || 0;
  const additionalCosts = (parseFloat(transportCost) || 0) + (parseFloat(laborCost) || 0) + (parseFloat(otherCosts) || 0);
  
  const totalCost = costOfGoods + additionalCosts;
  const grossProfit = revenue - costOfGoods;
  const netProfit = revenue - totalCost;
  
  const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0.0';
  const netMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '0.0';
  
  const isProfitable = netProfit >= 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-orange-100/40 to-transparent rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Calculator className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Supplier Tools</h1>
              </div>
              <p className="text-slate-500 max-w-lg">Calculate your margins instantly before placing a quote to ensure your bids remain profitable.</p>
            </div>
            <button 
              onClick={() => navigate('/product-listing')}
              className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Browse Live Leads
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Profit Calculator</h2>
              <button 
                onClick={() => {
                  setSellingPrice('');
                  setMaterialCost('');
                  setTransportCost('');
                  setLaborCost('');
                  setOtherCosts('');
                }}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-6">
              {/* Revenue */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-500" />
                  Estimated Selling Price (Total Quote)
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-emerald-500 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Direct Costs */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-orange-500" />
                  Material / Purchase Cost
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-orange-500 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                    placeholder="e.g. 35000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Additional Costs Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Logistics / Delivery
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm group-focus-within:text-orange-500 transition-colors">₹</span>
                    <input 
                      type="number"
                      value={transportCost}
                      onChange={(e) => setTransportCost(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Labor / Loading
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm group-focus-within:text-orange-500 transition-colors">₹</span>
                    <input 
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    Other Miscellaneous Costs
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm group-focus-within:text-orange-500 transition-colors">₹</span>
                    <input 
                      type="number"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-slate-400" />
                Projection Results
              </h2>

              <div className="space-y-6 flex-1">
                {/* Net Profit Big Box */}
                <div className={`p-6 rounded-xl border ${isProfitable ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300">Net Profit</span>
                    {isProfitable ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">
                        <TrendingUp className="w-3 h-3" /> Profitable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded">
                        <TrendingDown className="w-3 h-3" /> Loss
                      </span>
                    )}
                  </div>
                  <div className={`text-4xl sm:text-5xl font-black tracking-tight ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{Math.abs(netProfit).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">
                    Margin: <span className="font-bold text-white">{netMargin}%</span>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="bg-slate-800/50 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400 font-medium">Gross Profit (Before Ops)</span>
                    <span className="text-sm text-white font-bold">₹{grossProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400 font-medium">Gross Margin</span>
                    <span className="text-sm text-white font-bold">{grossMargin}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 font-medium">Total Cost Overlay</span>
                    <span className="text-sm text-red-300 font-bold">- ₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
