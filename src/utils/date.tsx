import { differenceInYears, parseISO, format } from 'date-fns';

export const formatDate = (value: string, mask?: string) => {
  if (!value) return;
  mask = mask || 'dd/MM/yyyy - HH:mm';
  const parsedDate = parseISO(value);
  return format(parsedDate, mask);
};
export const differenceBetweenYears = (value: string) => {
  if (!value) return;
  const years = differenceInYears(new Date(), parseISO(value));
  return years > 1 ? `${years} anos` : `${years} ano`;
};
