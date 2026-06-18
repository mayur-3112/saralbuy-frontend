//Default
import { useEffect, useState } from 'react';

//Images and Banners
import smartPhoneBanner from '/image/Banners/smartPhoneBanner.png';
import raiseAQuotationBanner from '/image/Banners/raiseAQuoationBanner.png';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
//Styles
import '../../../style/Banner.css';
import { useFetch } from '@/hooks/useFetch';
import bannerService from '@/services/banner.service';

const Banner = () => {
  const { fn, data } = useFetch(bannerService.getBanners);
  const [banners, setBanners] = useState([
    {
      image: smartPhoneBanner,
      text: (
        <>
          All the Latest Smartphones. One
          <br />
          Place. Smart Deals Inside!
        </>
      ),
      buttonLabel: 'Place a Requirement',
      textClass: 'banner-text-1',
      buttonClass: 'banner-button-1',
      containerClass: 'banner-content-1',
      linkUrl: '/post-requirement',
    },
    {
      image: raiseAQuotationBanner,
      text: 'Everything You Wanna Sell, All in One Place',
      buttonLabel: 'Raise Your Quotes',
      header: 'Build with Confidence',
      textClass: 'banner-text-2',
      buttonClass: 'banner-button-2',
      containerClass: 'banner-content-2',
      headerClass: 'banner-header-2',
      linkUrl: '/post-requirement',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (data) {
      const response = data.banners.map(banner => ({
        image: banner.imageUrl,
        linkUrl: banner.linkUrl,
        text: banner.title,
        buttonLabel: banner.buttonText,
        textClass: 'banner-text-1',
        buttonClass: 'banner-button-1',
        containerClass: 'banner-content-1',
        linkUrl: banner.endPoint,
      }));
      setBanners(prev => [...prev, ...response]);
    }
  }, [data]);

  useEffect(() => {
    if (!banners.length || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const handleNavigate = bannerDets => {
    let endPoint = bannerDets.linkUrl;
    navigate(endPoint);
  };

  const handlePrev = e => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = e => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [banners.length]);

  return (
    <div 
      className="banner-slider mt-5 sm:mt-10 group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {banners.length > 0 &&
        banners.map((banner, index) => (
          <div key={index} className={`banner-slide-container ${index === currentIndex ? 'block' : 'hidden'}`}>
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className="banner-image active"
            />
            <div className={`${banner.containerClass} banner-glass-card animate-fade-in`}>
              {banner.header && (
                <div className={`${banner.headerClass} banner-header-text`}>
                  {banner.header}
                </div>
              )}
              <div className={`${banner.textClass} banner-body-text`}>
                {banner.text}
              </div>
              {banner.buttonLabel && (
                <button className={banner.buttonClass} onClick={() => handleNavigate(banner)}>
                  {banner.buttonLabel}
                </button>
              )}
            </div>
          </div>
        ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer z-10 transition-colors opacity-0 group-hover/slider:opacity-100 duration-300 shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer z-10 transition-colors opacity-0 group-hover/slider:opacity-100 duration-300 shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex ? 'bg-orange-600 w-6' : 'bg-white/50 hover:bg-white w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
