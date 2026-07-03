import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, LayoutTemplate, ShieldCheck, Search, Download, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerTools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('benchmarker');
  const [gstinSearch, setGstinSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const MOCK_PRICES = {
    'cement': { min: 380, max: 420, unit: 'Bag', trend: '+1.2%', date: 'Today' },
    'tmt-steel': { min: 61000, max: 64000, unit: 'MT', trend: '-0.5%', date: 'Today' },
    'tiles': { min: 38, max: 55, unit: 'Sq.Ft', trend: 'Stable', date: 'Yesterday' }
  };

  const handleVerify = () => {
    if (gstinSearch.length < 5) return;
    setSearchResult({
      name: 'MOCK ENTERPRISES LTD',
      status: 'Active',
      type: 'Regular',
      verifiedDate: '24-Jun-2026',
      saralScore: '92/100'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buyer Tools</h1>
          <p className="text-slate-500 mt-2 text-lg">Smart procurement utilities to help you source efficiently.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-lg p-1 border shadow-sm w-full md:w-fit">
          <button
            onClick={() => setActiveTab('benchmarker')}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'benchmarker' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp className="w-4 h-4" /> Cost Benchmarker
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'templates' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Requirement Templates
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'trust' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Trust Checker
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="md:col-span-2">
            
            {activeTab === 'benchmarker' && (
              <Card className="p-6 border-slate-200 shadow-sm bg-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Live Material Cost Benchmarks</h2>
                  <p className="text-sm text-slate-500 mt-1">Check average market rates before posting your requirement to ensure competitive bidding.</p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(MOCK_PRICES).map(([key, data]) => (
                    <div key={key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <div>
                        <h3 className="font-semibold text-slate-800 capitalize">{key.replace('-', ' ')}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Updated: {data.date}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 text-right w-full sm:w-auto">
                        <div className="text-lg font-bold text-slate-900">₹{data.min} - ₹{data.max} <span className="text-sm font-normal text-slate-500">/ {data.unit}</span></div>
                        <div className={`text-xs font-semibold ${data.trend.includes('+') ? 'text-red-500' : data.trend.includes('-') ? 'text-emerald-500' : 'text-slate-400'}`}>
                          Trend: {data.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'templates' && (
              <Card className="p-6 border-slate-200 shadow-sm bg-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">1-Click Requirement Templates</h2>
                  <p className="text-sm text-slate-500 mt-1">Pre-filled specifications for common materials. Just review quantities and post.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-5 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer" onClick={() => navigate('/post-requirement')}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                      <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800">Commercial Foundation Setup</h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">Includes TMT Steel (various mm), OPC 53 Cement, and aggregate templates.</p>
                    <div className="mt-4 text-sm font-semibold text-blue-600 flex items-center gap-1">Use Template <Calculator className="w-4 h-4" /></div>
                  </div>
                  
                  <div className="border border-slate-200 p-5 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer" onClick={() => navigate('/post-requirement')}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                      <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800">Electrical Wiring Bundle</h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">FRLS wires, PVC conduits, modular switches, and standard DB boards.</p>
                    <div className="mt-4 text-sm font-semibold text-blue-600 flex items-center gap-1">Use Template <Calculator className="w-4 h-4" /></div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'trust' && (
              <Card className="p-6 border-slate-200 shadow-sm bg-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Supplier Trust Checker</h2>
                  <p className="text-sm text-slate-500 mt-1">Enter a GSTIN to verify a supplier's business registration and platform trust score.</p>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Input 
                    placeholder="Enter 15-digit GSTIN (e.g. 29ABCDE1234F1Z5)" 
                    value={gstinSearch}
                    onChange={(e) => setGstinSearch(e.target.value.toUpperCase())}
                    className="max-w-md uppercase"
                  />
                  <Button onClick={handleVerify} className="bg-slate-900 hover:bg-slate-800 text-white flex gap-2">
                    <Search className="w-4 h-4" /> Verify
                  </Button>
                </div>

                {searchResult && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-4">
                      <CheckCircle className="w-5 h-5" /> Valid GSTIN Found
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <div className="text-emerald-600/70 text-xs uppercase font-semibold mb-1">Legal Name</div>
                        <div className="font-semibold text-slate-800">{searchResult.name}</div>
                      </div>
                      <div>
                        <div className="text-emerald-600/70 text-xs uppercase font-semibold mb-1">Status</div>
                        <div className="font-semibold text-slate-800">{searchResult.status}</div>
                      </div>
                      <div>
                        <div className="text-emerald-600/70 text-xs uppercase font-semibold mb-1">Taxpayer Type</div>
                        <div className="font-semibold text-slate-800">{searchResult.type}</div>
                      </div>
                      <div>
                        <div className="text-emerald-600/70 text-xs uppercase font-semibold mb-1">SaralBuy Score</div>
                        <div className="font-semibold text-blue-600 text-lg">{searchResult.saralScore}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-5 border-blue-100 bg-blue-50/50 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-blue-600" /> Procurement Guide
              </h3>
              <p className="text-sm text-slate-600 mb-4">Download our free 2026 market analysis report for the construction sector.</p>
              <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50">Download PDF</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerTools;
