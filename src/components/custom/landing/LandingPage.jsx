import React from 'react';
import Hero from './Hero';
import B2BProductGrid from './B2BProductGrid';
import LiveSourcingBoard from './LiveSourcingBoard';
import HowItWorks from './HowItWorks';
import { Menu, ChevronRight } from 'lucide-react';

const SIDEBAR_CATEGORIES = [
  { name: 'Building & Structural Materials', sub: ['OPC 53 Cement', 'TMT Rebars', 'Bricks & AAC Blocks', 'Concrete'] },
  { name: 'Electrical & Lighting', sub: ['Cables & Wires', 'LED Panel Lights', 'Switches', 'Conduit Fittings'] },
  { name: 'Plumbing & Sanitaryware', sub: ['PVC Pipes', 'CPVC Fittings', 'Sanitary Taps', 'Valves'] },
  { name: 'Flooring, Tiles & Granite', sub: ['Vitrified Tiles', 'Sira Grey Granite', 'Marble Slabs', 'Adhesives'] },
  { name: 'Interior Finishing & Paints', sub: ['Exterior Emulsion', 'Wall Putty', 'Plywood', 'Hardware'] },
  { name: 'Safety Gear & Uniforms', sub: ['Safety Shoes', 'Boiler Suits', 'Safety Helmets', 'Gloves'] },
  { name: 'Industrial Tools & Pumps', sub: ['Impact Drills', 'Water Pumps', 'Generators', 'Hand Tools'] },
];

export default function LandingPage() {
  const triggerAuth = (roleType) => {
    localStorage.setItem('auth_default_role', roleType);
    window.dispatchEvent(new Event('session-expired'));
  };

  const handleCategoryClick = (catName) => {
    localStorage.setItem('pending_rfq_product', catName);
    localStorage.setItem('pending_rfq_qty', 'Bulk');
    triggerAuth('buyer');
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      
      {/* 1. Hero Section */}
      <Hero onOpenAuth={triggerAuth} />

      {/* 2. Main Directory Contents Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <main className="space-y-12">
          
          {/* Popular wholesale products directory */}
          <B2BProductGrid onOpenAuth={triggerAuth} />
          
          {/* Active Requirements Exchange Board Table */}
          <LiveSourcingBoard onOpenAuth={triggerAuth} />

        </main>
      </div>

      {/* 3. How It Works */}
      <HowItWorks onOpenAuth={triggerAuth} />

    </div>
  );
}
