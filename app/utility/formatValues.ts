
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


const validateAndFormatPhone = (phoneNo: string) => {
  
  const trimmedPhoneNo = phoneNo.trim();
  console.log(trimmedPhoneNo)
  
  // Check if the trimmed phone number contains only digits
  const validPhoneRegex = /^\d+$/;
  const isPhoneValid = validPhoneRegex.test(trimmedPhoneNo) && trimmedPhoneNo.length === 10;

  if (!isPhoneValid) {
    return { formattedValue: null, err: 'Invalid phone Number. Please check for errors and remove country code' };
  }

  return {formattedValue: `${trimmedPhoneNo}`, err: null };
}

const formatCapitalizeString = (str: string) => {
  const trimmedString = str.trim();

  const captialLetter = trimmedString.charAt(0).toUpperCase();
  const remainingString = trimmedString.slice(1);
  const capitalizedStr = captialLetter+remainingString;

  return {formattedValue: capitalizedStr, err: null} 
}


const formatPhoneNo = (phone: string) => {
  // console.log(phone)
  const countryCode = phone.slice(0, 2);
  const areaCode = phone.slice(2, 5);
  const exchange = phone.slice(5, 8);
  const extension = phone.slice(8);
  console.log(`${countryCode} (${areaCode})-${exchange}-${extension}`)
  return `${countryCode} (${areaCode})-${exchange}-${extension}`;
  // return `(${areaCode})-${exchange}-${extension}`;
};

const formatAddress = (
  arr: string[]
): string => {
  const [street, city, state, postalCode] = arr
  return `${street}, ${city}, ${state} ${postalCode}`;
};



export {
  formatDate, 
  formatCurrency, 
  validateAndFormatAmount, 
  validateAndFormatZip, 
  validateAndFormatPhone, 
  formatCapitalizeString, 
  formatPhoneNo,
  formatAddress
}