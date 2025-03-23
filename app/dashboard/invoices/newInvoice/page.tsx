'use client';

import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaCheckSquare } from 'react-icons/fa';
import { HiDocumentRemove } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Container, Flex } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm } from '@mantine/form';
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
    },
    validate: {
      firstName: isNotEmpty('First name is required'),
      lastName: isNotEmpty('Last name is required'),
      phoneNo: isNotEmpty('Phone number is required'),
      email: isEmail('Invalid email'),
      companyName: hasLength({ min: 2 }, 'Company name must be at least 2 characters long'),
    },
  });

  const [invoiceCount, setInvoiceCount] = useState(1);
  const invoiceFormsRef = useRef<InvoiceFormHandle[]>([]);

  const addInvoice = () => {
    if (invoiceCount < 3) {
      setInvoiceCount((prev) => prev + 1);
    }
  };

  const removeInvoice = (index: number) => {
    if (invoiceCount > 1) {
      invoiceFormsRef.current.splice(index, 1);
      setInvoiceCount((prev) => prev - 1);
    }
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

      console.log('Customer Data:', customerForm.values);
      console.log('Invoice Data:', validInvoices);

      const baseURL = getBaseUrlClientSide();

      const response = await fetch(`${baseURL}invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerForm.getValues(),
          invoice: validInvoices,
        }),
      });

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        toast.success('Invoice(s) successfully saved!');
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
        <CustomerForm custForm={customerForm} formUsage="newInvoice" />
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
            <Flex
              mt="md"
              mb="md"
              justify={
                invoiceCount > 1 && index === invoiceCount - 1 ? 'space-between' : 'flex-start'
              }
              align="center"
            >
              {invoiceCount > 1 && (
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
              )}
              {index === invoiceCount - 1 && invoiceCount < 3 && (
                <Button className={styles.addInvoiceButton} type="button" onClick={addInvoice}>
                  <Flex gap="0.5rem" justify="center" align="center">
                    <AiFillFileAdd />
                    Add Invoice
                  </Flex>
                </Button>
              )}
            </Flex>
          </div>
        ))}
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
