import { ChevronDown, Factory, Hexagon, Paintbrush, AppWindow, Droplet, Zap, Wrench, Package, Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('cement')) return <Factory className="w-6 h-6 text-blue-500" />;
  if (name.includes('steel')) return <Hexagon className="w-6 h-6 text-blue-500" />;
  if (name.includes('chemical') || name.includes('paint')) return <Paintbrush className="w-6 h-6 text-blue-500" />;
  if (name.includes('tile') || name.includes('stone')) return <AppWindow className="w-6 h-6 text-blue-500" />;
  if (name.includes('plumb')) return <Droplet className="w-6 h-6 text-blue-500" />;
  if (name.includes('electr')) return <Zap className="w-6 h-6 text-blue-500" />;
  if (name.includes('glass')) return <AppWindow className="w-6 h-6 text-blue-500" />;
  if (name.includes('plywood') || name.includes('hardware')) return <Wrench className="w-6 h-6 text-blue-500" />;
  if (name.includes('tool')) return <Wrench className="w-6 h-6 text-blue-500" />;
  if (name.includes('other')) return <Package className="w-6 h-6 text-blue-500" />;
  return <Box className="w-6 h-6 text-blue-500" />;
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



  return (
    <div className="group flex flex-col w-full h-full relative" id={`itemcard-${_id}`}>
      {/* Card Trigger */}
      <div
        className="cursor-pointer border border-slate-200 bg-white rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-center group h-full"
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
            {getCategoryIcon(categoryName)}
          </div>
          <p className="text-[14px] capitalize font-bold text-slate-800">
            {categoryName}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 group-hover:text-blue-500 ${
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
          {subCategories?.map((item, index) => (
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
                className=" hover:bg-blue-100  dropdown-hover  data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50  gap-2  px-3 py-2 text-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ease-in-out hover:pl-5 cursor-pointer flex items-center justify-between border-b border-[1px] border-input/50 dark:border-input/30 "
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
                      className="hover:bg-blue-100 dropdown-hover border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50  gap-2  px-3 py-2 text-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ease-in-out hover:pl-5 cursor-pointer flex items-center justify-between border-b last:border-none"
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
