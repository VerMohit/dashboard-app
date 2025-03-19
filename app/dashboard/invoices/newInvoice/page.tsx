'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Group } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm, UseFormReturnType } from '@mantine/form';
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
    },

    validate: {
      firstName: isNotEmpty('First name is required'), //hasLength({ min: 2 }, 'First name must be at least 2 characters long'),
      lastName: isNotEmpty('Last name is required'), // hasLength({ min: 2 }, 'Last name must be at least 2 characters long'),
      phoneNo: isNotEmpty('Phone number is required'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
    },
  });

  const invoiceForm = useForm<InvoiceFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      invoiceNo: '',
      invoiceDate: '',
      amount: '',
      amountPaid: '',
      invoiceNotes: '',
    },

    validate: {
      invoiceNo: isNotEmpty('Invoice number is required'),
      invoiceDate: validateDateFormat,
      amount: validateAmountFormat,
      amountPaid: validateAmountFormat,
    },
  });

  const submutDataDB = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Validate the input fields against the validate field
    const isCustomerValid = customerForm.validate();
    const isInvoiceValid = invoiceForm.validate();

    if (!isCustomerValid.hasErrors && !isInvoiceValid.hasErrors) {
      const baseURL = getBaseUrlClientSide();

      const response = await fetch(`${baseURL}invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerForm.getValues(),
          invoice: invoiceForm.getValues(),
        }),
      });

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        console.log(`Completed request: ${response.statusText}`);
        toast.success('Invoice successfully saved!');
        // customerForm.reset();
        // invoiceForm.reset();
      }
    }
  };

  // TODO: figure out how to dynamically add forms so it works, because atm its not!!!
  // Store state of each invoice
  const [invoiceList, setInvoiceList] = useState<
    { id: number; formData: UseFormReturnType<InvoiceFormValues> }[]
  >([{ id: 0, formData: invoiceForm }]);

  const handleAddInvoice = () => {
    return null;
    // setInvoiceList((prev) => [...prev, { id: prev.length, formData: invoiceForm }]);
  };

  const handleRemoveInvoice = (index) => {
    return null;
  };

  return (
    <>
      <form onSubmit={submutDataDB}>
        <h3>Customer Information</h3>
        <CustomerForm custForm={customerForm} formUsage="newInvoice" />
        <h3>Invoice Information</h3>
        {invoiceList.map((invoice, index) => (
          <div key={index}>
            <InvoiceForm key={index} invoiceForm={invoice.formData} />
            {invoiceList.length - 1 === index && invoiceList.length < 3 && (
              <Group justify="flex-end" mt="md">
                <Button type="button" onClick={handleAddInvoice}>
                  Add an Invoice
                </Button>
              </Group>
            )}
            {invoiceList.length > 1 && (
              <>
                <Group justify="flex-end" mt="md">
                  <Button type="button" onClick={() => handleRemoveInvoice(index)}>
                    Remove Invoice
                  </Button>
                </Group>
              </>
            )}
          </div>
        ))}
        {/* <InvoiceForm invoiceForm={invoiceForm} /> */}
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
}
