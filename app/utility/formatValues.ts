const formatDate = (dateString: string) => {
    const date = new Date(dateString.trim());
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

const formatCurrency = (amountString: string, currencyCode = 'CAD') => {
  const amount = parseFloat(amountString.trim());
  if (isNaN(amount)) {
    throw new Error("Invalid amount");
  }
  // API formats the number according to the specified currency and locale
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currencyCode, 
  }).format(amount);
};

const validateAndFormatAmount = (amountValue: string) => {
  const trimmedAmount = amountValue.trim();
  const isValidFormat = trimmedAmount.match(/^\d+(\.\d+)?$/);
  const isPositive = parseFloat(trimmedAmount) >= 0;

  return isValidFormat && isPositive ? 
    {formattedValue: parseFloat(trimmedAmount).toFixed(2), err: null} 
    : {formattedValue: null, err: 'Invalid formatting for amount'};
};

const validateAndFormatZip = (zipCode: string) => {
  const trimmedZip = zipCode.trim(); 

  if(trimmedZip.length < 6 || trimmedZip.length > 7) {
    return {formattedValue: null, err: 'Invalid zip/postal code'};
  }

  let formattedZip = '';
  if(trimmedZip.length === 6) {
    const firstPart = trimmedZip.slice(0, 3);
    const lastPart = trimmedZip.slice(3);
    formattedZip = `${firstPart} ${lastPart}`;
  }
  else {
    formattedZip = trimmedZip;
  }

  const isValidFormat = formattedZip.match(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/);

  return isValidFormat ? 
    {formattedValue: formattedZip.toUpperCase() , err: null} 
    : {formattedValue: null, err: 'Please check zip/postal code format'}
};

const validateAndFormatPhone = (phoneNo : string) => {
  // Replace all non-digit chars
  const cleanedPhoneNo = phoneNo.trim().replace(/\D/g, '');

  // If country code provided, then length of cleanedPhoneNo = 11
  if(cleanedPhoneNo.length < 10 || cleanedPhoneNo.length > 11) {
    return {formattedValue: null, err: 'Invalid phone number'};
  }

  return cleanedPhoneNo.length === 10 ? 
    {formattedValue: `+1${cleanedPhoneNo}`, err: null}  
    : {formattedValue: `+${cleanedPhoneNo}`, err: null} ;

  // let formattedPhoneNo = '';
  // if(cleanedPhoneNo.length === 10) {
  //   // const areaCode = cleanedPhoneNo.slice(0, 3);
  //   // const exchange = cleanedPhoneNo.slice(3, 6);
  //   // const extension = cleanedPhoneNo.slice(6);
  
  //   // formattedPhoneNo = `+1 (${areaCode}) ${exchange}-${extension}`;
  //   formattedPhoneNo = `+1${cleanedPhoneNo}`;
  // }
  // else {
  //   // const countryCode = cleanedPhoneNo[0];
  //   // const areaCode = cleanedPhoneNo.slice(1, 4);
  //   // const exchange = cleanedPhoneNo.slice(4, 7);
  //   // const extension = cleanedPhoneNo.slice(7);
  
  //   // formattedPhoneNo = `+${countryCode} (${areaCode}) ${exchange}-${extension}`;
  //   formattedPhoneNo = `+${cleanedPhoneNo}`;
  // }

  // return {formattedValue: formattedPhoneNo, err: null} 

}

const formatCapitalizeString = (str: string) => {
  const trimmedString = str.trim();

  const captialLetter = trimmedString.charAt(0).toUpperCase();
  const remainingString = trimmedString.slice(1);
  const capitalizedStr = captialLetter+remainingString;

  return {formattedValue: capitalizedStr, err: null} 
}

export {formatDate, formatCurrency, validateAndFormatAmount, validateAndFormatZip, validateAndFormatPhone, formatCapitalizeString}