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



const Requirement = () => {
  const [postMode, setPostMode] = useState('single');
  const disptachCategories = useCategory();
  const { categories: serverCategories, loading, error } = useCategoryState();

  const data = [...(serverCategories || [])].sort((a, b) => {
    const aOther = a.categoryName?.toLowerCase().includes('other') ? 1 : 0;
    const bOther = b.categoryName?.toLowerCase().includes('other') ? 1 : 0;
    return aOther - bOther;
  });
  const [currentWinSize, setCurrentWinSize] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleOtherClick = (e) => {
    e.preventDefault();
    const otherCategory = data?.find(c => c.categoryName.toLowerCase() === 'other');
    const otherSubCategory = otherCategory?.subCategories?.find(s => s.name.toLowerCase() === 'other');
    const catId = otherCategory?._id || 'other';
    const subId = otherSubCategory?._id || 'other';
    navigate(`/post-requirement?mode=${postMode}&cat=${catId}&sub=${subId}`);
  };

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
          <p className="text-gray-600 text-sm">what are you looking for?Provide the details to get fast, accurate quotes.</p>
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
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-slate-200 bg-white rounded-lg p-5 animate-pulse flex items-center gap-3 h-[72px]">
              <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-slate-500">
          <p className="font-medium">Could not load categories.</p>
          <button onClick={() => disptachCategories()} className="mt-2 text-orange-600 text-sm underline">Retry</button>
        </div>
      ) : currentWinSize >= 768 ? (
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
            We know not every category fits into a box. If your need doesn't match one of the
            listed options, click{' '}
            <a
              href="#"
              onClick={handleOtherClick}
              className="text-orange-600 underline cursor-pointer"
            >
              Other{' '}
            </a>{' '}
            to tell us more.
          </p>
          <button onClick={handleOtherClick} className="cursor-pointer hover:bg-orange-100 p-2 rounded-full transition-colors">
            <MoveRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Requirement;
