import { format } from 'date-fns';

export const formateDateNow = () => {
    const date = new Date();
    const formattedDate = format(date, 'yyyy-MM-dd HH:mm');
    return formattedDate
}