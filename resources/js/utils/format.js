import { usePage } from "@inertiajs/react";
import moment from "moment"
import 'moment/dist/locale/id';
moment.locale('id');

export const dateFormat = (dateString, outputFormat = null, stringFormat = '') => {
  if (!dateString) return '-'

  return moment(dateString, stringFormat).format(outputFormat ?? "DD MMM YYYY, HH:mm")
}
export const dateTime = (data, dateStyle = "medium", timeStyle = "short") => {
  return new Date(data).toLocaleString('id-ID', {
    dateStyle,
    timeStyle
  })
}
export const date = (data, locale = 'id-ID', year = 'numeric', month = 'short', day = 'numeric') => {
  return new Date(data).toLocaleDateString(locale, {
    year,
    month,
    day,
  })
}
export const getMonth = (data, locale = 'id-ID', month = 'long') => {
  locale = locale == 'id' ? 'id-ID' : 'zh-CN'
  return new Date(data).toLocaleDateString(locale, {
    month,
  })
}

export const currency = (number, country = 'id-ID', currencyCode = 'IDR') => {
  return new Intl.NumberFormat(country, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
export const number = (number, country = 'id-ID') => {
  return new Intl.NumberFormat(country, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export const sortBy = (value, router, searchParams) => {
  const sortDirection = searchParams.get('sort') == value && searchParams.get('sortDirection') == 'asc' ? 'desc' : 'asc'
  searchParams.set("sort", value);
  searchParams.set("sortDirection", sortDirection);
  if (searchParams.get('tab')) {
    searchParams.set('tab', searchParams.get('tab'))
  }

  return router.get(`?${searchParams.toString()}`)
}
export const lastDay = function (year = null, month = null) {
  const y = year ? year : new Date().getFullYear()
  const m = month ? month : new Date().getMonth()
  return new Date(y, m, 0).getDate();
}

export const whatsappNumber = (number) => {
  if (number?.startsWith('62')) return number
  if (number?.startsWith('0')) {
    number = `62${number.substring(1)}`
  }
  return number
};

export const mimeType = (type) => {
  if (!type) return ''

  let mimeTypes = {
    'excel': '.xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv',
    'word': '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': '.pdf,application/pdf',
    'image': '.jpg,.jpeg,.png,.gif,.webp,.avif,image/jpeg,image/png,image/gif,image/webp,image/avif',
    'audio': '.mp3,.wav,audio/mpeg,audio/wav',
    'video': '.mp4,.avi,.mov,video/mp4,video/x-msvideo,video/quicktime',
    'text': '.txt,text/plain',
    'zip': '.zip,.rar,application/zip,application/x-rar-compressed',
  }

  return mimeTypes[type];
}

export const paginationNumber = (data, i) => {
  let page = (data?.current_page - 1) * data?.per_page + i + 1
  if (Number.isNaN(page)) {
    page = i + 1
  }
  return number(page)
}

export const isNumber = (value) => {
  const regex = /^\d+$/
  return regex.test(value)
}
export const dateHumanize = (date) => {
  let formated = moment(date)
  if (!formated.isValid()) return date
  return formated.fromNow()
}

export const getDurationDate = (date) => {
  const startDate = moment(date)
  if (!startDate.isValid()) {
    return date
  }

  const endDate = moment()

  const duration = moment.duration(endDate.diff(startDate))

  const years = duration.years()
  const months = duration.months()
  const days = duration.days()

  return `${years} Th, ${months} Bln, ${days} Hr`
}

export const getDurationTotal = (totalSeconds) => {
  totalSeconds = parseInt(totalSeconds, 10)
  if (Number.isNaN(totalSeconds) || totalSeconds < 0) {
    return totalSeconds;
  }

  const duration = moment.duration(totalSeconds, "seconds");

  const totalHours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  if (totalHours >= 1) {
    return `${totalHours} Jam, ${minutes} Menit`;
  } else {
    return `${minutes} Menit`;
  }
}

export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + value + expires + "; path=/";
};

export const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export const getCookie = (name) => {
  const cookieString = document.cookie;
  if (!cookieString) return null;
  const cookies = cookieString.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }

  return null;
};


export const useSearchParams = (location = null) => {
  if (!location) {
    location = usePage().props.location
  }

  const url = new URL(location)
  const params = new URLSearchParams(url.search)
  return { url, params }
}

export function slugify(text, limit = 150) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug.substring(0, limit);
}

export const jsonParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

export const flatten = (arr) => {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)
    , [])
}

export const htmlParse = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export const sortArray = (column = null, asc = true) => {
  if (!column) return () => 0;

  return (a, b) => {
    const aValue = column ? a[column] : a;
    const bValue = column ? b[column] : b;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return asc ? aValue - bValue : bValue - aValue;
    }

    return asc
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  };
};
export function getBasePageUrl(path) {
  if (!path) return null;
  const segments = path.split("/").filter(Boolean);
  const actionKeywords = ["create", "edit"];

  const lastSegment = segments[segments.length - 1];
  if (actionKeywords.includes(lastSegment)) {
    segments.pop();
  }

  const newLastSegment = segments[segments.length - 1];
  if (!isNaN(Number(newLastSegment))) {
    segments.pop();
  }

  return "/" + segments.join("/");
}

export const isFunction = (func) => {
  return func && typeof func === "function"
}

export const time = (totalSeconds) => {
  const secondsNum = parseInt(totalSeconds, 10);

  const hours = Math.floor(secondsNum / 3600);
  const minutes = Math.floor((secondsNum % 3600) / 60);
  const seconds = secondsNum % 60;

  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
