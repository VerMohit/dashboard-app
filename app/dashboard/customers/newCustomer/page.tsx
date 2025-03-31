'use client';

import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaCheckSquare } from 'react-icons/fa';
import { HiDocumentRemove } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Button, Container, Flex, Title } from '@mantine/core';
import { CustomerFormData, InvoiceFormData } from '@/app/types/SpecializedTypes';
import CustomerForm, { CustomerFormHandle } from '@/app/ui/FormUI/CustomerForm';
import InvoiceForm, { InvoiceFormHandle } from '@/app/ui/FormUI/InvoiceForm';
import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
import styles from '../../../ui/Button.module.css';

export default function Page() {
  const custFormInitialValues: CustomerFormData = {
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
  };

  const invoiceInitialValues: InvoiceFormData = {
    invoiceNumber: '',
    invoiceDate: '',
    amount: '',
    amountPaid: '',
    invoiceNotes: '',
  };

  const [invoiceCount, setInvoiceCount] = useState(0);
  const invoiceFormsRef = useRef<InvoiceFormHandle[]>([]);
  const custFormRef = useRef<CustomerFormHandle>(null);

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

    if (!custFormRef.current) {
      toast.error('An error occured while the customer form loaded.');
      return;
    }

    const customerData = await custFormRef.current.validateAndGetValues();
    if (!customerData) {
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

      console.log('Customer Data:', customerData);
      console.log('Invoice Data:', validInvoices);

      const baseURL = getBaseUrlClientSide();

      const response = await fetch(`${baseURL}customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerData,
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
        custFormRef.current.reset();
        invoiceFormsRef.current.forEach((form) => form.reset());
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast.error('An error occurred during form submission.');
    }
  };

  return (
    <Box px="md">
      <form onSubmit={submitDataDB}>
        <Title order={2} size="h1" mb="lg">
          Customer Details
        </Title>
        {/* <h3>Customer Information</h3> */}
        <CustomerForm ref={custFormRef} customerInitialValues={custFormInitialValues} />
        {!addInvoice && (
          <Flex mt="md" mb="md" justify="space-between" align="center">
            <Button className={styles.addButton} type="button" onClick={addInvoiceCount}>
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
            <Title order={2} size="h2" mt="lg" mb="lg">
              Invoice Details
            </Title>
            {Array.from({ length: invoiceCount }).map((_, index) => (
              <div key={index}>
                <InvoiceForm
                  ref={(el) => {
                    if (el) {
                      invoiceFormsRef.current[index] = el;
                    }
                  }}
                  invoiceInitialValues={invoiceInitialValues}
                />
                <Flex mt="md" mb="md" justify="flex-start" align="center">
                  <Button
                    className={styles.removeButton}
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
    </Box>
  );
}
