import React, { useState } from 'react';
import { ShieldAlert, BookOpen, Lock, Landmark, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TermsAndPrivacy() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Platform Legal & Policies
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          Please review the Terms of Service and Privacy Policy governing the SaralBuy procurement exchange.
        </p>
      </div>

      {/* Critical Zero Liability Warning Card */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4 mb-8 shadow-xs">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-full shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-amber-950 text-base">Important Zero Liability Disclaimer</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            SaralBuy is exclusively a B2B matching and reverse-bidding exchange platform. We do not participate in, control, verify, or assume any liability for the transactions, payments, material inspections, or delivery negotiations between buyers and suppliers. 
          </p>
          <p className="text-xs text-amber-950 font-bold leading-relaxed">
            If a buyer rejects materials, or if either party defaults on payments, delivery terms, or contracts, the platform bears absolutely no liability, responsibility, or financial obligation. All trades are conducted at the sole risk of the participants.
          </p>
        </div>
      </div>

      {/* Policy Tabs */}
      <Tabs defaultValue="terms" className="w-full space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="terms" className="cursor-pointer font-bold flex gap-2 justify-center items-center py-2.5">
            <BookOpen className="w-4 h-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="cursor-pointer font-bold flex gap-2 justify-center items-center py-2.5">
            <Lock className="w-4 h-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              1. Platform Nature and Matching
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SaralBuy provides a digital bulletin board and reverse-bidding exchange where buyers post procurement requirements, and suppliers offer pricing quotes. The platform does not buy, sell, warehouse, inspect, transport, or deliver any products.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              2. Absolute Liability Limit & Material Rejection
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Buyers must inspect and verify the materials upon arrival. If the buyer rejects the material due to quality, specifications mismatch, or any other reason, the dispute is strictly between the buyer and the seller. The platform holds no liability or responsibility for rejected materials, refunds, or replacement costs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              3. Verification of Identity & GST
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              While SaralBuy uses GSTIN and PAN verification tools to promote authenticity, users must perform their own due diligence before transferring funds or delivering materials. We do not warrant the creditworthiness, capacity, or performance of any user.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="privacy" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              1. Security of Business Documents
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Business verification documents such as GST and PAN registration papers are stored inside secure, access-controlled cloud storage. We do not collect Aadhaar or other sensitive national identity numbers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              2. Transactional and Chat Logging
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To resolve potential matching disputes, SaralBuy logs all reverse-bidding interactions, chat histories, delivery agreements, and quote budgets. Chat histories are private and only accessed for dispute mediation when requested by both parties.
            </p>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
