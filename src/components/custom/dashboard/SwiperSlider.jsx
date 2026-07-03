import { Card } from '@/components/ui/card';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SwiperSlider = ({ title, color, target, data }) => {
  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 1.2,
      spacing: 15,
    },
  });
  const navigate = useNavigate();

  return (
    <Card
      className={`shadow-none  p-5 ${target === 'bids' ? `bg-${color}-100` : `bg-${color}-50`}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center ">
        <p
          className={`font-bold text-2xl border-l-4 border-${color}-700 pl-3 tracking-tight text-${color}-700`}
        >
          {title}
        </p>
        <button
          disabled={!data.length}
          className={`text-md text-${color}-700 hover:underline  font-semibold  ${!data.length ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => {
            target === 'bids' ? navigate('/account/bid') : navigate('/account/requirements');
          }}
        >
          See All
        </button>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider  ">
        {data.length > 0 ? (
          data.map(item => (
            <div key={item._id} className="keen-slider__slide ">
              <Card className="flex flex-row items-center justify-around gap-4 p-4   border border-gray-200">
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 hidden sm:block">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between">
                  <div className="grid space-y-1 w-full">
                    <div>
                      {target === 'bids' && (
                        <p className="text-sm text-gray-500 mb-1">Dated: {item.date}</p>
                      )}
                      <p
                        className={` ${target === 'bids' ? 'text-blue-700 capitalize font-semibold' : 'cc'}`}
                      >
                        {item.category}
                      </p>
                    </div>
                    <p className="font-medium capitalize whitespace-normal line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Deliver by: <span className="font-bold">{item.deliveryDate}</span>
                    </p>
                  </div>
                </div>
                {/* Footer */}
                <div
                  className="flex flex-col h-full justify-between whitespace-nowrap"
                  style={{ height: '-webkit-fill-available' }}
                >
                  {target !== 'drafts' ? (
                    <div
                      className="text-sm cursor-pointer border rounded px-2 py-1 bg-gray-50"
                      onClick={() => {
                        navigate('/bid-overview/' + item?._id);
                      }}
                    >
                      <div className="flex gap-1 items-center">
                        <span className="hidden sm:block">Total</span>
                        Quotes:{' '}
                        <span className="font-semibold text-blue-600">{item.totalBids}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-500 mb-1">Dated: {item.date}</p>
                  )}
                  <div className="flex gap-1 items-center justify-end">
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        target === 'bids'
                          ? navigate('/product-overview?productId=' + item?.productId)
                          : navigate('/update-draft/' + item._id);
                      }}
                      className={`text-sm text-gray-600 font-semibold hover:underline  text-right underline`}
                    >
                      View {target === 'drafts' && 'Bids'}
                    </a>
                    <MoveRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="h-full w-full flex flex-col justify-center items-center py-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-200 mt-4 px-4">
            <img src="/empty-cart.webp" alt="No data" className="w-16 h-16 opacity-60 mb-2 object-contain" />
            <p className="text-slate-800 text-sm font-extrabold capitalize">
              No {target === 'bids' ? 'bids/quotes' : 'draft requirements'} registered
            </p>
            <p className="text-slate-500 text-[11px] max-w-[280px] mt-1 leading-normal">
              {target === 'bids'
                ? 'Submit quotes to active buyer requirements on the sourcing exchange board to secure deals.'
                : 'Your draft sourcing RFQs will appear here. Build a requirement and save as draft.'}
            </p>
            {target === 'bids' ? (
              <Button
                size="sm"
                onClick={() => {
                  const element = document.querySelector('[data-tour="sourcing-workspace"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="mt-3.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Browse Sourcing Exchange
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/requirement')}
                className="mt-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Post a Requirement
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SwiperSlider;
