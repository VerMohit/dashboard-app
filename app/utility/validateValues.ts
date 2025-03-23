import { InvoiceStatus } from "@/drizzle/lib/invoiceEnum";
import { ValidationError } from "../CustomErrors/CustomErrorrs";
import { CustomerInsertValues } from "../types/customerTypes";
import { validateAndFormatPhone, validateAndFormatZip } from "./formatValues";
import { InsertedInvoice } from "../types/invoiceTypes";

const validateAmountFormat = (amountString: string) => {
  // if(amountString === "") {
  //   return null
  // }
  const isValidFormat = amountString.match(/^\d+(\.\d{0,2})?$/);
  const isPositive = parseFloat(amountString) >= 0;
  return isValidFormat && isPositive ? null : 'Invalid amount format';
};

const validateDateFormat = (dateString: string) => {
  if (dateString !== '') {
    const isValidFormat = dateString.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);

    if (!isValidFormat) {
      return 'Please ensure format must be YYYY-MM-DD';
    }

    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? null : 'Either MM or DD for the specified month is invalid';
  }

  return null;
};

const validatePaidStatus = (amountString: string, amountPaidString: string) => {
  const amount = parseFloat(amountString);
  const amountPaid = parseFloat(amountPaidString);
  if(amountPaid > amount) {
      throw new ValidationError('Amount paid cannot be greater than amount')
  }
  return (amount - amountPaid === 0) ? InvoiceStatus.Paid : InvoiceStatus.Unpaid;
}

const validateEmail = (email: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if(!emailRegex.test(email)) {
    return 'invalid email'
  }
  return null
}

const defaultLength = 255;
const shortLength = 15;
const postalCodeLength = 7;
const unitNoLength = 20;
const notesLength = 50;
const stateLength = 30;

const custParamLengths = {
  firstName: defaultLength,
  lastName: defaultLength,
  phoneNo: shortLength,
  email: defaultLength,
  companyName: defaultLength,
  unitNo: unitNoLength,
  street: defaultLength,
  city: defaultLength,
  postalCode: postalCodeLength,
  state: stateLength,
  country: defaultLength,
  notes: notesLength,
};



const validateCustomerInsertedData = (data: CustomerInsertValues): string | null => {
  const {formattedPhone, err: phoenErr} = validateAndFormatPhone(data.phoneNo);
  if(phoenErr) {
    return phoenErr;
  }

  const emailErr = validateEmail(data.email);
  if(emailErr) {
    return emailErr;
  }
 
  const {formattedzip, err: zipErr} = validateAndFormatZip(data.postalCode)
  if(zipErr) {
    return zipErr;
  }

  // Check lengths
  for(const [field, value] of Object.entries(data)) {
    if(field in custParamLengths){
      const maxLength = custParamLengths[field as keyof typeof custParamLengths]
      if(value.length > maxLength) {
        return 'One or more fields exceed the allowed length. Please shorten the input.'
      }
    }
  }

  return null;
}



const invoiceParamLengths = {
  invoiceNumber: 50,
  invoiceNotes: 1000,
};

const validateInvoiceInsertedData = (data: InsertedInvoice): string | null => {

  if(data.invoiceNumber.length > invoiceParamLengths.invoiceNumber) {
    return 'Invoice number fields exceed the allowed length. Please shorten the input.'
  }

  if(data.invoiceNotes.length > invoiceParamLengths.invoiceNotes) {
    return 'Notes fields of notes exceed the allowed length. Please shorten the input.'
  }

  const isAmountNAN = Number(data.amount)
  const isAmountPaidNAN = Number(data.amountPaid)

  if(isNaN(isAmountNAN) || isNaN(isAmountPaidNAN)) {
    return 'One or both amount values are invalid';
  }

  const amount: number = parseFloat(data.amount);
  const amountPaid: number = parseFloat(data.amountPaid);

  if(amount < 0 || amountPaid < 0){
    return 'One or both amount values cannot be less than zero'
  }

  if(amountPaid > amount) {
    return 'Amount paid cannot be greater than the invoice amount'
  }

  if(data.invoiceStatus !== "Paid" && data.invoiceStatus !== "Unpaid"){
    return 'Invoice status can only be "Paid" or "Unpaid"'
  }

  if(data.invoiceDate !== undefined) {
    const dateErr = validateDateFormat(data.invoiceDate);
    if(dateErr !== null) {
      return dateErr;
    }
  }

  return null;
}

export {validateAmountFormat, validateDateFormat, validatePaidStatus, validateCustomerInsertedData, validateInvoiceInsertedData};