import { useEffect, useMemo, useState } from 'react';
import { THEME_LIBRARY, PRODUCTION_THEME, findTheme } from '@/data/designLabThemes';

/**
 * Design Lab / Theme Playground — a fully isolated sandbox for trying bold
 * visual identities WITHOUT touching production.
 *
 * Why isolated rather than "real components + a theme switch":
 * production components are not tokenized today (hardcoded Tailwind classes
 * like bg-orange-600 everywhere). Retrofitting every real component to
 * consume tokens would be an invasive rewrite of the whole app — the
 * opposite of "must remain completely unchanged". So this page renders its
 * OWN mock recreations of Header/Sidebar/Dashboard/Forms/Tables/etc., styled
 * purely off CSS custom properties scoped to this page's root div. Zero
 * shared components imported from the real app, zero risk to production.
 * Not linked from any nav — reachable only by typing /design-lab directly.
 *
 * "Promoting" a theme to production is intentionally NOT implemented here —
 * that would mean touching real component files, which is explicitly out of
 * scope until you choose a winner. "Mark as production candidate" just
 * flags it in this tool's own localStorage list for your own tracking.
 */

const FAVORITES_KEY = 'designlab_favorites';
const CANDIDATES_KEY = 'designlab_candidates';

function loadSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set();
  }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function tokensToCssVars(tokens) {
  const vars = {};
  Object.entries(tokens).forEach(([k, v]) => {
    vars[`--dl-${k}`] = v;
  });
  return vars;
}

export default function DesignLab() {
  const [themeKey, setThemeKey] = useState('production');
  const [compareKey, setCompareKey] = useState(null);
  const [favorites, setFavorites] = useState(() => loadSet(FAVORITES_KEY));
  const [candidates, setCandidates] = useState(() => loadSet(CANDIDATES_KEY));
  const [filter, setFilter] = useState('all'); // all | light | dark | favorites

  const theme = useMemo(() => findTheme(themeKey), [themeKey]);
  const compareTheme = compareKey ? findTheme(compareKey) : null;

  const toggleFavorite = key => {
    const next = new Set(favorites);
    next.has(key) ? next.delete(key) : next.add(key);
    setFavorites(next);
    saveSet(FAVORITES_KEY, next);
  };
  const toggleCandidate = key => {
    const next = new Set(candidates);
    next.has(key) ? next.delete(key) : next.add(key);
    setCandidates(next);
    saveSet(CANDIDATES_KEY, next);
  };

  const visibleThemes = THEME_LIBRARY.filter(t => {
    if (filter === 'favorites') return favorites.has(t.key);
    if (filter === 'light' || filter === 'dark') return t.mode === filter;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c' }}>
      {/* ── Control bar (lab chrome — not part of the themed preview) ── */}
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
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize transition-colors ${
                  filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setThemeKey('production'); setCompareKey(null); }}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 shrink-0"
          >
            Reset to Production
          </button>
        </div>

        {/* Theme swatch grid */}
        <div className="max-w-[1600px] mx-auto mt-3 flex flex-wrap gap-2">
          {visibleThemes.map(t => (
            <button
              key={t.key}
              onClick={() => setThemeKey(t.key)}
              className={`group relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all ${
                themeKey === t.key ? 'border-white bg-white/15' : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: t.tokens.primary }} />
                <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: t.tokens.accent }} />
              </span>
              <span className="text-xs font-semibold text-white/90 whitespace-nowrap">{t.name}</span>
              {favorites.has(t.key) && <span className="text-amber-300 text-xs">★</span>}
              {candidates.has(t.key) && <span className="text-emerald-300 text-[10px] font-bold uppercase">candidate</span>}
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); setCompareKey(compareKey === t.key ? null : t.key); }}
                className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${compareKey === t.key ? 'bg-white text-black' : 'bg-white/10 text-white/60'}`}
              >
                compare
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Preview area ── */}
      <div className={compareTheme ? 'grid grid-cols-1 xl:grid-cols-2 gap-4 p-4' : 'p-4'}>
        <ThemePreviewPanel
          theme={theme}
          isFavorite={favorites.has(theme.key)}
          isCandidate={candidates.has(theme.key)}
          onToggleFavorite={() => toggleFavorite(theme.key)}
          onToggleCandidate={() => toggleCandidate(theme.key)}
        />
        {compareTheme && (
          <ThemePreviewPanel
            theme={compareTheme}
            isFavorite={favorites.has(compareTheme.key)}
            isCandidate={candidates.has(compareTheme.key)}
            onToggleFavorite={() => toggleFavorite(compareTheme.key)}
            onToggleCandidate={() => toggleCandidate(compareTheme.key)}
          />
        )}
      </div>
    </div>
  );
}

function ThemePreviewPanel({ theme, isFavorite, isCandidate, onToggleFavorite, onToggleCandidate }) {
  const vars = tokensToCssVars(theme.tokens);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={vars}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/40">
        <div className="text-white text-sm font-bold">
          {theme.name} <span className="text-white/40 font-normal">· {theme.mode}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${isFavorite ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            ★ {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={onToggleCandidate}
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${isCandidate ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            {isCandidate ? '✓ Production Candidate' : 'Mark as Candidate'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--dl-background)' }} className="p-4 space-y-4">
        <MockHeader />
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          <MockSidebar />
          <div className="space-y-4 min-w-0">
            <MockDashboardCards />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MockSupplierProfile />
              <MockBuyerProfile />
            </div>
            <MockForm />
            <MockTable />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MockChat />
              <MockNotifications />
            </div>
            <MockButtonsBadges />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MockEmptyState />
              <MockModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mock UI pieces — every color comes from a --dl-* CSS var, never a
// hardcoded hex, so swapping themes never requires touching these. ──

const surfaceStyle = { background: 'var(--dl-surface)', borderColor: 'var(--dl-border)', color: 'var(--dl-textPrimary)' };
const cardStyle = { background: 'var(--dl-card)', borderColor: 'var(--dl-border)', color: 'var(--dl-textPrimary)' };

function MockHeader() {
  return (
    <div className="rounded-xl border px-4 py-3 flex items-center justify-between" style={{ background: 'var(--dl-header)', borderColor: 'var(--dl-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg" style={{ background: 'var(--dl-primary)' }} />
        <span className="font-black text-sm" style={{ color: 'var(--dl-textPrimary)' }}>SaralBuy</span>
        <div className="hidden sm:flex items-center gap-4 ml-4 text-xs font-semibold" style={{ color: 'var(--dl-textSecondary)' }}>
          <span>Explore</span><span>How It Works</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block w-40 h-8 rounded-full border" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)' }} />
        <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>
          Post Requirement
        </button>
      </div>
    </div>
  );
}

function MockSidebar() {
  const items = ['Dashboard', 'Requirements', 'Quotes', 'Deals', 'Notifications'];
  return (
    <div className="rounded-xl border p-3 space-y-1 h-fit" style={{ background: 'var(--dl-sidebar)', borderColor: 'var(--dl-border)' }}>
      {items.map((label, i) => (
        <div
          key={label}
          className="text-xs font-semibold px-3 py-2 rounded-lg"
          style={i === 0
            ? { background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }
            : { color: 'var(--dl-textSecondary)' }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function MockDashboardCards() {
  const stats = [
    { label: 'Active RFQs', value: '12' },
    { label: 'Quotes Received', value: '48' },
    { label: 'Deals Closed', value: '7' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border p-4" style={cardStyle}>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--dl-textSecondary)' }}>{s.label}</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--dl-primary)' }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function MockSupplierProfile() {
  return (
    <div className="rounded-xl border overflow-hidden" style={cardStyle}>
      <div className="h-10" style={{ background: 'var(--dl-primary)' }} />
      <div className="p-4 -mt-5">
        <div className="w-12 h-12 rounded-full border-4" style={{ background: 'var(--dl-accent)', borderColor: 'var(--dl-card)' }} />
        <p className="font-black text-sm mt-2">Acme Steel Co.</p>
        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--dl-success)', color: 'var(--dl-textInverse)' }}>
          Verified Supplier
        </span>
        <p className="text-xs mt-2" style={{ color: 'var(--dl-textSecondary)' }}>Top Products: TMT Bars, Cement, Steel Sheets</p>
      </div>
    </div>
  );
}

function MockBuyerProfile() {
  return (
    <div className="rounded-xl border p-4" style={cardStyle}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full" style={{ background: 'var(--dl-secondary)' }} />
        <div>
          <p className="font-black text-sm">Ramesh Constructions</p>
          <p className="text-xs" style={{ color: 'var(--dl-textSecondary)' }}>Buyer · Bengaluru</p>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--dl-textSecondary)' }}>Member since Jan 2026</p>
    </div>
  );
}

function MockForm() {
  return (
    <div className="rounded-xl border p-4" style={cardStyle}>
      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--dl-textSecondary)' }}>Post a Requirement</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-9 rounded-lg border px-3 flex items-center text-xs" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)', color: 'var(--dl-textSecondary)' }}>
          Category
        </div>
        <div className="h-9 rounded-lg border px-3 flex items-center text-xs" style={{ background: 'var(--dl-input)', borderColor: 'var(--dl-border)', color: 'var(--dl-textSecondary)' }}>
          Quantity
        </div>
      </div>
      <button className="mt-3 text-xs font-bold px-4 py-2 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>
        Submit
      </button>
    </div>
  );
}

function MockTable() {
  const rows = [
    ['TMT Bars 12mm', '₹52,000', 'Pending'],
    ['OPC Cement', '₹340/bag', 'Shortlisted'],
    ['Vitrified Tiles', '₹68/sqft', 'Accepted'],
  ];
  return (
    <div className="rounded-xl border overflow-hidden" style={cardStyle}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: 'var(--dl-surface)' }}>
            {['Item', 'Price', 'Status'].map(h => (
              <th key={h} className="text-left px-4 py-2 font-bold uppercase tracking-wide" style={{ color: 'var(--dl-textSecondary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t" style={{ borderColor: 'var(--dl-border)' }}>
              {r.map((c, j) => <td key={j} className="px-4 py-2.5 font-semibold">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MockChat() {
  return (
    <div className="rounded-xl border p-4 space-y-2" style={cardStyle}>
      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--dl-textSecondary)' }}>Chat</p>
      <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs" style={{ background: 'var(--dl-surface)', color: 'var(--dl-textPrimary)' }}>
        Can you deliver by Friday?
      </div>
      <div className="max-w-[75%] ml-auto rounded-2xl rounded-br-sm px-3 py-2 text-xs" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>
        Yes, that works for us.
      </div>
    </div>
  );
}

function MockNotifications() {
  return (
    <div className="rounded-xl border p-4 space-y-2" style={cardStyle}>
      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--dl-textSecondary)' }}>Notifications</p>
      {['Quote Shortlisted!', 'New message from buyer'].map(n => (
        <div key={n} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--dl-surface)' }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--dl-primary)' }} />
          <span className="text-xs font-semibold">{n}</span>
        </div>
      ))}
    </div>
  );
}

function MockButtonsBadges() {
  return (
    <div className="rounded-xl border p-4 flex flex-wrap items-center gap-3" style={cardStyle}>
      <button className="text-xs font-bold px-4 py-2 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Primary</button>
      <button className="text-xs font-bold px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--dl-primary)', color: 'var(--dl-primary)' }}>Secondary</button>
      <a className="text-xs font-bold underline" style={{ color: 'var(--dl-link)' }}>Link</a>
      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--dl-success)', color: 'var(--dl-textInverse)' }}>Success</span>
      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--dl-warning)', color: 'var(--dl-textInverse)' }}>Warning</span>
      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--dl-danger)', color: 'var(--dl-textInverse)' }}>Error</span>
    </div>
  );
}

function MockEmptyState() {
  return (
    <div className="rounded-xl border p-8 text-center" style={cardStyle}>
      <div className="w-10 h-10 rounded-full mx-auto mb-2" style={{ background: 'var(--dl-surface)' }} />
      <p className="text-xs font-bold" style={{ color: 'var(--dl-textSecondary)' }}>No quotes yet — post a requirement to get started.</p>
    </div>
  );
}

function MockModal() {
  return (
    <div className="rounded-xl border p-4" style={surfaceStyle}>
      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--dl-textSecondary)' }}>Modal Preview</p>
      <div className="rounded-lg border p-3" style={cardStyle}>
        <p className="text-sm font-black">Close Deal</p>
        <p className="text-xs mt-1" style={{ color: 'var(--dl-textSecondary)' }}>Confirm final price and delivery terms.</p>
        <div className="flex gap-2 mt-3">
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--dl-primary)', color: 'var(--dl-textInverse)' }}>Confirm</button>
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--dl-border)', color: 'var(--dl-textSecondary)' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
