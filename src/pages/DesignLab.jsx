import { useMemo, useState } from 'react';
import { THEME_LIBRARY, findTheme } from '@/data/designLabThemes';

/**
 * Design Lab / Theme Playground — isolated sandbox for testing full-page
 * visual directions WITHOUT touching production.
 *
 * v2: previous version stacked small UI fragments into one scrolling panel.
 * This version renders one COMPLETE page mockup at a time (Landing, Buyer
 * Dashboard, Supplier Dashboard, Public Supplier Profile, Chat, Product
 * Search, RFQ/Compare Quotes, Settings) — a real design direction has to be
 * judged on a whole page's rhythm, not a grid of disconnected widgets.
 *
 * Still zero risk to production: every mock page is its own component here,
 * styled purely off --dl-* CSS custom properties, no shared component
 * imports from the real app. Not linked from any nav.
 */

const FAVORITES_KEY = 'designlab_favorites';
const CANDIDATES_KEY = 'designlab_candidates';

function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
}
function saveSet(key, set) { localStorage.setItem(key, JSON.stringify([...set])); }
function tokensToCssVars(tokens) {
  const vars = {};
  Object.entries(tokens).forEach(([k, v]) => { vars[`--dl-${k}`] = v; });
  return vars;
}

const PAGES = [
  { key: 'landing', label: 'Landing Page', Component: MockLandingPage },
  { key: 'buyer-dashboard', label: 'Buyer Dashboard', Component: MockBuyerDashboard },
  { key: 'supplier-dashboard', label: 'Supplier Dashboard', Component: MockSupplierDashboard },
  { key: 'supplier-profile', label: 'Public Supplier Profile', Component: MockSupplierProfilePage },
  { key: 'chat', label: 'Chat', Component: MockChatPage },
  { key: 'search', label: 'Product Search', Component: MockSearchPage },
  { key: 'rfq', label: 'RFQ / Compare Quotes', Component: MockRFQPage },
  { key: 'settings', label: 'Settings', Component: MockSettingsPage },
];

export default function DesignLab() {
  const [themeKey, setThemeKey] = useState('production');
  const [compareKey, setCompareKey] = useState(null);
  const [pageKey, setPageKey] = useState('landing');
  const [favorites, setFavorites] = useState(() => loadSet(FAVORITES_KEY));
  const [candidates, setCandidates] = useState(() => loadSet(CANDIDATES_KEY));
  const [filter, setFilter] = useState('all');

  const theme = useMemo(() => findTheme(themeKey), [themeKey]);
  const compareTheme = compareKey ? findTheme(compareKey) : null;
  const activePage = PAGES.find(p => p.key === pageKey) || PAGES[0];

  const toggleFavorite = key => {
    const next = new Set(favorites);
    next.has(key) ? next.delete(key) : next.add(key);
    setFavorites(next); saveSet(FAVORITES_KEY, next);
  };
  const toggleCandidate = key => {
    const next = new Set(candidates);
    next.has(key) ? next.delete(key) : next.add(key);
    setCandidates(next); saveSet(CANDIDATES_KEY, next);
  };

  const visibleThemes = THEME_LIBRARY.filter(t => {
    if (filter === 'favorites') return favorites.has(t.key);
    if (filter === 'light' || filter === 'dark') return t.mode === filter;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c' }}>
      {/* ── Control bar ── */}
      <div className="sticky top-0 z-50 bg-[#111113] border-b border-white/10 px-4 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-3">
          <div className="text-white font-black text-sm tracking-wide shrink-0">
            🎨 SaralBuy Design Lab
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              dev only — not linked in nav
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {['all', 'light', 'dark', 'favorites'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize transition-colors ${filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => { setThemeKey('production'); setCompareKey(null); }}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 shrink-0">
            Reset to Production
          </button>
        </div>

        {/* Page selector — which SaralBuy screen to preview */}
        <div className="max-w-[1600px] mx-auto mt-3 flex flex-wrap gap-1.5">
          {PAGES.map(p => (
            <button key={p.key} onClick={() => setPageKey(p.key)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${pageKey === p.key ? 'bg-white text-black' : 'bg-white/5 text-white/70 hover:bg-white/15'}`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Theme swatch grid */}
        <div className="max-w-[1600px] mx-auto mt-3 flex flex-wrap gap-2">
          {visibleThemes.map(t => (
            <button key={t.key} onClick={() => setThemeKey(t.key)}
              className={`group relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all ${themeKey === t.key ? 'border-white bg-white/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: t.tokens.primary }} />
                <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: t.tokens.accent }} />
              </span>
              <span className="text-xs font-semibold text-white/90 whitespace-nowrap">{t.name}</span>
              {favorites.has(t.key) && <span className="text-amber-300 text-xs">★</span>}
              {candidates.has(t.key) && <span className="text-emerald-300 text-[10px] font-bold uppercase">candidate</span>}
              <span role="button" tabIndex={0}
                onClick={e => { e.stopPropagation(); setCompareKey(compareKey === t.key ? null : t.key); }}
                className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${compareKey === t.key ? 'bg-white text-black' : 'bg-white/10 text-white/60'}`}>
                compare
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Preview area — one full page mockup, themed ── */}
      <div className={compareTheme ? 'grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4' : 'p-4'}>
        <ThemePreviewPanel
          theme={theme} PageComponent={activePage.Component} pageLabel={activePage.label}
          isFavorite={favorites.has(theme.key)} isCandidate={candidates.has(theme.key)}
          onToggleFavorite={() => toggleFavorite(theme.key)} onToggleCandidate={() => toggleCandidate(theme.key)}
        />
        {compareTheme && (
          <ThemePreviewPanel
            theme={compareTheme} PageComponent={activePage.Component} pageLabel={activePage.label}
            isFavorite={favorites.has(compareTheme.key)} isCandidate={candidates.has(compareTheme.key)}
            onToggleFavorite={() => toggleFavorite(compareTheme.key)} onToggleCandidate={() => toggleCandidate(compareTheme.key)}
          />
        )}
      </div>
    </div>
  );
}

function ThemePreviewPanel({ theme, PageComponent, pageLabel, isFavorite, isCandidate, onToggleFavorite, onToggleCandidate }) {
  const vars = tokensToCssVars(theme.tokens);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={vars}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/40">
        <div className="text-white text-sm font-bold">
          {theme.name} <span className="text-white/40 font-normal">· {theme.mode} · {pageLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleFavorite} className={`text-xs font-bold px-2.5 py-1 rounded-full ${isFavorite ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            ★ {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
          <button onClick={onToggleCandidate} className={`text-xs font-bold px-2.5 py-1 rounded-full ${isCandidate ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {isCandidate ? '✓ Production Candidate' : 'Mark as Candidate'}
          </button>
        </div>
      </div>
      <div
        style={{ background: 'var(--dl-background)', color: 'var(--dl-textPrimary)', fontFamily: 'var(--dl-fontBody)' }}
        className="max-h-[80vh] overflow-y-auto"
      >
        <PageComponent />
      </div>
    </div>
  );
}

// ── Shared style helpers — every color is a --dl-* CSS var ──
const surfaceStyle = { background: 'var(--dl-surface)', borderColor: 'var(--dl-border)', color: 'var(--dl-textPrimary)' };
const cardStyle = { background: 'var(--dl-card)', borderColor: 'var(--dl-border)', color: 'var(--dl-textPrimary)' };
const headerStyle = { background: 'var(--dl-header)', borderColor: 'var(--dl-border)' };
const sidebarStyle = { background: 'var(--dl-sidebar)', borderColor: 'var(--dl-border)' };

function TopNav({ active = 'Explore' }) {
  return (
    <div className="border-b px-6 py-3 flex items-center justify-between" style={headerStyle}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg" style={{ background: 'var(--dl-primary)' }} />
          <span className="font-black text-sm" style={{ color: 'var(--dl-textPrimary)', fontFamily: 'var(--dl-fontDisplay)' }}>SaralBuy</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--dl-textSecondary)' }}>
          {['Explore', 'How It Works', 'Dashboard'].map(l => (
            <span key={l} style={l === active ? { color: 'var(--dl-primary)' } : {}}>{l}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block w-48 h-8 rounded-full border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
        <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Post Requirement</button>
        <div className="w-8 h-8 rounded-full" style={{ background: 'var(--dl-accent)' }} />
      </div>
    </div>
  );
}

function SideNav({ items, activeIdx = 0 }) {
  return (
    <div className="border-r p-3 space-y-1 w-56 shrink-0" style={sidebarStyle}>
      {items.map((label, i) => (
        <div key={label} className="text-xs font-semibold px-3 py-2.5 rounded-lg"
          style={i === activeIdx ? { background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' } : { color: 'var(--dl-textSecondary)' }}>
          {label}
        </div>
      ))}
    </div>
  );
}

// ── 1. LANDING PAGE ──────────────────────────────────────────────────────
function MockLandingPage() {
  return (
    <div>
      <TopNav />
      <div className="px-6 sm:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-5"
            style={{ background: 'var(--dl-surface)', border: '1px solid var(--dl-border)', color: 'var(--dl-primary)' }}>
            Materials Procurement Exchange
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4" style={{ color: 'var(--dl-textPrimary)', fontFamily: 'var(--dl-fontDisplay)' }}>
            Stop chasing suppliers.<br />
            <span style={{ color: 'var(--dl-primary)' }}>Post once, get quotes in minutes.</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--dl-textSecondary)' }}>
            SaralBuy broadcasts your requirements to trusted suppliers across Karnataka. Anonymous sourcing · Competitive pricing · Zero spam.
          </p>
          <div className="flex gap-3">
            <button className="text-sm font-bold px-6 py-3 rounded-xl" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Post a Requirement</button>
            <button className="text-sm font-bold px-6 py-3 rounded-xl border-2" style={{ borderColor: 'var(--dl-border)', color: 'var(--dl-textPrimary)' }}>I'm a Supplier</button>
          </div>
        </div>
        <div className="rounded-2xl border h-64" style={cardStyle} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 sm:px-12 pb-16">
        {['One Post Broadcast', '100% Anonymous', 'Verified & Vetted'].map(t => (
          <div key={t} className="rounded-xl border p-4" style={cardStyle}>
            <div className="w-9 h-9 rounded-lg mb-3" style={{ background: 'var(--dl-accent)' }} />
            <p className="font-bold text-sm">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 2. BUYER DASHBOARD ───────────────────────────────────────────────────
function MockBuyerDashboard() {
  const rows = [
    ['TMT Bars 12mm', '3 quotes', 'Pending'],
    ['OPC Cement', '5 quotes', 'Shortlisted'],
    ['Vitrified Tiles', '2 quotes', 'Accepted'],
  ];
  return (
    <div className="flex">
      <SideNav items={['Dashboard', 'Requirements', 'Quotes Submitted', 'Closed Deals', 'Notifications']} />
      <div className="flex-1 min-w-0">
        <TopNav active="Dashboard" />
        <div className="p-6 space-y-5">
          <h2 className="text-lg font-black" style={{ fontFamily: 'var(--dl-fontDisplay)' }}>Welcome back, Ramesh</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[['Active RFQs', '12'], ['Quotes Received', '48'], ['Deals Closed', '7']].map(([l, v]) => (
              <div key={l} className="rounded-xl border p-4" style={cardStyle}>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--dl-textSecondary)' }}>{l}</p>
                <p className="text-2xl font-black mt-1" style={{ color: 'var(--dl-primary)' }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border overflow-hidden" style={cardStyle}>
            <div className="px-4 py-3 border-b font-bold text-sm" style={{ borderColor: 'var(--dl-border)' }}>Recent Requirements</div>
            <table className="w-full text-xs">
              <thead><tr style={{ background: 'var(--dl-surface)' }}>{['Item', 'Quotes', 'Status'].map(h => <th key={h} className="text-left px-4 py-2 font-bold uppercase" style={{ color: 'var(--dl-textSecondary)' }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r, i) => <tr key={i} className="border-t" style={{ borderColor: 'var(--dl-border)' }}>{r.map((c, j) => <td key={j} className="px-4 py-3 font-semibold">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3. SUPPLIER DASHBOARD ────────────────────────────────────────────────
function MockSupplierDashboard() {
  const leads = [
    ['Cement — 500 bags', 'Bengaluru', '2h ago'],
    ['Steel Sheets — 2 tons', 'Mysuru', '5h ago'],
    ['Tiles — 1200 sqft', 'Vizianagaram', '1d ago'],
  ];
  return (
    <div className="flex">
      <SideNav items={['Dashboard', 'Explore Leads', 'My Quotes', 'Closed Deals', 'Verification']} />
      <div className="flex-1 min-w-0">
        <TopNav active="Dashboard" />
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black" style={{ fontFamily: 'var(--dl-fontDisplay)' }}>New leads near you</h2>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--dl-success)', color: 'var(--dl-textInverse)' }}>Verified Supplier</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[['Active Quotes', '9'], ['Win Rate', '34%'], ['Deals Closed', '5']].map(([l, v]) => (
              <div key={l} className="rounded-xl border p-4" style={cardStyle}>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--dl-textSecondary)' }}>{l}</p>
                <p className="text-2xl font-black mt-1" style={{ color: 'var(--dl-primary)' }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {leads.map(([item, loc, time], i) => (
              <div key={i} className="rounded-xl border p-4 flex items-center justify-between" style={cardStyle}>
                <div>
                  <p className="font-bold text-sm">{item}</p>
                  <p className="text-xs" style={{ color: 'var(--dl-textSecondary)' }}>{loc} · {time}</p>
                </div>
                <button className="text-xs font-bold px-4 py-2 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Quote Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4. PUBLIC SUPPLIER PROFILE ───────────────────────────────────────────
function MockSupplierProfilePage() {
  return (
    <div>
      <TopNav />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="rounded-xl border overflow-hidden" style={cardStyle}>
          <div className="h-16" style={{ background: 'var(--dl-primary)' }} />
          <div className="px-6 pb-6 -mt-8">
            <div className="w-16 h-16 rounded-full border-4" style={{ background: 'var(--dl-accent)', borderColor: 'var(--dl-card)' }} />
            <div className="flex items-center gap-2 mt-3">
              <h2 className="font-black text-lg" style={{ fontFamily: 'var(--dl-fontDisplay)' }}>Acme Steel Co.</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--dl-success)', color: 'var(--dl-textInverse)' }}>Verified</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--dl-textSecondary)' }}>Supplier · Vizianagaram</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[['Role', 'Supplier'], ['Location', 'Vizianagaram'], ['Member since', 'Jul 2026'], ['Verification', 'Verified']].map(([l, v]) => (
                <div key={l} className="rounded-lg p-3" style={{ background: 'var(--dl-surface)' }}>
                  <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--dl-textSecondary)' }}>{l}</p>
                  <p className="text-xs font-bold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border p-5" style={cardStyle}>
          <p className="text-[10px] font-bold uppercase mb-2" style={{ color: 'var(--dl-textSecondary)' }}>About the Business</p>
          <p className="text-sm" style={{ color: 'var(--dl-textSecondary)' }}>15 years supplying TMT bars, cement and structural steel to contractors across Karnataka and Andhra Pradesh.</p>
        </div>
        <div className="mt-4 rounded-xl border p-5" style={cardStyle}>
          <p className="text-[10px] font-bold uppercase mb-2" style={{ color: 'var(--dl-textSecondary)' }}>Top Products Supplied</p>
          <p className="text-sm" style={{ color: 'var(--dl-textSecondary)' }}>TMT Bars, OPC Cement, Structural Steel Sheets</p>
        </div>
      </div>
    </div>
  );
}

// ── 5. CHAT ───────────────────────────────────────────────────────────────
function MockChatPage() {
  return (
    <div className="flex" style={{ height: 520 }}>
      <div className="w-64 border-r shrink-0" style={sidebarStyle}>
        <div className="p-3 font-bold text-sm border-b" style={{ borderColor: 'var(--dl-border)' }}>Messages</div>
        {['Acme Steel Co.', 'Ramesh Constructions', 'BuildRight Projects'].map((n, i) => (
          <div key={n} className="p-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--dl-border)', background: i === 0 ? 'var(--dl-surface)' : 'transparent' }}>
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--dl-accent)' }} />
            <span className="text-xs font-semibold truncate">{n}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--dl-background)' }}>
        <div className="p-3 border-b font-bold text-sm" style={headerStyle}>Acme Steel Co.</div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="max-w-[70%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs" style={{ background: 'var(--dl-surface)' }}>Can you deliver by Friday?</div>
          <div className="max-w-[70%] ml-auto rounded-2xl rounded-br-sm px-3 py-2 text-xs" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Yes, that works for us.</div>
          <div className="max-w-[70%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs" style={{ background: 'var(--dl-surface)' }}>Great, sending final quote now.</div>
        </div>
        <div className="p-3 border-t" style={{ borderColor: 'var(--dl-border)' }}>
          <div className="h-9 rounded-full border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
        </div>
      </div>
    </div>
  );
}

// ── 6. PRODUCT SEARCH / LISTING ──────────────────────────────────────────
function MockSearchPage() {
  const items = ['TMT Bars 12mm', 'OPC Cement 53 Grade', 'Vitrified Tiles 600x600', 'PVC Conduit Pipes', 'LED Panel Lights', 'Granite Slabs'];
  return (
    <div>
      <TopNav active="Explore" />
      <div className="flex">
        <div className="w-52 border-r p-4 space-y-3 shrink-0" style={sidebarStyle}>
          <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--dl-textSecondary)' }}>Categories</p>
          {['Building Materials', 'Electrical', 'Plumbing', 'Tiles & Flooring'].map(c => (
            <div key={c} className="text-xs font-semibold" style={{ color: 'var(--dl-textSecondary)' }}>{c}</div>
          ))}
        </div>
        <div className="flex-1 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map(name => (
              <div key={name} className="rounded-xl border overflow-hidden" style={cardStyle}>
                <div className="h-20" style={{ background: 'var(--dl-surface)' }} />
                <div className="p-3">
                  <p className="text-xs font-bold truncate">{name}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--dl-textSecondary)' }}>Bengaluru</p>
                  <button className="mt-2 w-full text-[10px] font-bold py-1.5 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Quote Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 7. RFQ / COMPARE QUOTES ───────────────────────────────────────────────
function MockRFQPage() {
  const cols = ['Attribute', 'Supplier A', 'Supplier B', 'Supplier C'];
  const rows = [
    ['Price', '₹52,000', '₹54,500', '₹51,800'],
    ['Delivery', '3 days', '2 days', '5 days'],
    ['Payment Terms', 'Advance 50%', 'Net 15', 'Advance 30%'],
    ['Status', 'Pending', 'Shortlisted', 'Pending'],
  ];
  return (
    <div>
      <TopNav />
      <div className="p-6">
        <h2 className="text-lg font-black mb-1" style={{ fontFamily: 'var(--dl-fontDisplay)' }}>TMT Bars Required — Compare Quotes</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--dl-textSecondary)' }}>Side-by-side comparison. Lowest price highlighted.</p>
        <div className="rounded-xl border overflow-hidden" style={cardStyle}>
          <table className="w-full text-xs">
            <thead><tr style={{ background: 'var(--dl-surface)' }}>{cols.map(h => <th key={h} className="text-left px-4 py-2.5 font-bold uppercase" style={{ color: 'var(--dl-textSecondary)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--dl-border)' }}>
                  {r.map((c, j) => (
                    <td key={j} className="px-4 py-3 font-semibold" style={i === 0 && j === 3 ? { color: 'var(--dl-success)', fontWeight: 800 } : {}}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="text-xs font-bold px-4 py-2 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Finalize in Chat</button>
          <button className="text-xs font-bold px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--dl-border)', color: 'var(--dl-textSecondary)' }}>Shortlist</button>
        </div>
      </div>
    </div>
  );
}

// ── 8. SETTINGS / PROFILE FORM ───────────────────────────────────────────
function MockSettingsPage() {
  return (
    <div className="flex">
      <SideNav items={['Profile', 'Quotes Submitted', 'Requirements', 'Closed Deals', 'Notifications']} />
      <div className="flex-1 p-6 max-w-xl">
        <h2 className="text-lg font-black mb-4" style={{ fontFamily: 'var(--dl-fontDisplay)' }}>Profile Details</h2>
        <div className="rounded-xl border p-5 space-y-4" style={cardStyle}>
          <div>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--dl-textSecondary)' }}>Full Name</p>
            <div className="h-9 rounded-lg border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--dl-textSecondary)' }}>Email</p>
              <div className="h-9 rounded-lg border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--dl-textSecondary)' }}>Phone</p>
              <div className="h-9 rounded-lg border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
            </div>
          </div>
          <button className="text-xs font-bold px-5 py-2.5 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}
