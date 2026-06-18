import { ChevronDown, Factory, Laptop, Home, Box, Wrench, Sofa, Car, Activity, ShieldCheck } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ELECTRONICS_ORDER = ['mobile', 'tablets', 'wearables', 'accessories', 'other'];

const getCategoryIcon = (categoryName) => {
  switch(categoryName.toLowerCase()) {
    case 'industrial': return <Factory className="w-6 h-6 text-orange-500" />;
    case 'electronics': return <Laptop className="w-6 h-6 text-orange-500" />;
    case 'home': return <Home className="w-6 h-6 text-orange-500" />;
    case 'furniture': return <Sofa className="w-6 h-6 text-orange-500" />;
    case 'service': return <Wrench className="w-6 h-6 text-orange-500" />;
    case 'automobile': return <Car className="w-6 h-6 text-orange-500" />;
    case 'sports': return <Activity className="w-6 h-6 text-orange-500" />;
    case 'fashion': return <ShieldCheck className="w-6 h-6 text-orange-500" />;
    case 'beauty': return <ShieldCheck className="w-6 h-6 text-orange-500" />;
    default: return <Box className="w-6 h-6 text-orange-500" />;
  }
};

const ItemCard = ({ categoryName, subCategories, _id, onSelect }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const TARGET_FIELD = 'home';
  const [innerOpen, setInnerOpen] = useState(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = e => {
      if (!e.target?.closest(`#itemcard-${_id}`)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, _id]);

  const sortedSubCategories = useMemo(() => {
    if (categoryName !== 'electronics') return subCategories;

    return [...subCategories].sort((a, b) => {
      const aIndex = ELECTRONICS_ORDER.indexOf(a.name.toLowerCase());
      const bIndex = ELECTRONICS_ORDER.indexOf(b.name.toLowerCase());
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }, [subCategories, categoryName]);

  return (
    <div className="group flex flex-col w-full relative" id={`itemcard-${_id}`}>
      {/* Card Trigger */}
      <div
        className="cursor-pointer border border-slate-200 bg-white rounded-lg p-5 hover:border-orange-500 hover:shadow-md transition-all flex justify-between items-center group"
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg group-hover:scale-110 transition-transform">
            {getCategoryIcon(categoryName)}
          </div>
          <p className="text-[14px] capitalize font-bold text-slate-800">
            {categoryName === 'beauty'
              ? 'Personal Care'
              : categoryName === 'electronics'
                ? 'Mobile, Tablet and Wearables'
                : categoryName === 'sports'
                  ? 'Sports & Stationery'
                  : categoryName === 'home'
                    ? 'Home and Electrical Appliances'
                    : categoryName === 'industrial'
                      ? 'Industrial & Construction Material'
                      : categoryName === 'furniture'
                        ? 'furniture and decor'
                        : categoryName}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 group-hover:text-orange-500 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown with scrollbar */}

      <div
        className={`
           absolute left-0 top-[105%] rounded-md z-30 w-full bg-white border border-gray-200 shadow-lg
           origin-top transition-all duration-200
          ${open ? 'max-h-56 opacity-100 scale-y-100 pointer-events-auto ' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}
        `}
      >
        <div className="overflow-y-auto max-h-56 scroll-visible">
          {sortedSubCategories.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (categoryName !== TARGET_FIELD) {
                    if (onSelect) {
                      onSelect(_id, item._id);
                    } else {
                      navigate(`/category/${_id}/${item._id}`);
                    }
                    return;
                  }
                  setInnerOpen(innerOpen === index ? null : index);
                }}
                className=" hover:bg-orange-100  dropdown-hover  data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50  gap-2  px-3 py-2 text-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ease-in-out hover:pl-5 cursor-pointer flex items-center justify-between border-b border-[1px] border-input/50 dark:border-input/30 "
              >
                <span className="text-[13px] capitalize">{item?.name || item}</span>
                {categoryName === TARGET_FIELD && (
                  <ChevronDown
                    className={`w-4 transition-transform ${innerOpen === index ? 'rotate-180' : ''}`}
                  />
                )}
              </div>

              {categoryName === TARGET_FIELD && (
                <div
                  className={`bg-gray-50 overflow-hidden transition-all duration-800 ${
                    innerOpen === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {item?.subproducts?.map((i, idx) => (
                    <div
                      onClick={() => {
                        navigate(`/category/${_id}/${item._id}`);
                      }}
                      key={idx}
                      className="hover:bg-orange-100 dropdown-hover border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50  gap-2  px-3 py-2 text-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ease-in-out hover:pl-5 cursor-pointer flex items-center justify-between border-b last:border-none"
                    >
                      <span className="text-[13px] capitalize">{i.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
