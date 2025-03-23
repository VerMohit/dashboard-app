'use client';

import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaCheckSquare } from 'react-icons/fa';
import { HiDocumentRemove } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Container, Flex } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, matches, useForm } from '@mantine/form';
import { CustomerFormValues } from '@/app/types/customerTypes';
import CustomerForm from '@/app/ui/FormUI/CustomerForm';
import InvoiceForm, { InvoiceFormHandle } from '@/app/ui/FormUI/InvoiceForm';
import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
import styles from '../../../ui/Button.module.css';

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

  const [invoiceCount, setInvoiceCount] = useState(0);
  const invoiceFormsRef = useRef<InvoiceFormHandle[]>([]);
  const [custNoteCount, setcustNoteCount] = useState(0);
  const [addInvoice, setAddInvoice] = useState<boolean>(false);

  const addInvoiceCount = () => {
    if (invoiceCount < 2) {
      setInvoiceCount(1);
      setAddInvoice(true);
    }
  };

  const removeInvoice = (index: number) => {
    invoiceFormsRef.current.splice(index, 1);
    setInvoiceCount(0);
    setAddInvoice(false);
  };

  const submitDataDB = async (event: React.FormEvent) => {
    event.preventDefault();
    const customerValidation = customerForm.validate();

    if (customerValidation.hasErrors) {
      toast.error('Please correct errors in the customer form.');
      return;
    }

    try {
      const invoiceData = await Promise.all(
        invoiceFormsRef.current.map((form) => form?.validateAndGetValues())
      );

      const validInvoices = invoiceData.filter(Boolean);

      if (validInvoices.length !== invoiceCount) {
        toast.error('Please correct errors in all invoice forms.');
        return;
      }

      console.log('Customer Data:', customerForm.getValues());
      console.log('Invoice Data:', validInvoices);

      const baseURL = getBaseUrlClientSide();

      const response = await fetch(`${baseURL}customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerForm.getValues(),
          invoice: validInvoices,
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
        invoiceFormsRef.current.forEach((form) => form.reset());
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast.error('An error occurred during form submission.');
    }
  };

  return (
    <Container>
      <form onSubmit={submitDataDB}>
        <h3>Customer Information</h3>
        <CustomerForm
          custNoteCount={custNoteCount}
          setcustNoteCount={setcustNoteCount}
          custForm={customerForm}
          formUsage="newCustomer"
        />
        {!addInvoice && (
          <Flex mt="md" mb="md" justify="space-between" align="center">
            <Button className={styles.addInvoiceButton} type="button" onClick={addInvoiceCount}>
              <Flex gap="0.5rem" justify="center" align="center">
                <AiFillFileAdd />
                Add Invoice
              </Flex>
            </Button>
          </Flex>
        )}
        {addInvoice && (
          <div>
            <br />
            <hr />
            <h3>Invoice Information</h3>
            {Array.from({ length: invoiceCount }).map((_, index) => (
              <div key={index}>
                <InvoiceForm
                  ref={(el) => {
                    if (el) {
                      invoiceFormsRef.current[index] = el;
                    }
                  }}
                />
                <Flex mt="md" mb="md" justify="flex-start" align="center">
                  <Button
                    className={styles.removeInvoiceButton}
                    type="button"
                    onClick={() => removeInvoice(index)}
                  >
                    <Flex gap="0.5rem" justify="center" align="center">
                      <HiDocumentRemove />
                      Remove Invoice
                    </Flex>
                  </Button>
                </Flex>
              </div>
            ))}
          </div>
        )}
        <Flex mt="md" mb="md" justify="flex-end">
          <Button className={styles.submitButton} type="submit">
            <Flex gap="0.5rem" justify="center" align="center">
              <FaCheckSquare />
              Submit
            </Flex>
          </Button>
        </Flex>
      </form>
      <ToastContainer position="top-center" autoClose={3500} />
    </Container>
  );
}
