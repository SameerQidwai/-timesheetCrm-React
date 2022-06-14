import moment from 'moment'
import { message as messageAlert } from "antd";
export const Api = "http://localhost:3301/api/v1";

// export const Api = "http://onelmcrm.gaamatech.com:8000/api/v1";
// export const Api = "http://192.168.0.243:3000/api/v1"; // Shahzaib/   
// export const Api = "http://192.168.43.207:3000/api/v1"; // new Shahzaib/   
// export const Api = "https://6e21-115-186-75-92.ngrok.io/api/v1"; // Shahzaib/ tunnel   
// export const Api = "http://192.168.0.218:3301/api/v1"; // Me

// export const Api = "http://54.91.49.138:8000/api/v1"; //Test 

// export const Api = "http://192.168.0.110:3301/api/v1"; // TrunRajPal Home
// export const Api = "http://192.168.0.244:3301/api/v1"; // TrunRajPal Office


// export const Api = "http://3.239.21.153:8000/api/v1"; //live api  

export const O_STAGE = {L: 'Lead', TR: 'Tender Released', BS: 'Bid Submitted', BD: 'Bid Development'}
export const O_STATUS = {O: 'Open', L: 'Lost', P: 'Open', NB: 'Not Bid', DNP: 'Did Not Proceed', C: 'Completed'}
export const R_STATUS = { 'AP' : 'Approved', 'SB' : 'Submitted' , 'R' : 'Rejected','RJ' : 'Rejected' } //Request Status
export const STATUS_COLOR = { 'AP' : 'green', 'SB' : 'cyan' , 'RJ' : 'red', 'R': 'red' } //Request Status
export const O_TYPE = {1: 'Milestone', 2: 'Time'}
export const JOB_TYPE = { 1:"Casual", 2:"Part Time" , 3: "Full Time" }
export const DURATION = {1: "Hourly" , 2: "Daily" , 3: "Weekly" , 4: "Fortnightly" , 5: "Monthly" }
export const GENDER = {   "M" :  "Male", "F" :  "Female", "O" :  "Other" }
export const  STATES = {
  'Australian Capital Territory': 'ACT', 
  'New South Wales': 'NSW', 
  'Victoria': 'VIC', 
  'Queensland': 'QLD', 
  'South Australia': 'SA', 
  'Western Australia': 'WA', 
  'Northern Territory': 'NT', 
  'Tasmania': 'TSA'
}

export const formatCurrency = (amount) => {
    //console.log('=== === === formatCurrency === === ===');
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return  formatter.format(amount).replace(/^(\D+)/, '$1 ');
}; //end


export const formatDate = (date, format) =>{
  return date && moment(date).format(format ??'ddd DD MMM yyyy')
}

export const dateWithoutUtc = (date) =>{
  return date && moment(date).startOf('day').utcOffset(0, true).format()
}

export const formatFloat = (number) =>{
  return (!isNaN(parseFloat(number))) ? parseFloat(number).toFixed(2) : '0.00'
}


// Login and Api's

export const setToken = (token) => {
  localStorage.setItem('accessToken', token?? localStore().accessToken)
  localStorage.setItem('jwtTimer', new Date().getTime())
}

export const localStore = () => {
  var archive = {}, // Notice change here    
  keys = Object.keys(localStorage),
  i = keys.length;

    while ( i-- ) {
        archive[ keys[i] ] = localStorage.getItem( keys[i] );
    }
    return archive;
}

export const jwtExpired = (message) => {
  // Authentication Expired or Invalid
  // Authorization Header is missing
  if (message === 'Authentication Expired or Invalid'){
    const { jwtExpired } = localStore()
    if (jwtExpired){
      localStorage.clear()
      window.location.href = '/login'
    }else{
      localStorage.setItem('jwtExpired', true)
    }
  }
}


export const  headers=()=>{
  return { 'content-type': 'application/json',
    'Authorization' : `${localStore().accessToken}`
  }
}

export const thumbUrl = (type) =>{
  if (type === 'pdf') {
      return "/icons/pdf.png";
  }else if ( type === 'doc' || type === 'docx'){
      return "/icons/doc.png";
  }else if ( type === 'xls' || type === 'xlsx'){
      return "/icons/xls.png";
  }else if ( type === 'ppt' || type === 'pptx'){
      return "/icons/ppt.png";
  }else if (type === 'csv'){
      return "/icons/csv.png";
  }else if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(type)){
      return "/icons/img.png"
  }else{
      return "/icons/default.png"
  }
}
 
export const apiErrorRes = (err, id, duration, style) =>{
  const {status = false, data = {} } = err?.response
  const { message, success } = data
  messageAlert.error({ 
    content: status === 400? message: 'Something Went Wrong!', 
    duration: status === 400? duration :5, 
    key: id, 
    style: style ?? {},
  })
  return { error: err.message, status, message, success };
}

export const dateRange = (current, selectedDate, isStartDate, pDates) =>{
  if (current){
    const startDate = pDates?.startDate ?? moment.subtract(10, 'years') 
    const endDate =  pDates?.endDate ?? moment.add(10, 'years')

    return (
      (isStartDate && selectedDate) ? //checking if ut call from startDate 
        (current >= selectedDate)   //disable after      
      : //checking if it call from startDate
        (current <= selectedDate) ) //disable Before  
      || 
                        // disable Before, // disable After
    (!current.isBetween(moment(startDate), moment(endDate), 'day', '[]'))
  }
}

export const getFiscalYear = (request) =>{
  let fiscalStartYear = undefined
  if (parseInt(moment().format('M'))  < 7){
      fiscalStartYear =  moment().subtract(1, 'y').format('YYYY')
  }else{
      fiscalStartYear = moment().format('YYYY')
  }
  let fiscalYear = { 
    dates : {
      start:  moment().set({month: 6, date: 1, year: fiscalStartYear}),
      end: moment().set({month: 5, date: 30, year: parseInt(fiscalStartYear )+1})
    },
    years: { start: fiscalStartYear, end: parseInt(fiscalStartYear)+1}
  }
  return fiscalYear[request]
}

export const dateRangeAfter = (current, eDate, pDates) =>{
  if (current){
    const startDate = pDates?.startDate ?? moment.subtract(10, 'years') 
    const endDate =  pDates?.endDate ?? moment.add(10, 'years')
            //disable after                                     // disable Before, // disable After
    return  (eDate && current >= eDate) || (!current.isBetween(moment(startDate), moment(endDate), 'day', '[]'))
  }
}

export const dateRangeBefore = (current, sDate, pDates) =>{
  if (current){
    const startDate = pDates?.startDate ?? moment.subtract(10, 'years') 
    const endDate =  pDates?.endDate ?? moment.add(10, 'years')
          //disable Before                                      // disable Before, // disable After
    return  (sDate && current <= sDate) || (!current.isBetween(moment(startDate), moment(endDate), 'day', '[]'))
  }
}

export const sorting = (data, key) =>{
  let sortData = data.sort(( a, b) => (a?.[key]?.toLowerCase() ?? '').localeCompare(b?.[key]?.toLowerCase()?? ''))
  return sortData
}