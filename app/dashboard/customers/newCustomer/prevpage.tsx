//DELTE ONCE THE page.tsx works!!!

'use client';

import { toast, ToastContainer } from 'react-toastify';
import { Button, Group } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, matches, useForm } from '@mantine/form';
import { CustomerFormValues } from '@/app/types/customerTypes';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import CustomerForm from '@/app/ui/FormUI/CustomerForm';
import InvoiceForm from '@/app/ui/FormUI/InvoicesForm';
import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
import { validateAmountFormat, validateDateFormat } from '@/app/utility/validateValues';

export default function Page() {
  const customerForm = useForm<CustomerFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNo: '',
      email: '',
      companyName: '',
      unitNo: '',
      streetName: '',
      city: '',
      postalCode: '',
      state: '',
      country: '',
      notes: '',
    },

    validate: {
      firstName: hasLength({ min: 2 }, 'First name must be at least 2 characters long'),
      lastName: hasLength({ min: 2 }, 'Last name must be at least 2 characters long'),
      phoneNo: isNotEmpty('Phone number is missing'), //matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Enter valid phone number'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
      streetName: isNotEmpty('Street name missing'),
      city: isNotEmpty('City missing'),
      postalCode: matches(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Enter valid zip/postal code'),
      country: isNotEmpty('Country is missing'),
      state: isNotEmpty('Select a state/province'),
    },
  });

  const invoiceForm = useForm<InvoiceFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      invoiceNo: '',
      invoiceDate: '',
      amount: '',
      amountPaid: '',
      paidStatus: '',
    },

    validate: {
      invoiceNo: isNotEmpty('Invoice number is empty'),
      invoiceDate: validateDateFormat,
      amount: validateAmountFormat,
      amountPaid: validateAmountFormat,
      paidStatus: isNotEmpty('Select an invoice status'),
    },
  });

  const submutDataDB = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    const baseURL = getBaseUrlClientSide();

    const postCustResp = await fetch(`${baseURL}customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: customerForm.getValues(),
        invoice: invoiceForm.getValues(),
      }),
    });

    if (!postCustResp.ok) {
      console.log(`Couldn't complete request: ${postCustResp.statusText}`);
      const errorData = await postCustResp.json();
      if (postCustResp.status === 409) {
        toast.error(errorData.message);
      } else {
        toast.error(`Error: ${errorData.message || postCustResp.statusText}`);
      }
    } else {
      toast.success('Customer (and invoices) successfully saved!');
      // customerForm.reset();
      // invoiceForm.reset();
    }
  };

  return (
    <>
      <form onSubmit={submutDataDB}>
        <CustomerForm custForm={customerForm} />
        <InvoiceForm invoiceForm={invoiceForm} />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
}
