//Default
import { useEffect, useState } from 'react';

//Images and Banners
import smartPhoneBanner from '/image/Banners/smartPhoneBanner.png';
import raiseAQuotationBanner from '/image/Banners/raiseAQuoationBanner.png';
import { useNavigate } from 'react-router-dom';
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
      linkUrl: '/requirement',
    },
    {
      image: raiseAQuotationBanner,
      text: 'Everything You Wanna Sell, All in One Place',
      buttonLabel: 'Raise your Bids',
      header: 'Build with Confidence',
      textClass: 'banner-text-2',
      buttonClass: 'banner-button-2',
      containerClass: 'banner-content-2',
      headerClass: 'banner-header-2',
      linkUrl: '/requirement',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
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
        linkUrl: endPoint,
      }));
      console.log(response);
      setBanners(prev => [...prev, ...response]);
      console.log(banners);
    }
  }, [data]);
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNavigate = bannerDets => {
    let endPoint = bannerDets.linkUrl;
    navigate(endPoint);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [banners.length]);

  return (
    <div className="banner-slider mt-5 sm:mt-10">
      {banners.length &&
        banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className={`banner-image ${index === currentIndex ? 'active' : 'inactive'}`}
            />
            {index === currentIndex && (
              <div className={banner.containerClass}>
                {banner.header && <div className={banner.headerClass}>{banner.header}</div>}
                <div className={banner.textClass}>{banner.text}</div>
                {banner.buttonLabel && (
                  <button className={banner.buttonClass} onClick={() => handleNavigate(banner)}>
                    {banner.buttonLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Banner;
