'use client';

import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import FormInputField from '@/app/ui/FormUI/FormInputField';
import { validateAndFormatAmount } from '@/app/utility/formatValues';

export default function InvoiceForm({
  invoiceForm,
}: {
  invoiceForm: UseFormReturnType<InvoiceFormValues>;
}) {
  // const validateAmountFormat = (value: string) => {
  //   const isValidFormat = value.match(/^\d+(\.\d{0,2})?$/);
  //   const isPositive = parseFloat(value) >= 0;

  //   return isValidFormat && isPositive ? null : 'Invalid amount format';
  // };

  // const invoiceForm = useForm({
  //   mode: 'uncontrolled',
  //   initialValues: {
  //     invoiceNo: '',
  //     amount: '',
  //     amountPaid: '',
  //     paidStatus: '',
  //   },

  //   validate: {
  //     invoiceNo: isNotEmpty('Invoice number must be at least 2 characters long'),
  //     amount: validateAmountFormat,
  //     amountPaid: validateAmountFormat,
  //     paidStatus: isNotEmpty('Select an invoice status'),
  //   },
  // });

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
      <Select
        label="Paid Status"
        placeholder="Pick current status of invoice"
        data={['Paid', 'Unpaid']}
        {...invoiceForm.getInputProps('paidStatus')}
        mt="md"
        allowDeselect
        clearable
      />

      {/* <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group> */}
    </>
  );
}
