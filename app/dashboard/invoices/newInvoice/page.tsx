'use client';

import { toast, ToastContainer } from 'react-toastify';
import { Button, Group } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import InvoiceForm from '@/app/ui/FormUI/InvoicesForm';
import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
import { validateAmountFormat, validateDateFormat } from '@/app/utility/validateValues';

export default function Page() {
  const invoiceForm = useForm<InvoiceFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      invoiceNo: '',
      invoiceDate: '',
      amount: '',
      amountPaid: '',
      // paidStatus: '',
    },

    validate: {
      invoiceNo: isNotEmpty('Invoice number is required'),
      invoiceDate: validateDateFormat,
      amount: validateAmountFormat,
      amountPaid: validateAmountFormat,
      // paidStatus: isNotEmpty('Select an invoice status'),
    },
  });

  const submutDataDB = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    console.log('hello');

    // Validate the input fields against the validate field
    const isInvoiceValid = invoiceForm.validate();

    if (!isInvoiceValid.hasErrors) {
      const baseURL = getBaseUrlClientSide();

      const response = await fetch(`${baseURL}customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: invoiceForm.getValues(),
        }),
      });

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        toast.success('Invoice successfully saved!');
        invoiceForm.reset();
      }
    }
  };

  return (
    <>
      <form onSubmit={submutDataDB}>
        <InvoiceForm invoiceForm={invoiceForm} />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <ToastContainer position="top-center" autoClose={3500} />
    </>
  );
}
