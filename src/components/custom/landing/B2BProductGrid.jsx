import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useUserState } from '../../../redux/hooks/useUser';
import { useFetch } from '@/hooks/useFetch';
import categoryService from '@/services/category.service';
import productService from '@/services/product.service';

/**
 * Category browse grid — every seeded category (real 10 from Atlas), with
 * live RFQ counts joined in from getTrendingCategory. Categories with 0
 * live RFQs show "Be the first" instead of a fake number.
 *
 * The old version was 8 hardcoded categories with photo cards, gradients,
 * and an emoji header — decorative, and the categories didn't match the
 * real DB. Now it's a functional browse aid that tells the truth.
 */
export default function B2BProductGrid({ onOpenAuth }) {
  const { user } = useUserState();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});

  const { fn: fetchAll, data: allData } = useFetch(categoryService.getCategories);
  const { fn: fetchTrending, data: trendingData } = useFetch(productService.getTrendingCategory);

  useEffect(() => { fetchAll(); fetchTrending(); }, []);

  useEffect(() => {
    if (allData) setCategories(Array.isArray(allData) ? allData : (allData?.categories || []));
  }, [allData]);

  useEffect(() => {
    if (!Array.isArray(trendingData)) return;
    const map = {};
    for (const t of trendingData) {
      const id = t.category?._id;
      if (id) map[id] = t.productCount || 0;
    }
    setCounts(map);
  }, [trendingData]);

  const handleCategoryClick = (cat) => {
    // Clicking a category BROWSES its live RFQs (ProductListing reads ?category=).
    // Previously this sent users to the post-requirement form, which is why the
    // "N live" badge felt disconnected from what the card did.
    navigate(`/product-listing?category=${cat._id}`);
  };

  if (categories.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
          What are you sourcing?
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Browse by category
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Pick a category and post a requirement — verified suppliers in that space will quote.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const count = counts[cat._id] || 0;
          const hasActivity = count > 0;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className="group text-left bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl p-4 relative"
            >
              <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
              <h3 className="font-black text-sm text-slate-900 leading-snug pr-6">
                {cat.categoryName}
              </h3>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                {hasActivity ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {count} live
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {count === 1 ? 'RFQ' : 'RFQs'}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Be the first
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
