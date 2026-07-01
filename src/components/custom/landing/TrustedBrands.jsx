/**
 * TrustedBrands — the "we're plugged into real supply chains" strip.
 *
 * Real brand logos beat text every time, but we don't have logo licenses
 * yet — so instead of fake-looking placeholder rectangles, we use styled
 * wordmarks in a wide row. Reads like a magazine masthead: no gradients,
 * no decoration, just names. This is deliberately restrained.
 *
 * When real vector logos become available, drop them in as <img> — the
 * wordmarks are the fallback that never looks broken.
 */

const BRANDS = [
  // One representative from each of the 10 categories, all real Karnataka-relevant
  { name: 'UltraTech',      cat: 'Cement' },
  { name: 'Tata Tiscon',    cat: 'Steel' },
  { name: 'Asian Paints',   cat: 'Paints' },
  { name: 'Kajaria',        cat: 'Tiles' },
  { name: 'Jaquar',         cat: 'Sanitary' },
  { name: 'Polycab',        cat: 'Electrical' },
  { name: 'Astral',         cat: 'Plumbing' },
  { name: 'CenturyPly',     cat: 'Plywood' },
  { name: 'Bosch',          cat: 'Tools' },
  { name: 'Dr. Fixit',      cat: 'Waterproofing' },
];

export default function TrustedBrands() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Sourced Through SaralBuy
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Verified suppliers carrying brands you already trust
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-6 items-center">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="group flex flex-col items-center justify-center h-16 border-x border-slate-100 transition"
              title={`${b.name} — ${b.cat}`}
            >
              <span className="text-slate-500 group-hover:text-slate-900 font-black text-base sm:text-lg tracking-tight transition-colors">
                {b.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-300 group-hover:text-slate-400 font-bold mt-0.5 transition-colors">
                {b.cat}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Not affiliated. Sourced via verified independent dealers on the platform.
        </p>
      </div>
    </section>
  );
}
