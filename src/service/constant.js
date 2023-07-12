import moment from 'moment';
import 'moment-weekday-calc';
import { message as messageAlert } from 'antd';
// export const Api = 'http://localhost:3301/api/v1';

// export const Api = "http://onelmcrm.gaamatech.com:8000/api/v1";
// export const Api = "http://192.168.0.243:3000/api/v1"; // Shahzaib/
// export const Api = "http://192.168.43.207:3000/api/v1"; // new Shahzaib/
// export const Api = "https://a067-111-88-150-124.ngrok.io/api/v1"; // Shahzaib/ tunnel
// export const Api = 'http://192.168.0.147:3301/api/v1'; // Me

export const Api = 'http://3.85.204.62:8000/api/v1'; //Test
// export const Api = 'http://54.174.229.28:8000/api/v1'; //Demo...

// export const Api = "http://192.168.0.110:3301/api/v1"; // TrunRajPal Home
// export const Api = "http://192.168.0.244:3301/api/v1"; // TrunRajPal Office

// export const Api = "http://3.239.21.153:8000/api/v1"; //live api

export const O_STAGE = {
  L: 'Lead',
  TR: 'Tender Released',
  BS: 'Bid Submitted',
  BD: 'Bid Development',
};

export const O_STATUS_COLORS = {
  O: 'green',
  L: 'red',
  P: 'red',
  NB: 'red',
  DNP: 'red',
  C: 'green',
};
export const O_STATUS = {
  O: 'Open',
  L: 'Lost',
  P: 'Open',
  NB: 'Not Bid',
  DNP: 'Did Not Proceed',
  C: 'Completed',
};

export const O_PHASE = { false: 'Closed', true: 'Open' };
export const O_PHASE_COLORS = { false: 'red', true: 'green' };

export const ACTIVE_STATUS = { true: 'Active', false: 'Deactive' };
export const ACTIVE_STATUS_COLORS = { false: 'red', true: 'green' };

export const R_STATUS = {
  CM: 'Completed',
  AP: 'Approved',
  SB: 'Submitted',
  R: 'Rejected',
  RJ: 'Rejected',
}; //Request Status

export const STATUS_COLOR = { CM: 'geekblue', AP: 'green', SB: 'cyan', RJ: 'red', R: 'red' }; //Request Status

export const O_TYPE = { 1: 'Milestone', 2: 'Time' };

export const JOB_TYPE = { 1: 'Casual', 2: 'Part Time', 3: 'Full Time' };

export const BUSINESS_TYPE = {1: 'Sole Trader' , 2: 'Partnership' , 3: 'Company' , 4: 'Trust', 5:'Government'}

export const DURATION = {
  1: 'Hourly',
  2: 'Daily',
  3: 'Weekly',
  4: 'Fortnightly',
  5: 'Monthly',
};

export const GENDER = { M: 'Male', F: 'Female', O: 'Other' };

export const STATES = {
  'Australian Capital Territory': 'ACT',
  'New South Wales': 'NSW',
  Victoria: 'VIC',
  Queensland: 'QLD',
  'South Australia': 'SA',
  'Western Australia': 'WA',
  'Northern Territory': 'NT',
  Tasmania: 'TAS',
};

export const toTruncate = (num, fixed) => { //not using as for now using INTL method
  if (num && !isNaN(num)){
      return num.toString().match(new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?'))?.[0] || '0.00'
  }
  return '0.00'
}

export const formatCurrency = (amount, fixed) => { 
  //console.log('=== === === formatCurrency === === ===');
  if (!isNaN(amount)) {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: fixed??2, 
      roundingMode: 'trunc'
    });
    return formatter.format(amount).replace(/^(\D+)/, '$1 ')
    // .replace(/\D00(?=\D*$)/, ''))
  }
  // amount = toTruncate(amount, 2)
  return  '$ 0.00' ;
}; //end

export const formatFloat = (number, fixed, round) => { 
  if (round){
    return !isNaN(parseFloat(number)) ? parseFloat(number).toFixed(2) : '0.00';
  }
  return toTruncate(number, fixed || 2 )
};

// export const formatFloat = (number, fixed, round)=>{ //not using as using INTL method's trunc is still rounding off
//   if (number && !isNaN(number)){
//     var formatter = new Intl.NumberFormat('en-US', {
//       // notation: "compact",
//       // compactDisplay: "long",
//       maximumFractionDigits: fixed ?? 2, 
//       roundingMode: round ?? 'trunc'
//     });  
//     return formatter.format(number)
//   }
//   return '0.00' 
// }


// export const formatDate = (date, format) =>{
//   // return date && moment(date).format(format ??'ddd DD MMM yyyy')
//   return date && moment.utc(date).format(format ??'ddd DD MMM yyyy')
// }

export const parseDate = (date, format)=>{
    if (date){
        if (format){
            return moment.parseZone(date).format(format === true ? 'ddd DD MMM yyyy' : format)
        }
        return moment.parseZone(date)
    }
}

export const formatDate = (date, string, format) => {
  return (
    date && // check if date is not null or undefined
    (string // check if request is for string date or object
      ? format // check if format is given
        ? moment.utc(date).format(format === true ? 'ddd DD MMM yyyy' : format)
        : // check if format is true return default format or prop format
          moment(date).utcOffset(0, true).format()
          // moment.utc(date).format()
      : moment.utc(date))
  );
};

// export const momentWithoutUtc = (date) =>{
//   return date && moment.utc(date)
// }

// Login and Api's

export const setToken = (token) => {
  localStorage.setItem('accessToken', token ?? localStore().accessToken);
  localStorage.setItem('jwtTimer', new Date().getTime());
};

export const localStore = () => {
  var archive = {}, // Notice change here
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    archive[keys[i]] = localStorage.getItem(keys[i]);
  }
  return archive;
};

// helper gunction will be using this for permissions and will change everywhere
export const getModulePermissions = (module) =>{
  let { id, permissions } = localStore() 
  const { [module]: modulePermission } = JSON.parse(permissions)
  let anyPermissions = {}
  Object.entries(modulePermission).map( ([actionKey, action]) => {
    for (const [roleKey, role] of Object.entries(action)) {
      anyPermissions[actionKey] = role
        if (role){
            break;
        }
      }
  });
  return {anyPermissions, modulePermission, userLoginId: parseInt(id)}
}

export const jwtExpired = (message) => {
  // Authentication Expired or Invalid
  // Authorization Header is missing
  if (message === 'Authentication Expired or Invalid') {
    const { jwtExpired } = localStore();
    if (jwtExpired) {
      localStorage.clear();
      window.location.href = '/login';
    } else {
      localStorage.setItem('jwtExpired', true);
    }
  }
};

export const headers = () => {
  return {
    'content-type': 'application/json',
    Authorization: `${localStore().accessToken}`,
  };
};

export const thumbUrl = (type) => {
  if (type === 'pdf') {
    return '/icons/pdf.png';
  } else if (type === 'doc' || type === 'docx') {
    return '/icons/doc.png';
  } else if (type === 'xls' || type === 'xlsx') {
    return '/icons/xls.png';
  } else if (type === 'ppt' || type === 'pptx') {
    return '/icons/ppt.png';
  } else if (type === 'csv') {
    return '/icons/csv.png';
  } else if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(type)) {
    return '/icons/img.png';
  } else {
    return '/icons/default.png';
  }
};

export const apiErrorRes = (err, id, duration, style) => {
  const { status = false, data = {} } = err?.response ?? {};
  const { message, success } = data;
  messageAlert.error({
    content: status === 400 ? message : 'Something Went Wrong!',
    duration: status === 400 ? duration : 5,
    key: id,
    style: style ?? {},
  });
  return { error: err.message, status, message, success };
};

export const dateRange = (current, selectedDate, isDate, pDates,dateFY, granularity ='[]') => {
  let  [startYear =null, endYear =null] = dateFY??[]
  if (current) {
    current = formatDate(current.format('YYYY-MM-DDTHH:mm:ss.SSSS'))
    selectedDate = selectedDate? formatDate(selectedDate.format('YYYY-MM-DDTHH:mm:ss.SSSS')):null

    const startDate =
    pDates?.startDate ?? formatDate(new Date()).subtract(10, 'years');
    const endDate = pDates?.endDate ?? formatDate(new Date()).add(10, 'years');

    return (
      (selectedDate? isDate === 'start' //checking if ut call from startDate
        ? current.isSameOrAfter(selectedDate, 'days') //disable after
        : isDate === 'end' ? current.isSameOrBefore(selectedDate, 'days') :false //checking if it call from endtDate
      : false) || //disable Before // disable Before, // disable After
      !current.isBetween(
        formatDate(startDate),
        formatDate(endDate),
        'days',
        granularity
      ) || // checking if date doesn't falls into financial year
      ((endYear ) &&
        current.isBefore(
        formatDate(endYear).format(),
        'day',
        // '()'
      ))
    );
  }
};

// export const getFiscalYear = (request) => {
//   let fiscalStartYear = undefined;
//   if (parseInt(moment().format('M')) < 7) {
//     fiscalStartYear = moment().subtract(1, 'y').format('YYYY');
//   } else {
//     fiscalStartYear = moment().format('YYYY');
//   }
//   let fiscalYear = {
//     dates: {
//       start: moment().set({ month: 6, date: 1, year: fiscalStartYear }),
//       end: moment().set({
//         month: 5,
//         date: 30,
//         year: parseInt(fiscalStartYear) + 1,
//       }),
//     },
//     years: { start: fiscalStartYear, end: parseInt(fiscalStartYear) + 1 },
//   };
//   return fiscalYear[request];
// };

export const getFiscalYear = (request, date, dateFormat) => {
  let fiscalStartYear = undefined;
  date = date ? moment(date, dateFormat) :moment()
  if (parseInt(moment(date).format('M')) < 7) {
    fiscalStartYear = moment(date).subtract(1, 'y').format('YYYY');
  } else {
    fiscalStartYear = moment(date).format('YYYY');
  }
  let fiscalYear = {
    dates: {
      start: moment(date).set({ month: 6, date: 1, year: fiscalStartYear }),
      end: moment(date).set({
        month: 5,
        date: 30,
        year: parseInt(fiscalStartYear) + 1,
      }),
    },
    years: { start: fiscalStartYear, end: parseInt(fiscalStartYear) + 1 },
  };
  return request? fiscalYear[request] : fiscalYear;
};

export const dateRangeAfter = (current, eDate, pDates) => {
  if (current) {
    const startDate = pDates?.startDate ?? moment().subtract(10, 'years');
    const endDate = pDates?.endDate ?? moment().add(10, 'years');
    //disable after                                     // disable Before, // disable After
    return (
      (eDate && current >= eDate) ||
      !current.isBetween(moment(startDate), moment(endDate), 'day', '[]')
    );
  }
};

export const dateRangeBefore = (current, sDate, pDates) => {
  if (current) {
    const startDate = pDates?.startDate ?? moment().subtract(10, 'years');
    const endDate = pDates?.endDate ?? moment().add(10, 'years');
    //disable Before                                      // disable Before, // disable After
    return (
      (sDate && current <= sDate) ||
      !current.isBetween(moment(startDate), moment(endDate), 'day', '[]')
    );
  }
};

export const sorting = (data, key) => {
  let sortData = data.sort((a, b) =>
    (a?.[key]?.toLowerCase() ?? '').localeCompare(b?.[key]?.toLowerCase() ?? '')
  );
  return sortData;
};

// for regex
export const isPhone = (phoneNumber) => {
  const cleanedPhoneNumber = phoneNumber.replace(/-|\s/g, ''); // Remove spaces and hyphens before performing test
  const pattern = new RegExp('^(?:\\+?(61))? ?(?:\\((?=.*\\)))?(0?[2-57-8])\\)? ?(\\d\\d(?:[- ](?=\\d{3})|(?!\\d\\d[- ]?\\d[- ]))\\d\\d[- ]?\\d[- ]?\\d{3})$');
  return pattern.test(cleanedPhoneNumber);
};

export const getNumberOfWeekdays = (
  startDate,
  endDate,
  exclusions = [],
  weekdays = [1, 2, 3, 4, 5]
) => {
  return formatDate(new Date()).isoWeekdayCalc({
    rangeStart: startDate,
    rangeEnd: endDate,
    weekdays: weekdays,
    exclusions: exclusions,
    //when I get holidays
  });
};

export const dateClosed = (endDate, startDate)=>{
  let isClosed = false
  let yearClosed = localStore().closedYears
    yearClosed = yearClosed ? JSON.parse(yearClosed):[]
  const [start, end]  = yearClosed
  if (end){
    if (startDate) {
      isClosed =
        moment.utc(end).isAfter(moment.utc(endDate)) &&
        moment.utc(end).isAfter(moment.utc(startDate));
    } else {
      if (endDate) {
        isClosed = moment.utc(end).isAfter(moment.utc(endDate));
      }
    }
  }
  return isClosed
}

export const disableAllFields = (fields) =>{
  return (fields??[]).map((el) => {
    if (el.key) {
      el.disabled = true;
    }
    return el;
  });
}