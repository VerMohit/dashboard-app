import { InvoiceStatus } from "@/drizzle/lib/invoiceEnum";
import { ValidationError } from "../CustomErrors/CustomErrorrs";

const validateAmountFormat = (amountString: string) => {
    const isValidFormat = amountString.match(/^\d+(\.\d{0,2})?$/);
    const isPositive = parseFloat(amountString) >= 0;
    return isValidFormat && isPositive ? null : 'Invalid amount format';
  };

const validateDateFormat = (dateString: string) => {
  if (dateString !== '') {
    const isValidFormat = dateString.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);

    if (!isValidFormat) {
      return 'Format must be YYYY-MM-DD';
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

export {validateAmountFormat, validateDateFormat, validatePaidStatus};