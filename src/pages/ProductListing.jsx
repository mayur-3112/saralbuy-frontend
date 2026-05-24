import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FunnelIcon } from '@heroicons/react/20/solid';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import { Range } from 'react-range';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';
import productService from '@/services/product.service';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';
import { ProductListingCardSkeleton } from '@/const/CustomSkeletons';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

// ─── FilterPanel extracted OUTSIDE so it is never re-created on parent re-render ───
function FilterPanel({
  filters,
  formState,
  values,
  setValues,
  isFilterActive,
  handleRemoveFilter,
}) {
  return (
    <>
      {filters.map((section, index) =>
        section.id !== 'budget' ? (
          <Disclosure
            key={section.id ?? index}
            as="div"
            className={`border-b border-gray-200 pb-3 mt-3 DD_OPTIONS ${
              section.id === 'subCategory' && !formState.getValues('category') ? 'hidden' : 'block'
            }`}
          >
            <h3 className="-my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between py-2 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-regular text-[16px] text-orange-700">{section.name}</span>
                <span className="ml-6 flex items-center">
                  <ChevronUp aria-hidden="true" className="size-5 group-data-open:hidden" />
                  <ChevronDown aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="space-y-4">
                <Controller
                  name={section.id}
                  control={formState.control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={option.value}
                            className="border border-orange-700 focus-visible:border-orange-700 focus-visible:ring-orange-700"
                            id={`filter-${section.id}-${optionIdx}`}
                          />
                          <Label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="text-sm text-gray-700 capitalize tracking-wide"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
            </DisclosurePanel>
          </Disclosure>
        ) : (
          <Disclosure
            key={section.id ?? index}
            as="div"
            className="border-b border-gray-200 pb-3 mt-3"
          >
            <h3 className="-my-3 flow-root">
              <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-regular text-[16px] text-orange-700">{section.name}</span>
                <span className="ml-6 flex items-center">
                  <ChevronUp aria-hidden="true" className="size-5 group-data-open:hidden" />
                  <ChevronDown aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
              <div className="w-full max-w-md">
                <Range
                  values={values}
                  step={100}
                  min={0}
                  max={50001}
                  onChange={vals => setValues([Math.min(...vals), Math.max(...vals)])}
                  renderTrack={({ props, children }) => {
                    const { key, ...restProps } = props;
                    const leftPercent = (values[0] / 50001) * 100;
                    const rightPercent = (values[1] / 50001) * 100;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="h-1 w-full bg-gray-300 rounded relative"
                      >
                        <div
                          className="absolute h-1 bg-orange-700 rounded"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${rightPercent - leftPercent}%`,
                          }}
                        />
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props, index }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="w-4 h-4 border-orange-700 border-2 bg-white rounded-full flex items-center justify-center shadow"
                      />
                    );
                  }}
                />
                <div className="flex justify-between items-center mt-3 text-sm">
                  Price: ₹{values[0].toLocaleString()} –{' '}
                  {values[1] >= 50001 ? '₹50,000+' : `₹${values[1].toLocaleString()}`}
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
        )
      )}

      {isFilterActive && (
        <Button
          type="button"
          onClick={handleRemoveFilter}
          variant="ghost"
          size="lg"
          className="border w-full mt-5 border-orange-600 text-orange-600 rounded-[5px] hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
        >
          Remove Filter&apos;s
        </Button>
      )}
    </>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────
export default function ProductListing() {
  const [values, setValues] = useState([0, 50001]);
  const [filters, setFilters] = useState([
    { id: 'category', name: 'All Category', options: [] },
    { id: 'subCategory', name: 'Sub Category', options: [] },
    { id: 'budget', name: 'Budget', options: [] },
    {
      id: 'sort',
      name: 'Sort By',
      options: [
        { value: 'newly_added', label: 'Newly Added', checked: true },
        { value: 'feature', label: 'Feature', checked: false },
        { value: 'aplhabetically_a_z', label: 'Aplhabetically (A-Z)', checked: false },
        { value: 'aplhabetically_z_a', label: 'Aplhabetically (Z-A)', checked: false },
        { value: 'low_to_high', label: 'Price Low to High', checked: false },
        { value: 'high_to_low', label: 'Price High to Low', checked: false },
      ],
    },
  ]);

  const dispatachCategory = useCategory();
  const { categories: categoriesArray } = useCategoryState();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const limit = 10;

  const formState = useForm({
    defaultValues: {
      category: searchParams.get('category') || '',
      budget: searchParams.get('budget') || '',
      sort: searchParams.get('sort') || '',
      subCategory: searchParams.get('subCategory') || '',
      topTrending: searchParams.get('TOPTRENDING') === 'true' || false,
    },
  });
  const watchAll = formState.watch();

  useEffect(() => {
    dispatachCategory();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchParams(prev => {
        const p = new URLSearchParams(prev);
        watchAll.category ? p.set('category', watchAll.category) : p.delete('category');
        watchAll.subCategory ? p.set('subCategory', watchAll.subCategory) : p.delete('subCategory');
        watchAll.sort ? p.set('sort', watchAll.sort) : p.delete('sort');
        if (values[0] > 0 || values[1] < 50001) {
          p.set('min_budget', values[0].toString());
          p.set('max_budget', values[1].toString());
        } else {
          p.delete('min_budget');
          p.delete('max_budget');
        }
        return p;
      });
    }, 300);
    return () => clearTimeout(id);
  }, [watchAll.category, watchAll.sort, watchAll.subCategory, values, setSearchParams]);

  // Clear subCategory when category changes
  useEffect(() => {
    if (watchAll.category && watchAll.category !== searchParams.get('category')) {
      formState.setValue('subCategory', '');
      setSearchParams(prev => {
        const p = new URLSearchParams(prev);
        p.delete('subCategory');
        return p;
      });
    }
  }, [watchAll.category]);

  // Populate category options
  useEffect(() => {
    if (!categoriesArray?.length) return;
    setFilters(prev =>
      prev.map(s =>
        s.id === 'category'
          ? {
              ...s,
              options: categoriesArray.map(c => ({
                value: c._id,
                label: c.categoryName,
                checked: false,
              })),
            }
          : s
      )
    );
  }, [categoriesArray]);

  // Populate subCategory options
  useEffect(() => {
    const selectedCat = categoriesArray?.find(item => item._id === searchParams.get('category'));
    if (selectedCat?.subCategories?.length) {
      setFilters(prev =>
        prev.map(s =>
          s.id === 'subCategory'
            ? {
                ...s,
                options: selectedCat.subCategories.map(c => ({
                  value: c._id,
                  label: c.name,
                  checked: false,
                })),
              }
            : s
        )
      );
    }
  }, [searchParams.get('category'), categoriesArray]);

  // Fetch trigger — fires whenever any filter param changes in the URL
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchData(true);
  }, [
    searchParams.get('title'),
    searchParams.get('category'),
    searchParams.get('sort'),
    searchParams.get('min_budget'),
    searchParams.get('max_budget'),
    searchParams.get('subCategory'),
    searchParams.get('TOPTRENDING'),
  ]);

  const fetchData = async (reset = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (reset) setIsLoading(true);

    const title = searchParams.get('title') || '';
    const currentPage = reset ? 1 : page;
    const category = searchParams.get('category') || undefined;
    const subCategoryId = searchParams.get('subCategory') || undefined;
    const min_budget = searchParams.get('min_budget')
      ? Number(searchParams.get('min_budget'))
      : undefined;
    const max_budget = searchParams.get('max_budget')
      ? Number(searchParams.get('max_budget'))
      : undefined;
    const sort = searchParams.get('sort') || undefined;

    try {
      const response = await productService.getProductByTitle(title, currentPage, limit, {
        category,
        subCategoryId,
        min_budget,
        max_budget,
        sort,
      });

      const newProducts = response?.data?.data?.products || [];
      const totalCount = response?.data?.data?.total || 0;
      const totalPages = response?.data?.data?.totalPages || 1;

      setProducts(prev => (reset ? newProducts : [...prev, ...newProducts]));
      setTotal(totalCount);
      setHasMore(currentPage < totalPages);
      setPage(reset ? 2 : currentPage + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isFetchingRef.current = false;
      if (reset) setIsLoading(false);
    }
  };

  const fetchMoreData = () => fetchData(false);

  const handleRemoveFilter = () => {
    const isTopTrending = searchParams.get('TOPTRENDING') === 'true';
    setMobileFiltersOpen(false);
    formState.reset({
      category: isTopTrending ? searchParams.get('category') || '' : '',
      subCategory: '',
      sort: '',
      budget: '',
    });
    setValues([0, 50001]);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (!isTopTrending) p.delete('category');
      p.delete('subCategory');
      p.delete('min_budget');
      p.delete('max_budget');
      p.delete('sort');
      return p;
    });
  };

  const isFilterActive = !!(
    searchParams.get('category') ||
    searchParams.get('subCategory') ||
    searchParams.get('min_budget') ||
    searchParams.get('max_budget') ||
    searchParams.get('sort')
  );

  // Shared props passed down to FilterPanel
  const filterPanelProps = {
    filters,
    formState,
    values,
    setValues,
    isFilterActive,
    handleRemoveFilter,
  };

  return (
    <div className="">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden bg-white"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />
          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex bg-white size-full max-w-xs transform flex-col overflow-y-auto pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Product Listing</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50"
                >
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <form className="mt-4 border-t border-gray-200 p-6">
                <FilterPanel {...filterPanelProps} />
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-end">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            >
              <FunnelIcon aria-hidden="true" className="size-5" />
            </button>
          </div>

          <section aria-labelledby="products-heading" className="py-10">
            <div className="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-4">
              {/* Desktop filter sidebar */}
              <form className="hidden lg:block rounded-2xl p-4 shadow-xs bg-[#fcf3ed] sticky top-4 self-start">
                <FilterPanel {...filterPanelProps} />
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-2xl border-l-4 border-gray-800 pl-3 tracking-tight text-gray-800">
                    Results
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{total || 0} Requirements</p>
                </div>

                <div className="min-h-[300px]">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {new Array(6).fill(0).map((_, i) => (
                        <ProductListingCardSkeleton key={`init-skeleton-${i}`} />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex justify-center items-center h-64 flex-col space-y-2">
                      <img src="empty-cart.webp" alt="No results" className="h-28 w-28" />
                      <p className="text-lg text-center text-gray-500">No Item Found</p>
                    </div>
                  ) : (
                    <InfiniteScroll
                      dataLength={products.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {new Array(2).fill(0).map((_, i) => (
                            <ProductListingCardSkeleton key={`more-skeleton-${i}`} />
                          ))}
                        </div>
                      }
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {products.map(product => (
                        <ProductListingCard key={product._id} product={product} />
                      ))}
                    </InfiniteScroll>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
