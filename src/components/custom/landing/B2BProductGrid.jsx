import React from 'react';
import { Gavel } from 'lucide-react';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    title: 'Building & Structural',
    image: '/image/Category/building_materials.png',
    desc: 'Cement, TMT Steel, Bricks, AAC Blocks, Concrete',
  },
  {
    title: 'Electrical & Lighting',
    image: '/image/Category/electrical_lights.png',
    desc: 'Wires, LED Lights, Switches, Conduit Pipes',
  },
  {
    title: 'Plumbing & Sanitaryware',
    image: '/image/Category/plumbing_sanitary.png',
    desc: 'PVC Pipes, CPVC Fittings, Taps, Valves',
  },
  {
    title: 'Flooring, Tiles & Granite',
    image: '/image/Category/tiles_flooring.png',
    desc: 'Vitrified Tiles, Sira Grey Granite, Marble Slabs',
  },
  {
    title: 'Interior & Paints',
    image: '/image/Category/paints_waterproofing.png',
    desc: 'Exterior Emulsion, Wall Putty, Hardware, Laminates',
  },
  {
    title: 'Plywood & Hardware',
    image: '/image/Category/plywood_hardware.png',
    desc: 'MDF Boards, Plywood, Cabinet Hinges, Screws',
  },
  {
    title: 'Safety Gear & Uniforms',
    image: '/image/Category/safetyEquipment.png',
    desc: 'Safety Shoes, Helmets, Boiler Suits, Gloves',
  },
  {
    title: 'Industrial Tools & Pumps',
    image: '/image/Category/industrial_tools.png',
    desc: 'Impact Drills, Water Pumps, Generators, Hand Tools',
  }
];

export default function B2BProductGrid({ onOpenAuth }) {
  const { user } = useUserState();
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    localStorage.setItem('pending_rfq_product', cat.title);
    localStorage.setItem('pending_rfq_qty', 'Bulk');
    if (user) {
      navigate('/requirement');
    } else {
      onOpenAuth('buyer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          🏗️ Explore Sourcing Categories
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Select a category to post bulk requirements or get customized quotes.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(cat)}
            className="group bg-white border border-slate-200 hover:border-orange-300 rounded-xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #fff7ed 100%)' }}
          >
            <div>
              {/* Category Image */}
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/image/Category/industrialImage.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
              </div>

              {/* Title & Desc */}
              <div className="p-4 space-y-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors duration-200">
                  {cat.title}
                </h4>
                <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                  {cat.desc}
                </p>
              </div>
            </div>

            {/* View Button */}
            <div className="px-4 pb-4">
              <button
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-bold rounded-lg border border-orange-600 cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
              >
                Post Requirement
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
