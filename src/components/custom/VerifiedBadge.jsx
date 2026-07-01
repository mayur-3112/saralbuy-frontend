import { BadgeCheck } from 'lucide-react';

/**
 * "Verified Supplier" trust badge.
 *
 * Renders only when the supplier's business verification has been admin-approved
 * (status === 'verified'). Any other state = nothing — never a red X, never a
 * "pending" pill next to their name. Buyers should see a positive signal or no
 * signal at all; a negative signal on someone's profile is a UX landmine.
 *
 * The three sizes match the three places this shows up:
 *   sm  → bid cards, listing tiles       (tight rows)
 *   md  → user-profile hero, chat header (default)
 *   lg  → supplier detail modal          (marketing emphasis)
 */
const SIZES = {
  sm: { icon: 'w-3.5 h-3.5', text: 'text-[10px]', pad: 'px-1.5 py-0.5', gap: 'gap-1' },
  md: { icon: 'w-4 h-4', text: 'text-xs', pad: 'px-2 py-0.5', gap: 'gap-1' },
  lg: { icon: 'w-5 h-5', text: 'text-sm', pad: 'px-2.5 py-1', gap: 'gap-1.5' },
};

export default function VerifiedBadge({ status, size = 'md', showLabel = true, className = '' }) {
  if (status !== 'verified') return null;
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      title="This supplier's business (GSTIN/PAN) has been verified by SaralBuy"
      className={`inline-flex items-center ${s.gap} ${s.pad} ${s.text} font-bold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 ${className}`}
    >
      <BadgeCheck className={`${s.icon} shrink-0`} />
      {showLabel && <span>Verified</span>}
    </span>
  );
}
