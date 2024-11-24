import { addDays, format } from 'date-fns';

export const generateFakeData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      salesRevenue: Math.floor(Math.random() * 1000000) + 500000,
      numberOfSellerOrders: Math.floor(Math.random() * 10) + 1,
    });
    currentDate = addDays(currentDate, 1);
  }
  return data;
};

export const fakeData = generateFakeData('2024-10-01', '2024-12-28');

