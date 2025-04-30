import {getYear} from 'date-fns';

export const listYear = () => {
  const list = [];
  for (let i = 0; i <= 30; i++) {
    list.push(getYear(new Date()) - i);
  }
  return list;
};

export const capitalize = (text = '') => {
  return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
};
