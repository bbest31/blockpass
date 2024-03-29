import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'MMMM dd yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd MMM yyyy, p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function fDateYearMonthDay(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function fTimeHourMinute(date) {
  return format(new Date(date), 'HH:mm');
}

export function fDateWithTimeZone(date) {
  const formattedDate = format(new Date(date), 'MMMM d yyyy @ h:mm a');
  const timezoneAbbreviation = /\((.*)\)/.exec(new Date().toString())[1];

  return `${formattedDate} ${timezoneAbbreviation}`;
}

export function fDateTimespanWithTimeZone(start, end) {
  const formattedStart = format(new Date(start), 'MMMM d yyyy, h:mm a');
  const formattedEnd = format(new Date(end), 'h:mm a');
  const timezoneAbbreviation = /\((.*)\)/.exec(new Date().toString())[1];

  return `${formattedStart}—${formattedEnd} ${timezoneAbbreviation}`;
}