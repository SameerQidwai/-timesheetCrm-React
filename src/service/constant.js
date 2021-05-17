export const Api = "http://localhost:3301/api/v1";
// export const Api = "http://192.168.0.243:3000/api/v1";
// export const Api = "http://192.168.0.191:3301/api/v1";




export const formatCurrency = (amount) => {
    //console.log('=== === === formatCurrency === === ===');
    return String(amount).replace(/^\d+/, (amount) =>
      [...amount]
        .map(
          (digit, index, digits) =>
            (!index || (digits.length - index) % 3 ? '' : ',') + digit,
        )
        .join(''),
    );
    return  `${amount.toLocaleString()}`
  }; //end
  
// export const Api = "http://192.168.0.191:3301/api/v1";
 
