import { useNavigate } from 'react-router-dom';

const RING_CLASS = [
  'ring-gray-600',
  'ring-gray-500',
  'ring-yellow-500',
  'ring-red-700',
  'ring-green-700',
];

const TrendingCategory = ({ categories }) => {
  const navigate = useNavigate();
  const handleNavigate = categoryId => {
    navigate(`/product-listing?category=${encodeURIComponent(categoryId)}&TOPTRENDING=true`);
  };
  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex items-center mb-6 pl-1">
        <p className="font-black text-2xl border-l-4 border-orange-600 pl-3 tracking-tight text-slate-900 uppercase">
          Trending Categories
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
        {categories &&
          categories.map((category, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(category.category._id)}
              className="group flex justify-center items-center py-6 px-5 bg-white border border-orange-100/60 hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #ffffff 85%, #fff7ed 100%)' }}
            >
              {/* Corner accent that pops on hover */}
              <div className="absolute right-0 bottom-0 w-3.5 h-3.5 bg-orange-550 scale-0 group-hover:scale-100 transition-transform duration-200 origin-bottom-right rounded-tl-md"></div>

              <p className="text-slate-800 group-hover:text-orange-700 font-extrabold text-sm text-center capitalize transition-colors duration-250">
                {category.category.categoryName}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrendingCategory;
