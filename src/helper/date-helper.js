const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let getTimeStampInSecondFromDate = (date) => {
  return Math.round(date / 1000);
};

let getDateFromTimeStampInSecond = (timeStampInSecond) => {
  let date = new Date(0);
  date.setUTCSeconds(timeStampInSecond);
  return date;
};

let addMinToDate = (date, min) => {
  return new Date(date.getTime() + min * 60000);
};

let addDaysToDate = (date, days) => {
  let endDate = new Date();
  endDate.setDate(date.getDate() + days);
  return endDate;
};

let getToday = () => {
  let today = new Date();
  today.setHours(9);
  return today;
};

let formatAMPM = (timestamp) => {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

let getMonthAndDay = (timestamp) => {
  let date = new Date(timestamp);
  return monthNames[date.getMonth()] + ', ' + date.getDate();
};

export {
  getTimeStampInSecondFromDate,
  addMinToDate,
  addDaysToDate,
  getToday,
  formatAMPM,
  getMonthAndDay,
  getDateFromTimeStampInSecond,
};
