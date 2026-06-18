// import Banner from '@/components/Banner/Banner';
import ItemCard from './ItemCard';
// import { useCategoriesStore } from '@/zustand/getCategories';

import { MoveRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';

const FALLBACK_CATEGORIES = [
  {
    _id: 'cat_industrial',
    categoryName: 'industrial',
    image: '/image/Category/industrialImage.png',
    subCategories: [
      { _id: 'sub_cement', name: 'Cement' },
      { _id: 'sub_tmt', name: 'TMT Steel' },
      { _id: 'sub_bricks', name: 'Bricks & Blocks' },
      { _id: 'sub_pipes', name: 'Pipes & Fittings' },
      { _id: 'sub_other_ind', name: 'Other' },
    ],
  },
  {
    _id: 'cat_electronics',
    categoryName: 'electronics',
    image: '/image/Category/electronicsImage.png',
    subCategories: [
      { _id: 'sub_smartphones', name: 'Smartphones' },
      { _id: 'sub_tablets', name: 'Tablets' },
      { _id: 'sub_wearables', name: 'Wearables' },
      { _id: 'sub_accessories', name: 'Accessories' },
      { _id: 'sub_other_elec', name: 'Other' },
    ],
  },
  {
    _id: 'cat_fashion',
    categoryName: 'fashion',
    image: '/image/Category/fashionImage.png',
    subCategories: [
      { _id: 'sub_safety_suits', name: 'Boiler Suits' },
      { _id: 'sub_jackets', name: 'Safety Jackets' },
      { _id: 'sub_shoes', name: 'Safety Shoes' },
      { _id: 'sub_uniforms', name: 'Corporate Uniforms' },
      { _id: 'sub_other_fash', name: 'Other' },
    ],
  },
  {
    _id: 'cat_home',
    categoryName: 'home',
    image: '/image/Category/homeAppliancesImage.png',
    subCategories: [
      { _id: 'sub_appliances', name: 'Home Appliances' },
      { _id: 'sub_electrical', name: 'Electrical Switches' },
      { _id: 'sub_lighting', name: 'Industrial Lighting' },
      { _id: 'sub_other_home', name: 'Other' },
    ],
  },
  {
    _id: 'cat_furniture',
    categoryName: 'furniture',
    image: '/image/Category/furnitureImage.png',
    subCategories: [
      { _id: 'sub_chairs', name: 'Office Chairs' },
      { _id: 'sub_desks', name: 'Office Desks' },
      { _id: 'sub_cabinets', name: 'Storage Cabinets' },
      { _id: 'sub_other_furn', name: 'Other' },
    ],
  },
  {
    _id: 'cat_automobile',
    categoryName: 'automobile',
    image: '/image/Category/automobileImage.png',
    subCategories: [
      { _id: 'sub_tyres', name: 'Commercial Tyres' },
      { _id: 'sub_parts', name: 'Spare Parts' },
      { _id: 'sub_oil', name: 'Lubricants & Engine Oil' },
      { _id: 'sub_other_auto', name: 'Other' },
    ],
  },
  {
    _id: 'cat_sports',
    categoryName: 'sports',
    image: '/image/Category/sportsImage.png',
    subCategories: [
      { _id: 'sub_stationery', name: 'Office Stationery' },
      { _id: 'sub_paper', name: 'Copier Paper' },
      { _id: 'sub_fitness', name: 'Fitness Equipment' },
      { _id: 'sub_other_sports', name: 'Other' },
    ],
  },
  {
    _id: 'cat_beauty',
    categoryName: 'beauty',
    image: '/image/Category/beautyImage.png',
    subCategories: [
      { _id: 'sub_detergents', name: 'Soaps & Cleaners' },
      { _id: 'sub_sanitizer', name: 'Sanitization Goods' },
      { _id: 'sub_other_beauty', name: 'Other' },
    ],
  },
  {
    _id: 'cat_service',
    categoryName: 'service',
    image: '/image/Category/serviceImage.png',
    subCategories: [
      { _id: 'sub_logistics', name: 'Logistics & Shipping' },
      { _id: 'sub_fabrication', name: 'Metal Fabrication' },
      { _id: 'sub_other_serv', name: 'Other' },
    ],
  },
];

const Requirement = () => {
  const [postMode, setPostMode] = useState('single');
  const disptachCategories = useCategory();
  const { categories: serverCategories } = useCategoryState();
  
  // Filter out the 4 legacy test categories by name so it works on both local and live DBs
  const legacyNames = [
    'Building Materials',
    'Electrical & Lights',
    'Plumbing & Sanitary',
    'Paints & Waterproofing'
  ];
  const filteredCategories = serverCategories?.filter(cat => !legacyNames.includes(cat.categoryName));
  
  const data = (filteredCategories && filteredCategories.length > 0) ? filteredCategories : FALLBACK_CATEGORIES;
  const [currentWinSize, setCurrentWinSize] = useState(window.innerWidth);
  const navigate = useNavigate();
  useEffect(() => {
    disptachCategories();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setCurrentWinSize(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 min-h-screen relative">
      {/* <Banner /> */}

      <div className="mt-10 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div 
          className={`border-2 rounded-lg p-6 cursor-pointer shadow-sm hover:shadow-md transition-all ${
            postMode === 'single' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'
          }`}
          onClick={() => {
            setPostMode('single');
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${postMode === 'single' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h2 className={`text-xl font-bold ${postMode === 'single' ? 'text-orange-600' : 'text-gray-800'}`}>Post a Single Requirement</h2>
          </div>
          <p className="text-gray-600 text-sm">Have one specific product in mind? Fill out a simple form with your particulars.</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-6 cursor-pointer shadow-sm hover:shadow-md transition-all ${
            postMode === 'upload' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'
          }`}
          onClick={() => {
            setPostMode('upload');
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${postMode === 'upload' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
            </div>
            <h2 className={`text-xl font-bold ${postMode === 'upload' ? 'text-orange-600' : 'text-gray-800'}`}>Upload PDF Requirement</h2>
          </div>
          <p className="text-gray-600 text-sm">Have an Excel sheet, PDF, or image? Upload your document directly.</p>
        </div>
      </div>

      <h1 className="text-xl font-bold text-gray-700 mb-4">Select a Category</h1>
      {currentWinSize >= 768 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data && data?.map(item => (
            <ItemCard 
              key={item._id} 
              {...item} 
              onSelect={(catId, subId) => navigate(`/post-requirement?mode=${postMode}&cat=${catId}&sub=${subId}`)} 
            />
          ))}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {data &&
            data?.map(item => (
              <AccordionItem value={item?._id} key={item._id}>
                <AccordionTrigger className="capitalize px-4 bg-white border border-slate-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="flex items-center gap-x-4">
                    <div className="w-10 h-10 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg">
                      {item?.categoryName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold capitalize text-slate-700">{item?.categoryName}</p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-1 pl-4">
                  {item?.subCategories?.map(sub => (
                    <p
                      onClick={() => {
                        navigate(`/post-requirement?mode=${postMode}&cat=${item?._id}&sub=${sub._id}`);
                      }}
                      key={sub?._id}
                      className="capitalize text-slate-600 hover:text-orange-500 py-2 border-b border-slate-100 text-sm cursor-pointer last:border-none"
                    >
                      {sub?.name}
                    </p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      )}
      {/* looking for div */}
      <div className="bg-orange-50 p-7 rounded-[5px] my-6">
        <h1 className="text-lg font-bold text-start">Did not find what you are looking for</h1>
        <div className="flex justify-between items-center m-1">
          <p className="text-gray-500 text-sm">
            What know not every category fit into a box. if your need doesn't match one of the
            listed options. Click{' '}
            <Link
              // to={"/category/691a295d6e6c415cf765deed/691b6a586e6c415cf765def1"}
              className="text-blue-600 underline"
            >
              Other{' '}
            </Link>{' '}
            to tell us more.
          </p>
          <MoveRight className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Requirement;
