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
  const disptachCategories = useCategory();
  const { categories: serverCategories } = useCategoryState();
  const data = (serverCategories && serverCategories.length > 0) ? serverCategories : FALLBACK_CATEGORIES;
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

      <h1 className="text-xl font-bold te xt-gray-700 mt-10 mb-4">Select a Category</h1>
      {currentWinSize >= 768 ? (
        <div className="grid grid-cols-10 gap-5 ">
          {data && data?.map(item => <ItemCard key={item._id} {...item} />)}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {data &&
            data?.map(item => (
              <AccordionItem value={item?._id} key={item._id}>
                <AccordionTrigger className="capitalize">
                  <div className="flex items-center gap-x-4">
                    <img
                      src={item?.image}
                      alt={item?.categoryName}
                      className="w-14 h-14 object-cover rounded-md"
                    />

                    <p className="text-sm font-medium capitalize">{item?.categoryName}</p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-1 pl-4">
                  {item?.subCategories?.map(sub => (
                    <p
                      onClick={() => {
                        navigate(`/category/${item?._id}/${sub._id}`);
                      }}
                      key={sub?._id}
                      className="capitalize underline text-orange-500 text-sm cursor-pointer"
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
