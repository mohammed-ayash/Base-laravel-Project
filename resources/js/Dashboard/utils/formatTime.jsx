import {format, formatDistanceToNow, isValid, parseISO} from 'date-fns'

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy')
}
export function getDateFromISO(date, defaultFormat = 'dd/MM/yyyy') {
  return isValid(parseISO(date))
    ? format(parseISO(date), defaultFormat).toString()
    : ''
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm')
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p')
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}
