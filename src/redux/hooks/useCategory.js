import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../slices/category.slice';
export const useCategory = () => {
  const dispatch = useDispatch();
  return () => dispatch(fetchCategories()).unwrap();
};

export const useCategoryState = () => {
  return useSelector(state => state.category);
};
