import { mergeName } from '@/utils/mergerName';
import { Button } from '@/components/ui/button';
import { dateFormatter } from '@/utils/dateFormatter';
import { useNavigate } from 'react-router-dom';
import { Merge } from 'lucide-react';
const ProductCard = ({ product: item }) => {
  const navigate = useNavigate();
  return (
    <div className="p-5 bg-white rounded-[5px] shadow-lg ">
      <div className="flex justify-between items-center  mb-4 ">
        <span className="border-2 border-gray-600 rounded-full text-gray-700 inline-block p-1  text-center px-4 text-sm font-medium capitalize">
          {' '}
          {item?.productId?.categoryId?.categoryName || item?.categoryId?.categoryName}
        </span>
        {item?.productId?.isMergeQuote && (
          <Merge className="w-9 h-9  bg-orange-100 text-orange-500 rounded-full p-2" />
        )}
      </div>
      {/* image */}
      <div className="flex flex-row justify-start items-center gap-x-6">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={item?.productId?.image || item?.image || '/no-image.webp'}
            alt={item?.productId?.title || item?.title || 'No Image'}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h2 className="font-bold text-md text-gray-700 capitalize ">
            {item?.productId?.title || item?.title}
          </h2>

          <div className="flex items-center text-sm text-gray-700 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>{' '}
            {mergeName(item?.buyerId)}
          </div>
          <div className="flex items-center text-sm text-gray-700 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>{' '}
            {item?.currentLocation || item?.buyerId?.address || 'N/A'}
          </div>
          {!(item?.productId?.isMultiple || item?.isMultiple) ? (
            <div className="flex items-center text-sm text-gray-700 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>{' '}
              {item?.productId?.quantity || item?.quantity} units
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-700">
              <p className="font-semibold text-orange-600 mb-1 border-b pb-1">
                {(item?.productId?.items || item?.items || []).length} Items Requested:
              </p>
              <ul className="list-disc pl-4 text-xs space-y-1">
                {(item?.productId?.items || item?.items || []).slice(0, 3).map((subItem, idx) => (
                  <li key={idx} className="truncate">
                    {subItem.subCategoryName} <span className="text-gray-400">({subItem.quantity} {subItem.quantityUnit})</span>
                  </li>
                ))}
              </ul>
              {(item?.productId?.items || item?.items || []).length > 3 && (
                <p className="text-xs text-blue-600 mt-1 italic pl-1">+ {(item?.productId?.items || item?.items || []).length - 3} more items...</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mt-3">
        <p className="text-sm text-gray-600 font-semibold ">
          Dated: {dateFormatter(item.createdAt)}
        </p>
        <Button
          onClick={() => {
            navigate(`/product-overview?productId=${item?.productId?._id || item?._id}`);
          }}
          variant="ghost"
          size="lg"
          className="border  shadow-orange-700 border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white cursor-pointer"
        >
          {item?.productId?.isMergeQuote ? 'Connect with Buyer' : ' Place Quotation'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
