import { format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
  // output: "Dec 14, 2025 3:30 PM"
};
