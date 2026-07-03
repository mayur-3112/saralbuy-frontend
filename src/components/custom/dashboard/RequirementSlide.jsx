import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import ProductCard from './ProductCard';
import requirementService from '@/services/requirement.service';
// in Dashboard using
const RequirementSlide = () => {
  const { fn: recenReqFn, data: recentReqRes } = useFetch(requirementService.getRecentRequiremnts);
  useEffect(() => {
    recenReqFn();
  }, []);

  return (
    <div
      className={` px-8 sm:px-16 relative bg-no-repeat z-0 bg-cover  py-10  min-h-82 bg-[url('./grid.png')]`}
    >
      <div className="absolute inset-0 bg-gray-200/80 -z-[1]"></div>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <p
          className={`font-bold text-3xl  text-blue-700 border-l-5 border-blue-700 pl-3 tracking-tight`}
        >
          Recent Requirements
        </p>
        {/* {
      seeAllButton &&   <button className="text-md text-blue-600 hover:underline font-semibold">
          See All
        </button>
     } */}
      </div>

      {/* Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5 max-w-7xl mx-auto sm:px-4">
        {recentReqRes && recentReqRes.map(item => <ProductCard key={item._id} product={item} />)}
      </div>
    </div>
  );
};

export default RequirementSlide;
