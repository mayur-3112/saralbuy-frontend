// Design Lab theme library — each entry is a complete token set.
// Token schema (every theme MUST define all of these):
//   primary, primaryHover, secondary, accent,
//   background, surface, card, header, sidebar, border, input,
//   textPrimary, textSecondary, textInverse,
//   link, success, warning, danger
//
// "production" is the real, live SaralBuy palette (orange-600 primary,
// white surfaces, slate text) — it's the default and the only one that
// matters until you explicitly promote something else.

export const PRODUCTION_THEME = {
  key: 'production',
  name: 'SaralBuy Production',
  mode: 'light',
  tokens: {
    primary: '#ea580c', primaryHover: '#c2410c', secondary: '#f43f5e', accent: '#f97316',
    background: '#f8fafc', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#ffffff',
    border: '#e2e8f0', input: '#ffffff',
    textPrimary: '#0f172a', textSecondary: '#64748b', textInverse: '#ffffff',
    link: '#ea580c', success: '#059669', warning: '#d97706', danger: '#dc2626',
  },
};

const t = (key, name, mode, tokens) => ({ key, name, mode, tokens });

export const THEME_LIBRARY = [
  PRODUCTION_THEME,

  // ── Named business themes ──────────────────────────────────────────
  t('corporate-blue', 'Corporate Blue', 'light', {
    primary: '#1d4ed8', primaryHover: '#1e40af', secondary: '#0ea5e9', accent: '#3b82f6',
    background: '#f1f5f9', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#0f2a63',
    border: '#dbe3ef', input: '#ffffff',
    textPrimary: '#0f172a', textSecondary: '#475569', textInverse: '#ffffff',
    link: '#1d4ed8', success: '#16a34a', warning: '#d97706', danger: '#dc2626',
  }),
  t('enterprise-navy', 'Enterprise Navy', 'dark', {
    primary: '#3b82f6', primaryHover: '#60a5fa', secondary: '#94a3b8', accent: '#38bdf8',
    background: '#0b1220', surface: '#111a2e', card: '#152238', header: '#0b1220', sidebar: '#0b1220',
    border: '#22314d', input: '#152238',
    textPrimary: '#e2e8f0', textSecondary: '#93a3ba', textInverse: '#0b1220',
    link: '#60a5fa', success: '#22c55e', warning: '#f59e0b', danger: '#f87171',
  }),
  t('emerald-business', 'Emerald Business', 'light', {
    primary: '#059669', primaryHover: '#047857', secondary: '#10b981', accent: '#34d399',
    background: '#f0fdf7', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#064e3b',
    border: '#d1f2e2', input: '#ffffff',
    textPrimary: '#0f2f22', textSecondary: '#4b6b5d', textInverse: '#ffffff',
    link: '#059669', success: '#16a34a', warning: '#d97706', danger: '#dc2626',
  }),
  t('luxury-black-gold', 'Luxury Black & Gold', 'dark', {
    primary: '#d4af37', primaryHover: '#e8c766', secondary: '#8a6d1a', accent: '#f2d675',
    background: '#0a0a0a', surface: '#141414', card: '#1a1a1a', header: '#000000', sidebar: '#000000',
    border: '#2b2b2b', input: '#1a1a1a',
    textPrimary: '#f5f0e1', textSecondary: '#b8ab7f', textInverse: '#0a0a0a',
    link: '#d4af37', success: '#4ade80', warning: '#facc15', danger: '#f87171',
  }),
  t('matte-black', 'Matte Black', 'dark', {
    primary: '#e5e5e5', primaryHover: '#ffffff', secondary: '#737373', accent: '#a3a3a3',
    background: '#0d0d0d', surface: '#161616', card: '#1c1c1c', header: '#0d0d0d', sidebar: '#0d0d0d',
    border: '#2a2a2a', input: '#1c1c1c',
    textPrimary: '#f5f5f5', textSecondary: '#a3a3a3', textInverse: '#0d0d0d',
    link: '#e5e5e5', success: '#4ade80', warning: '#fbbf24', danger: '#f87171',
  }),
  t('graphite-neon-blue', 'Graphite + Neon Blue', 'dark', {
    primary: '#00d4ff', primaryHover: '#5ce6ff', secondary: '#334155', accent: '#00ffe1',
    background: '#101418', surface: '#171c22', card: '#1d232b', header: '#101418', sidebar: '#101418',
    border: '#2a323b', input: '#1d232b',
    textPrimary: '#e6f7fb', textSecondary: '#8ba3af', textInverse: '#101418',
    link: '#00d4ff', success: '#2dd4bf', warning: '#fbbf24', danger: '#fb7185',
  }),
  t('purple-tech', 'Purple Tech', 'dark', {
    primary: '#8b5cf6', primaryHover: '#a78bfa', secondary: '#6d28d9', accent: '#c084fc',
    background: '#0f0a1a', surface: '#170f2b', card: '#1e1436', header: '#0f0a1a', sidebar: '#0f0a1a',
    border: '#2f2350', input: '#1e1436',
    textPrimary: '#ede9fe', textSecondary: '#a89cc8', textInverse: '#0f0a1a',
    link: '#a78bfa', success: '#34d399', warning: '#fbbf24', danger: '#fb7185',
  }),
  t('cyberpunk', 'Cyberpunk', 'dark', {
    primary: '#f0ff00', primaryHover: '#ffff66', secondary: '#ff00aa', accent: '#00fff2',
    background: '#08010f', surface: '#12021f', card: '#1b0330', header: '#08010f', sidebar: '#08010f',
    border: '#3d0a5c', input: '#1b0330',
    textPrimary: '#f5f0ff', textSecondary: '#c48fe0', textInverse: '#08010f',
    link: '#00fff2', success: '#39ff14', warning: '#f0ff00', danger: '#ff003c',
  }),
  t('glassmorphism', 'Glassmorphism', 'light', {
    primary: '#6366f1', primaryHover: '#4f46e5', secondary: '#a5b4fc', accent: '#818cf8',
    background: '#e9edfb', surface: 'rgba(255,255,255,0.55)', card: 'rgba(255,255,255,0.45)',
    header: 'rgba(255,255,255,0.5)', sidebar: 'rgba(255,255,255,0.4)',
    border: 'rgba(255,255,255,0.6)', input: 'rgba(255,255,255,0.6)',
    textPrimary: '#1e1b4b', textSecondary: '#4b4a78', textInverse: '#ffffff',
    link: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  }),
  t('apple-minimal', 'Apple Minimal', 'light', {
    primary: '#0071e3', primaryHover: '#0058b0', secondary: '#86868b', accent: '#2997ff',
    background: '#ffffff', surface: '#fafafa', card: '#ffffff', header: '#ffffff', sidebar: '#f5f5f7',
    border: '#e5e5e5', input: '#f5f5f7',
    textPrimary: '#1d1d1f', textSecondary: '#6e6e73', textInverse: '#ffffff',
    link: '#0071e3', success: '#34c759', warning: '#ff9500', danger: '#ff3b30',
  }),
  t('linear-style', 'Linear Style', 'dark', {
    primary: '#5e6ad2', primaryHover: '#7b83e0', secondary: '#8a8f98', accent: '#a3a8f0',
    background: '#0a0a0b', surface: '#131315', card: '#1a1a1d', header: '#0a0a0b', sidebar: '#0a0a0b',
    border: '#232326', input: '#1a1a1d',
    textPrimary: '#f7f8f8', textSecondary: '#8a8f98', textInverse: '#0a0a0b',
    link: '#7b83e0', success: '#4cb782', warning: '#e5a750', danger: '#eb5757',
  }),
  t('stripe-inspired', 'Stripe Inspired', 'light', {
    primary: '#635bff', primaryHover: '#4f46e5', secondary: '#0a2540', accent: '#00d4ff',
    background: '#f6f9fc', surface: '#ffffff', card: '#ffffff', header: '#0a2540', sidebar: '#0a2540',
    border: '#e6ebf1', input: '#ffffff',
    textPrimary: '#0a2540', textSecondary: '#697386', textInverse: '#ffffff',
    link: '#635bff', success: '#3ecf8e', warning: '#f5a623', danger: '#df1b41',
  }),
  t('notion-inspired', 'Notion Inspired', 'light', {
    primary: '#2f3437', primaryHover: '#000000', secondary: '#787774', accent: '#337ea9',
    background: '#ffffff', surface: '#f7f6f3', card: '#ffffff', header: '#ffffff', sidebar: '#fbfbfa',
    border: '#e9e9e7', input: '#ffffff',
    textPrimary: '#37352f', textSecondary: '#787774', textInverse: '#ffffff',
    link: '#337ea9', success: '#4a8b3f', warning: '#d9730d', danger: '#e03e3e',
  }),
  t('vercel-inspired', 'Vercel Inspired', 'dark', {
    primary: '#ffffff', primaryHover: '#d4d4d4', secondary: '#888888', accent: '#0070f3',
    background: '#000000', surface: '#0a0a0a', card: '#111111', header: '#000000', sidebar: '#000000',
    border: '#333333', input: '#111111',
    textPrimary: '#ffffff', textSecondary: '#a1a1a1', textInverse: '#000000',
    link: '#0070f3', success: '#0070f3', warning: '#f5a623', danger: '#ee0000',
  }),
  t('beige-premium', 'Beige Premium', 'light', {
    primary: '#8a6d3b', primaryHover: '#6f5730', secondary: '#c9a97e', accent: '#a9825a',
    background: '#f5efe4', surface: '#fbf8f2', card: '#ffffff', header: '#f0e6d4', sidebar: '#efe4d0',
    border: '#e2d4bc', input: '#ffffff',
    textPrimary: '#3d3223', textSecondary: '#7a6c53', textInverse: '#ffffff',
    link: '#8a6d3b', success: '#5c8a3a', warning: '#c98a2c', danger: '#b3402f',
  }),
  t('scandinavian-light', 'Scandinavian Light', 'light', {
    primary: '#2b2b2b', primaryHover: '#000000', secondary: '#a6a6a6', accent: '#8fa998',
    background: '#fafaf8', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#f2f1ed',
    border: '#e6e4dd', input: '#ffffff',
    textPrimary: '#2b2b2b', textSecondary: '#767671', textInverse: '#ffffff',
    link: '#5b7a68', success: '#6b9b76', warning: '#c99a4a', danger: '#b8574a',
  }),
  t('orange-startup', 'Orange Startup', 'light', {
    primary: '#ff5c1c', primaryHover: '#e04a10', secondary: '#ffb199', accent: '#ff8a4c',
    background: '#fff8f5', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#1a1a1a',
    border: '#ffe1d1', input: '#ffffff',
    textPrimary: '#1a1a1a', textSecondary: '#6b6b6b', textInverse: '#ffffff',
    link: '#ff5c1c', success: '#22c55e', warning: '#eab308', danger: '#ef4444',
  }),
  t('red-enterprise', 'Red Enterprise', 'light', {
    primary: '#b91c1c', primaryHover: '#991b1b', secondary: '#7f1d1d', accent: '#ef4444',
    background: '#fef4f4', surface: '#ffffff', card: '#ffffff', header: '#7f1d1d', sidebar: '#450a0a',
    border: '#f3d6d6', input: '#ffffff',
    textPrimary: '#1c0a0a', textSecondary: '#6b4b4b', textInverse: '#ffffff',
    link: '#b91c1c', success: '#15803d', warning: '#b45309', danger: '#dc2626',
  }),
  t('indigo-modern', 'Indigo Modern', 'light', {
    primary: '#4338ca', primaryHover: '#3730a3', secondary: '#818cf8', accent: '#6366f1',
    background: '#f5f6fe', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#312e81',
    border: '#e0e1fa', input: '#ffffff',
    textPrimary: '#1e1b4b', textSecondary: '#5b5b8a', textInverse: '#ffffff',
    link: '#4338ca', success: '#059669', warning: '#d97706', danger: '#dc2626',
  }),
  t('ocean-cyan', 'Ocean Cyan', 'light', {
    primary: '#0891b2', primaryHover: '#0e7490', secondary: '#67e8f9', accent: '#22d3ee',
    background: '#eefcff', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#083344',
    border: '#c9f2fb', input: '#ffffff',
    textPrimary: '#083344', textSecondary: '#4d7c8a', textInverse: '#ffffff',
    link: '#0891b2', success: '#059669', warning: '#d97706', danger: '#dc2626',
  }),
  t('forest-green', 'Forest Green', 'dark', {
    primary: '#4ade80', primaryHover: '#86efac', secondary: '#166534', accent: '#22c55e',
    background: '#0a1a0f', surface: '#0f2417', card: '#132e1c', header: '#0a1a0f', sidebar: '#0a1a0f',
    border: '#1e3d28', input: '#132e1c',
    textPrimary: '#e7f7ec', textSecondary: '#8fbf9d', textInverse: '#0a1a0f',
    link: '#4ade80', success: '#4ade80', warning: '#fbbf24', danger: '#f87171',
  }),
  t('titanium-grey', 'Titanium Grey', 'light', {
    primary: '#52525b', primaryHover: '#3f3f46', secondary: '#a1a1aa', accent: '#71717a',
    background: '#f4f4f5', surface: '#ffffff', card: '#ffffff', header: '#ffffff', sidebar: '#e4e4e7',
    border: '#d4d4d8', input: '#ffffff',
    textPrimary: '#18181b', textSecondary: '#71717a', textInverse: '#ffffff',
    link: '#52525b', success: '#16a34a', warning: '#ca8a04', danger: '#dc2626',
  }),
  t('electric-blue', 'Electric Blue', 'dark', {
    primary: '#2979ff', primaryHover: '#5393ff', secondary: '#1e293b', accent: '#00e5ff',
    background: '#050b18', surface: '#0a1428', card: '#0e1c36', header: '#050b18', sidebar: '#050b18',
    border: '#1a2c4d', input: '#0e1c36',
    textPrimary: '#e8f1ff', textSecondary: '#8aa5d6', textInverse: '#050b18',
    link: '#00e5ff', success: '#00e676', warning: '#ffca28', danger: '#ff5252',
  }),
  t('crimson-charcoal', 'Crimson & Charcoal', 'dark', {
    primary: '#dc143c', primaryHover: '#ff2d55', secondary: '#3a3a3a', accent: '#ff5470',
    background: '#161616', surface: '#1e1e1e', card: '#242424', header: '#161616', sidebar: '#161616',
    border: '#333333', input: '#242424',
    textPrimary: '#f2f2f2', textSecondary: '#a3a3a3', textInverse: '#161616',
    link: '#ff5470', success: '#4ade80', warning: '#fbbf24', danger: '#dc143c',
  }),
  t('black-lime', 'Black + Lime', 'dark', {
    primary: '#c6ff00', primaryHover: '#e0ff66', secondary: '#2e2e2e', accent: '#aeea00',
    background: '#0b0b0b', surface: '#141414', card: '#1a1a1a', header: '#0b0b0b', sidebar: '#0b0b0b',
    border: '#2b2b2b', input: '#1a1a1a',
    textPrimary: '#f2ffe0', textSecondary: '#9fb388', textInverse: '#0b0b0b',
    link: '#c6ff00', success: '#c6ff00', warning: '#ffd600', danger: '#ff5252',
  }),
  t('deep-teal', 'Deep Teal', 'dark', {
    primary: '#14b8a6', primaryHover: '#2dd4bf', secondary: '#134e4a', accent: '#5eead4',
    background: '#04120f', surface: '#081e19', card: '#0c2a23', header: '#04120f', sidebar: '#04120f',
    border: '#123b32', input: '#0c2a23',
    textPrimary: '#e2fbf6', textSecondary: '#7fbcae', textInverse: '#04120f',
    link: '#5eead4', success: '#2dd4bf', warning: '#fbbf24', danger: '#f87171',
  }),
  t('white-royal-blue', 'White + Royal Blue', 'light', {
    primary: '#1e3a8a', primaryHover: '#1e2f6b', secondary: '#3b82f6', accent: '#2563eb',
    background: '#ffffff', surface: '#f8fafc', card: '#ffffff', header: '#ffffff', sidebar: '#ffffff',
    border: '#dbe4f3', input: '#ffffff',
    textPrimary: '#0f172a', textSecondary: '#475569', textInverse: '#ffffff',
    link: '#1e3a8a', success: '#16a34a', warning: '#d97706', danger: '#dc2626',
  }),

  // ── Crazy experimental themes ────────────────────────────────────────
  t('synthwave', 'Synthwave', 'dark', {
    primary: '#ff2fb2', primaryHover: '#ff6bd0', secondary: '#7b2ff7', accent: '#01ffd8',
    background: '#1a0b2e', surface: '#26123f', card: '#301a50', header: '#1a0b2e', sidebar: '#1a0b2e',
    border: '#4a2a6d', input: '#301a50',
    textPrimary: '#ffe6fb', textSecondary: '#c99ee0', textInverse: '#1a0b2e',
    link: '#01ffd8', success: '#01ffd8', warning: '#ffd60a', danger: '#ff2f6e',
  }),
  t('space-ui', 'Space UI', 'dark', {
    primary: '#7c9cff', primaryHover: '#a3b9ff', secondary: '#2d3352', accent: '#c792ea',
    background: '#05060f', surface: '#0b0e1c', card: '#111428', header: '#05060f', sidebar: '#05060f',
    border: '#20264a', input: '#111428',
    textPrimary: '#e6e9ff', textSecondary: '#8891c2', textInverse: '#05060f',
    link: '#c792ea', success: '#7ce0c3', warning: '#ffd580', danger: '#ff8080',
  }),
  t('metallic-ui', 'Metallic UI', 'light', {
    primary: '#71797e', primaryHover: '#54595d', secondary: '#c0c0c0', accent: '#b87333',
    background: '#e8e9eb', surface: '#f2f3f4', card: '#ffffff', header: '#d6d8db', sidebar: '#c8cacd',
    border: '#b5b8bc', input: '#ffffff',
    textPrimary: '#2b2e30', textSecondary: '#6b6f72', textInverse: '#ffffff',
    link: '#b87333', success: '#4a8b5c', warning: '#b8860b', danger: '#a33c3c',
  }),
  t('holographic', 'Holographic', 'dark', {
    primary: '#ff9ee5', primaryHover: '#ffc2ee', secondary: '#9ee5ff', accent: '#c2ffb0',
    background: '#0e0e17', surface: '#171726', card: '#1e1e33', header: '#0e0e17', sidebar: '#0e0e17',
    border: '#332f52', input: '#1e1e33',
    textPrimary: '#f5f0ff', textSecondary: '#b3a8d9', textInverse: '#0e0e17',
    link: '#9ee5ff', success: '#c2ffb0', warning: '#ffe29e', danger: '#ff9ea8',
  }),
  t('monochrome-bright', 'Monochrome + Bright Accent', 'light', {
    primary: '#111111', primaryHover: '#000000', secondary: '#8a8a8a', accent: '#ff2d00',
    background: '#ffffff', surface: '#f5f5f5', card: '#ffffff', header: '#ffffff', sidebar: '#111111',
    border: '#e0e0e0', input: '#ffffff',
    textPrimary: '#111111', textSecondary: '#6b6b6b', textInverse: '#ffffff',
    link: '#ff2d00', success: '#111111', warning: '#ff2d00', danger: '#ff2d00',
  }),
  t('luxury-marble', 'Luxury Marble', 'light', {
    primary: '#5a5a5a', primaryHover: '#3d3d3d', secondary: '#b8a48c', accent: '#a67c52',
    background: '#f7f5f2', surface: '#fdfcfa', card: '#ffffff', header: '#efece6', sidebar: '#e8e4dc',
    border: '#e2ddd3', input: '#ffffff',
    textPrimary: '#2c2a26', textSecondary: '#7a7468', textInverse: '#ffffff',
    link: '#a67c52', success: '#5c8a5c', warning: '#c9973f', danger: '#a8483a',
  }),
  t('dark-glow', 'Dark Mode with Glowing Accents', 'dark', {
    primary: '#39ff88', primaryHover: '#6dffab', secondary: '#1a1a1a', accent: '#00e5ff',
    background: '#050505', surface: '#0d0d0d', card: '#131313', header: '#050505', sidebar: '#050505',
    border: '#232323', input: '#131313',
    textPrimary: '#eafff2', textSecondary: '#8fae9c', textInverse: '#050505',
    link: '#00e5ff', success: '#39ff88', warning: '#ffe45e', danger: '#ff5e7a',
  }),
  t('matte-vibrant-cta', 'Matte Surfaces, Vibrant CTAs', 'light', {
    primary: '#ff3d81', primaryHover: '#e6236a', secondary: '#4b4b4b', accent: '#ffb800',
    background: '#eceae7', surface: '#f4f2ef', card: '#ffffff', header: '#e4e1dc', sidebar: '#dcd8d1',
    border: '#d3cfc7', input: '#ffffff',
    textPrimary: '#2a2a2a', textSecondary: '#6f6c68', textInverse: '#ffffff',
    link: '#ff3d81', success: '#00b894', warning: '#ffb800', danger: '#ff3d81',
  }),
  t('aurora', 'Aurora', 'dark', {
    primary: '#00ffa3', primaryHover: '#5cffc2', secondary: '#7b61ff', accent: '#00d1ff',
    background: '#04080f', surface: '#08101c', card: '#0c1626', header: '#04080f', sidebar: '#04080f',
    border: '#152439', input: '#0c1626',
    textPrimary: '#eafff8', textSecondary: '#84a8c2', textInverse: '#04080f',
    link: '#00d1ff', success: '#00ffa3', warning: '#ffd166', danger: '#ff5c8a',
  }),
];

export const findTheme = key => THEME_LIBRARY.find(t => t.key === key) || PRODUCTION_THEME;
