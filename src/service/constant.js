export const Api = "http://localhost:3301/api/v1";

// export const Api = "http://onelmcrm.gaamatech.com:8000/api/v1";
// export const Api = "http://192.168.0.243:3000/api/v1"; // Shahzaib/   
// export const Api = "http://192.168.0.191:3301/api/v1"; // Me

// export const Api = "http://54.91.49.138:8000/api/v1"; //Test api


// export const Api = "http://3.239.21.153:8000/api/v1"; //live api  

export const formatCurrency = (amount) => {
    //console.log('=== === === formatCurrency === === ===');
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return  formatter.format(amount).replace(/^(\D+)/, '$1 ');
}; //end


export const setToken = (token) =>{
  localStorage.setItem('accessToken', token?? localStore().accessToken)
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

export const headers = { 'content-type': 'application/json','Authorization' : `${localStore().accessToken}`}
 
