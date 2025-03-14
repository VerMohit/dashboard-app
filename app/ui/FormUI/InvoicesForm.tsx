'use client';

import { UseFormReturnType } from '@mantine/form';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import FormInputField from '@/app/ui/FormUI/FormInputField';
import { validateAndFormatAmount } from '@/app/utility/formatValues';

export default function InvoiceForm({
  invoiceForm,
}: {
  invoiceForm: UseFormReturnType<InvoiceFormValues>;
}) {
  return (
    <>
      <FormInputField
        labelName="Invoice Number"
        placeHolder="ex. INV-001"
        formVar="invoiceNo"
        form={invoiceForm}
        description="ex. INV-001"
      />
      <FormInputField
        labelName="Issue Date"
        formVar="invoiceDate"
        form={invoiceForm}
        description="ex. YYYY-MM-DD"
      />
      <FormInputField
        labelName="Amount"
        placeHolder="0.00"
        formVar="amount"
        formatFunc={validateAndFormatAmount}
        form={invoiceForm}
      />
      <FormInputField
        labelName="Amount Paid"
        placeHolder="0.00"
        formVar="amountPaid"
        formatFunc={validateAndFormatAmount}
        form={invoiceForm}
      />
    </>
  );
}
