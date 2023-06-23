import { format, formatDistanceToNow } from 'date-fns';


export const API_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ssX";
// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}
