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
    <div className="px-4  bg-no-repeat z-0 bg-cover  py-10  min-h-82  max-w-7xl mx-auto">
      <div className="flex  items-center mb-4 ">
        <p className="font-bold text-3xl border-l-4 whitespace-nowrap border-gray-600 pl-3 tracking-tight text-gray-600">
          Trending Categories
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 px-5 sm:px-10 mt-8">
        {categories &&
          categories.map((category, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(category.category._id)}
              className="flex justify-center items-center py-5 px-6 bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md rounded-lg cursor-pointer transition-all"
            >
              <p className="text-slate-800 font-extrabold text-sm text-center capitalize">
                {category.category.categoryName}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrendingCategory;
