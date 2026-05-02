import { format as formatDate } from 'date-fns';

export const dateFormatter = (date, pattern = 'dd-MM-yyyy') => {
  if (!date) return 'N/A';
  return formatDate(date, pattern);
};
