import React from 'react';
import { Gavel, ShieldCheck } from 'lucide-react';

const WHOLESALE_PRODUCTS = [
  {
    id: 'p1',
    title: 'UltraTech Cement (OPC 53 Grade)',
    price: '₹370 - ₹395 / Bag',
    moq: '150 Bags',
    category: 'Building Materials',
    image: '/image/Category/industrialImage.png',
    specs: 'Standard 50kg bag, fresh factory stock, suitable for high-strength concrete.',
  },
  {
    id: 'p2',
    title: 'Tata Tiscon Fe 550 TMT Steel Bars',
    price: '₹61,000 - ₹64,000 / Ton',
    moq: '5 Tons',
    category: 'Building Materials',
    image: '/image/Category/industrialImage.png',
    specs: 'Standard 12m length, available in 8mm, 10mm, 12mm, and 16mm.',
  },
  {
    id: 'p3',
    title: 'Supreme PVC Conduit Pipes (20mm)',
    price: '₹42 - ₹48 / Meter',
    moq: '500 Meters',
    category: 'Plumbing & Fittings',
    image: '/image/Category/industrialImage.png',
    specs: 'Heavy duty, FRLS (Fire Retardant Low Smoke), grey color with couplers.',
  },
  {
    id: 'p4',
    title: 'Kajaria Vitrified Floor Tiles (2x2 ft)',
    price: '₹40 - ₹45 / Sq Ft',
    moq: '1,000 Sq Ft',
    category: 'Finishing & Interior',
    image: '/image/Category/sportsImage.png',
    specs: 'Double charge, ivory gloss finish, scratch-resistant commercial grade.',
  },
  {
    id: 'p5',
    title: 'Asian Paints Apex Ultima Exterior Paint',
    price: '₹5,200 - ₹5,500 / 20L Bucket',
    moq: '10 Buckets',
    category: 'Finishing & Interior',
    image: '/image/Category/beautyImage.png',
    specs: 'Premium water-based exterior emulsion, weather-proof warranty.',
  },
  {
    id: 'p6',
    title: 'Polished Sira Grey Granite Slabs (18mm)',
    price: '₹105 - ₹120 / Sq Ft',
    moq: '2,000 Sq Ft',
    category: 'Finishing & Interior',
    image: '/image/Category/furnitureImage.png',
    specs: 'Double polished, uniform grain and thickness, direct from quarries.',
  },
  {
    id: 'p7',
    title: 'Allen Cooper Double Density Safety Shoes',
    price: '₹820 - ₹890 / Pair',
    moq: '50 Pairs',
    category: 'Safety Gear',
    image: '/image/Category/fashionImage.png',
    specs: 'Steel toe cap, oil and chemical resistant, ISI certified safety footwear.',
  },
  {
    id: 'p8',
    title: 'Bosch GSB 13 RE Professional Impact Drill',
    price: '₹3,150 - ₹3,350 / Unit',
    moq: '5 Units',
    category: 'Tools & Machinery',
    image: '/image/Category/homeAppliancesImage.png',
    specs: '600W power input, reverse/forward rotation, robust plastic carry case.',
  },
];

export default function B2BProductGrid({ onOpenAuth }) {
  const handleGetQuotes = (productTitle) => {
    localStorage.setItem('pending_rfq_product', productTitle);
    localStorage.setItem('pending_rfq_qty', 'Bulk');
    onOpenAuth('buyer');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          📦 Popular Bulk wholesale Products
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Direct factory prices. Submit RFQs to get customized bids.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {WHOLESALE_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-slate-200 hover:border-orange-300 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow transition-all"
          >
            {/* Info */}
            <div className="space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {prod.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-950 line-clamp-2 mt-0.5 leading-snug">
                  {prod.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-1 line-clamp-2">
                  {prod.specs}
                </p>
              </div>

              {/* Price & MOQ */}
              <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Estimated Price</div>
                <div className="font-black text-orange-600 text-sm">{prod.price}</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">MOQ: {prod.moq}</div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => handleGetQuotes(prod.title)}
              className="w-full mt-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded border border-orange-600 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Gavel className="w-3.5 h-3.5" /> Get Best Price
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
