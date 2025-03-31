'use client';

import { useRef, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaCheckSquare } from 'react-icons/fa';
import { HiDocumentRemove } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Button, Container, Flex, Title } from '@mantine/core';
import { PrimaryInvoiceData } from '@/app/types/invoiceTypes';
import { CustomerFormData } from '@/app/types/SpecializedTypes';
import CustomerForm, { CustomerFormHandle } from '@/app/ui/FormUI/CustomerForm';
import InvoiceForm, { InvoiceFormHandle } from '@/app/ui/FormUI/InvoiceForm';
import { getBaseUrlClientSide } from '@/app/utility/getBaseUrlClientSide';
import styles from '../../../ui/Button.module.css';

export default function Page() {
  // const custFormInitialValues: CustomerFormValues = {
  // const custFormInitialValues: CustomerFormData = {
  const custFormInitialValues: CustomerFormData = {
    firstName: '',
    lastName: '',
    phoneNo: '',
    email: '',
    companyName: '',
  };

  // const invoiceInitialValues: InvoiceFormData = {
  // const invoiceInitialValues: InvoiceFormData = {
  const invoiceInitialValues: PrimaryInvoiceData = {
    invoiceNumber: '',
    invoiceDate: '',
    amount: '',
    amountPaid: '',
    invoiceNotes: '',
  };

  const [invoiceCount, setInvoiceCount] = useState(1);
  const invoiceFormsRef = useRef<InvoiceFormHandle[]>([]);
  const custFormRef = useRef<CustomerFormHandle>(null);

  const addInvoiceCount = () => {
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

    console.log('here :', custFormRef.current);

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
      //here is gere
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

      const response = await fetch(`${baseURL}invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerData,
          invoice: validInvoices,
        }),
      });

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        toast.success('Invoice(s) successfully saved!');
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
        <Title order={2} size="h2" mb="lg">
          Customer Details
        </Title>
        <CustomerForm
          ref={custFormRef}
          customerInitialValues={custFormInitialValues}
          formUsage="newInvoice"
        />
        <br />
        <hr />
        <Title order={2} size="h2" mt="lg" mb="lg">
          Invoice Details
        </Title>
        {/* <h3>Invoice Information</h3> */}
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
                  className={styles.removeButton}
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
                <Button className={styles.addButton} type="button" onClick={addInvoiceCount}>
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
    </Box>
  );
}
