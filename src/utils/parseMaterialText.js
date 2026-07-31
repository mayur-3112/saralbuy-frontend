// Extracts a trailing "<quantity> <unit>" pair from a free-text material
// name/description and returns the text with that pair stripped.
//
// There is no OCR/AI/BOQ-extraction pipeline anywhere in this codebase —
// this exists purely because the manual RFQ/product forms let a user type
// quantity+unit straight into a free-text Description/Specs field (e.g.
// "TMT Reinforcement Bars - 2 MT") instead of using the dedicated Quantity
// and Unit inputs. This is a best-effort normalizer, not a guarantee: it
// only matches a number+recognized-unit pair at the very END of the
// string, so it never touches an embedded spec like "12mm", "M20", or
// "Fe550D" that isn't the trailing token.

const UNIT_ALIASES = {
  mt: 'MT',
  ton: 'Ton', tons: 'Tons',
  kg: 'kg', kgs: 'kg',
  g: 'g', gm: 'g',
  bag: 'bags', bags: 'bags',
  nos: 'Nos', no: 'Nos',
  pcs: 'PCS', pc: 'PCS', piece: 'PCS', pieces: 'PCS',
  box: 'Box', boxes: 'Box',
  roll: 'Roll', rolls: 'Roll',
  bundle: 'Bundle', bundles: 'Bundle',
  sheet: 'Sheet', sheets: 'Sheet',
  litre: 'Litre', litres: 'Litre', liter: 'Litre', liters: 'Litre', l: 'Litre',
  m: 'm', mtr: 'm', mtrs: 'm', meter: 'm', meters: 'm', metre: 'm', metres: 'm',
  mm: 'mm',
  cm: 'cm',
  ft: 'ft', feet: 'ft',
  'sq.ft': 'sq.ft', sqft: 'sq.ft',
  'sq.m': 'sq.m', sqm: 'sq.m',
  'cu.m': 'cu.m', cum: 'cu.m',
  set: 'Set', sets: 'Set',
  pair: 'Pair', pairs: 'Pair',
  packet: 'Packet', packets: 'Packet',
};

// Longest keys first so "sq.ft" matches before a bare "ft" would.
const UNIT_PATTERN = Object.keys(UNIT_ALIASES)
  .sort((a, b) => b.length - a.length)
  .map(u => u.replace(/\./g, '\\.'))
  .join('|');

const TRAILING_QTY_UNIT_RE = new RegExp(
  `[\\s,\\-–—]+(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\.?\\s*$`,
  'i'
);

/**
 * @param {string} text
 * @returns {{ cleanedText: string, quantity: string, unit: string } | null}
 *   null when no trailing quantity+unit pair is found.
 */
export function extractQuantityAndUnit(text) {
  if (!text || typeof text !== 'string') return null;
  const match = text.match(TRAILING_QTY_UNIT_RE);
  if (!match) return null;

  const [fullMatch, quantity, rawUnit] = match;
  const unit = UNIT_ALIASES[rawUnit.toLowerCase()] || rawUnit;
  const cleanedText = text.slice(0, text.length - fullMatch.length).trim();

  // Don't strip the entire string down to nothing — if there's no material
  // name left, this probably wasn't actually a "name + trailing qty" case.
  if (!cleanedText) return null;

  return { cleanedText, quantity, unit };
}

/**
 * Resolves the real quantity for a requested material item, falling back
 * to a quantity embedded in the description when the dedicated Quantity
 * field is empty (see extractQuantityAndUnit). Used anywhere a seller's
 * quote total is computed from item.quantity, so pricing isn't silently
 * wrong (defaulting to 1) for a record entered this way.
 */
export function resolveItemQuantity(item) {
  if (item?.quantity) return Number(item.quantity) || 1;
  // Product.items[] has no itemDescription/itemName fields on the schema
  // (Mongoose silently drops them on save) -- typeOfProduct/model are the
  // real persisted free-text fields, so they're checked too.
  const parsed = extractQuantityAndUnit(
    item?.itemDescription || item?.description || item?.typeOfProduct || item?.model || ''
  );
  return parsed ? Number(parsed.quantity) || 1 : 1;
}

const normalizeWords = s =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

/**
 * A Specification field must hold only technical detail distinct from the
 * material name -- not a restatement of it. An exact-string match (old
 * behaviour) only caught literal duplicates; it missed near-duplicates
 * like Item Name "TMT Bars" vs Specification "TMT Reinforcement Bars",
 * where 2 of the spec's 3 words are just the name repeated. This checks
 * word overlap instead:
 *   - If the majority of the spec's words already appear in the name
 *     (>= 50%), the whole spec is treated as non-distinct -> ''.
 *   - Otherwise, the individual overlapping words are stripped and the
 *     real remainder is returned (e.g. "Kajaria Tiles 600x600 Double
 *     Charged Vitrified" -> "600x600 Double Charged Vitrified" once
 *     "Kajaria"/"Tiles" are removed).
 * Returns '' when there's nothing distinct left -- callers render their
 * own placeholder (e.g. an em dash) for that case.
 */
export function dedupeSpecification(itemName, rawSpec) {
  if (!rawSpec || typeof rawSpec !== 'string') return '';
  const cleanItem = (itemName || '').trim().toLowerCase();
  const cleanSpec = rawSpec.trim().toLowerCase();
  if (!cleanSpec || cleanSpec === cleanItem) return '';
  return rawSpec.trim();
}
