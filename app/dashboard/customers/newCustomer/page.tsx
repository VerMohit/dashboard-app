'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Container, Group } from '@mantine/core';
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
      street: '',
      city: '',
      postalCode: '',
      state: 'Select Province',
      country: '',
      notes: '',
    },

    validate: {
      firstName: isNotEmpty('First name is required'), //hasLength({ min: 2 }, 'First name must be at least 2 characters long'),
      lastName: isNotEmpty('Last name is required'), // hasLength({ min: 2 }, 'Last name must be at least 2 characters long'),
      phoneNo: isNotEmpty('Phone number is required'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
      street: isNotEmpty('Street name required'),
      city: isNotEmpty('City required'),
      postalCode: matches(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Enter valid zip/postal code'),
      country: isNotEmpty('Country is required'),
      state: isNotEmpty('Select a state/province'),
      notes: hasLength({ max: 50 }, 'Cannot exceed 50 characters'),
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
      invoiceNotes: hasLength({ max: 50 }, 'Cannot exceed 1000 characters'),
    },
  });

  const submutDataDB = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    const custFormHasErrors = customerForm.validate().hasErrors;
    const invoiceFormHasErrors = invoiceForm.validate().hasErrors;

    // When invoice and customer being added, check both form fields for errors
    const bothFormsHaveErrors = addInvoice && (custFormHasErrors || invoiceFormHasErrors);

    // When only customer being added
    const custFormHasErros = !addInvoice && custFormHasErrors;

    if (bothFormsHaveErrors || custFormHasErros) {
      return;
    }

    const baseURL = getBaseUrlClientSide();

    const response = await fetch(`${baseURL}customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: customerForm.getValues(),
        invoice: invoiceForm.getValues(),
        addInvoice, //passing in shorthand
      }),
    });

    if (!response.ok) {
      console.log(`Couldn't complete request: ${response.statusText}`);
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || response.statusText}`);
    } else {
      toast.success('Customer (and invoices) successfully saved!');
      customerForm.reset();
      invoiceForm.reset();
      setcustNoteCount(0);
      setInvNoteCount(0);
    }
  };

  const [custNoteCount, setcustNoteCount] = useState(0);
  const [invNoteCount, setInvNoteCount] = useState(0);
  const [addInvoice, setAddInvoice] = useState<boolean>(false);
  console.log(addInvoice);

  return (
    <Container>
      <form onSubmit={submutDataDB}>
        <h3>Customer Information</h3>
        <CustomerForm
          custNoteCount={custNoteCount}
          setcustNoteCount={setcustNoteCount}
          custForm={customerForm}
          formUsage="newCustomer"
        />
        {!addInvoice && (
          <Group justify="flex-end" mt="md">
            <Button type="button" onClick={() => setAddInvoice(true)}>
              Add Invoice
            </Button>
          </Group>
        )}
        {addInvoice && (
          <div>
            <h3>Invoice Information</h3>
            <InvoiceForm
              invNoteCount={invNoteCount}
              setInvNoteCount={setInvNoteCount}
              invoiceForm={invoiceForm}
            />
            <Group justify="flex-end" mt="md">
              <Button
                type="button"
                onClick={() => {
                  setAddInvoice(false);
                  invoiceForm.reset();
                }}
              >
                Remove Invoice
              </Button>
            </Group>
          </div>
        )}
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <ToastContainer position="top-center" autoClose={3500} />
    </Container>
  );
}
