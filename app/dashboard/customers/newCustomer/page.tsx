'use client';

import { Button, Group } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, matches, useForm } from '@mantine/form';
import { CustomerFormValues } from '@/app/types/customerTypes';
import { InvoiceFormValues } from '@/app/types/invoiceTypes';
import CustomerForm from '@/app/ui/FormUI/CustomerForm';
import InvoiceForm from '@/app/ui/FormUI/InvoicesForm';

export default function Page() {
  const validateAmountFormat = (value: string) => {
    const isValidFormat = value.match(/^\d+(\.\d{0,2})?$/);
    const isPositive = parseFloat(value) >= 0;
    return isValidFormat && isPositive ? null : 'Invalid amount format';
  };

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
    },

    validate: {
      firstName: hasLength({ min: 2 }, 'First name must be at least 2 characters long'),
      lastName: hasLength({ min: 2 }, 'Last name must be at least 2 characters long'),
      phoneNo: matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Enter valid phone number'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
      streetName: isNotEmpty('Street name missing'),
      city: isNotEmpty('City missing'),
      postalCode: matches(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Enter valid zip/postal code'),
      state: isNotEmpty('Select a state/province'),
    },
  });

  const invoiceForm = useForm<InvoiceFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      invoiceNo: '',
      amount: '',
      amountPaid: '',
      paidStatus: '',
    },

    validate: {
      invoiceNo: isNotEmpty('Invoice number must be at least 2 characters long'),
      amount: validateAmountFormat,
      amountPaid: validateAmountFormat,
      paidStatus: isNotEmpty('Select an invoice status'),
    },
  });

  const submutDataDB = () => {
    alert('Data saved!');
    console.log('customer form data: ', customerForm.getValues());
    console.log('invoice form data: ', invoiceForm.getValues());
  };

  return (
    <form onSubmit={submutDataDB}>
      <CustomerForm custForm={customerForm} />
      <InvoiceForm invoiceForm={invoiceForm} />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
