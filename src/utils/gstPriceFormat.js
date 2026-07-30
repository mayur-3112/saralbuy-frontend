// Shared GST price presentation, so quoted prices never render as a bare
// number with no indication of whether GST is included or added on top.
// Reused across every page that shows a supplier's quoted price (buyer
// comparison, supplier's own quote review, requirement overview, bid
// history, chat quote panel).

import { currencyConvertor } from './currencyConvertor';

/**
 * @param {number} amount - the quoted amount (budgetQuation / unitPrice / etc).
 * @param {string|number} taxRate - GST percentage, e.g. "18", "5", "0", or ''/null/undefined.
 * @param {boolean} isInclusive - whether `amount` already includes GST.
 * @returns {{ primary: string, final: string|null, hasGst: boolean }}
 *   `primary` is the line to show as the main quoted price (with GST
 *   treatment noted inline). `final` is the computed final payable amount
 *   when it differs from `amount` (exclusive case) -- null when it's the
 *   same figure (inclusive case, or no GST at all) so callers don't render
 *   a redundant second line.
 */
export function formatGstPrice(amount, taxRate, isInclusive) {
  const numAmount = Number(amount) || 0;
  const rate = Number(taxRate);
  const hasGst = !!rate && rate > 0;

  if (!hasGst) {
    return { primary: currencyConvertor(numAmount), final: null, hasGst: false };
  }

  if (isInclusive) {
    return {
      primary: `${currencyConvertor(numAmount)} (Incl. ${rate}% GST)`,
      final: null,
      hasGst: true,
    };
  }

  const finalAmount = numAmount + (numAmount * rate) / 100;
  return {
    primary: `${currencyConvertor(numAmount)} + ${rate}% GST`,
    final: currencyConvertor(finalAmount),
    hasGst: true,
  };
}
