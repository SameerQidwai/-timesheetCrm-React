export const Api = "http://localhost:3301/api/v1";

// export const Api = "http://onelmcrm.gaamatech.com:8000/api/v1";
// export const Api = "http://192.168.0.243:3000/api/v1"; // Shahzaib/   
// export const Api = "http://192.168.43.207:3000/api/v1"; // new Shahzaib/   
// export const Api = "https://0dc7-42-201-227-153.ngrok.io/api/v1"; // Shahzaib/ tunnel   
// export const Api = "http://192.168.0.218:3301/api/v1"; // Me

// export const Api = "http://54.91.49.138:8000/api/v1"; //Test 

// export const Api = "http://192.168.0.110:3301/api/v1"; // TrunRajPal Home
// export const Api = "http://192.168.0.244:3301/api/v1"; // TrunRajPal Office


// export const Api = "http://3.239.21.153:8000/api/v1"; //live api  

export const O_STAGE = {L: 'Lead', TR: 'Tender Released', BS: 'Bid Submitted'}
export const O_STATUS = {O: 'Open', L: 'Lost', P: 'Open', NB: 'Not Bid', DNP: 'Did Not Proceed', C: 'Completed'}
export const R_STATUS = { 'AP' : 'Approved', 'SB' : 'Submitted' , 'R' : 'Rejected','RJ' : 'Rejected' } //Request Status
export const STATUS_COLOR = { 'AP' : 'green', 'SB' : 'cyan' , 'RJ' : 'red', 'R': 'red' } //Request Status

export const formatCurrency = (amount) => {
    //console.log('=== === === formatCurrency === === ===');
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return  formatter.format(amount).replace(/^(\D+)/, '$1 ');
}; //end


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
      console.log(`jwtExpired`, jwtExpired)
      localStorage.clear()
      window.location.href = '/login'
    }else{
      localStorage.setItem('jwtExpired', true)
    }
      // localStorage.clear()
      // window.location.href = '/login'
  }
}



// export let headers = { 'content-type': 'application/json','Authorization' : `${localStorage.getItem('accessToken')}`}

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
 
