'use client';

import { useRef, useState } from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import { MdCancel, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Button, Container, Flex } from '@mantine/core';
import { ValidationError } from '../CustomErrors/CustomErrorrs';
import { FetchedCustomerData, FetchedInvoiceData } from '../types/SpecializedTypes';
import { getBaseUrlClientSide } from '../utility/getBaseUrlClientSide';
import InvoiceDetails from './DisplayDetails/InvoiceDetails';
import InvoiceForm, { InvoiceFormHandle } from './FormUI/InvoiceForm';
import styles from '../ui/Button.module.css';

type CustViewProps = {
  customerDetails: FetchedCustomerData;
  invoiceDetails: FetchedInvoiceData;
  // customerDetails: CustomerRequestData;
  // invoiceDetails: InvoiceRequestData;
};

export default function InvoiceView({ customerDetails, invoiceDetails }: CustViewProps) {
  const [invoice, setInvoice] = useState<FetchedInvoiceData>(invoiceDetails);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const invoiceFormsRef = useRef<InvoiceFormHandle>(null);

  const handleUpdate = async () => {
    if (invoiceFormsRef.current) {
      const updatedInvoice = await invoiceFormsRef.current.validateAndGetValues();
      console.log(updatedInvoice);
      if (!updatedInvoice) {
        throw new ValidationError('One or more fields have errors.');
      }
      const baseURL = getBaseUrlClientSide();
      const response = await fetch(`${baseURL}invoices/${invoice.invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedInvoice,
        }),
      });

      console.log(response.ok);

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        toast.success('Customer successfully updated!');
        invoiceFormsRef.current.reset();
        setInvoice(updatedInvoice);
        setIsEditing(false);
      }
    }
  };

  const paidStatus = (amount: string, amountPaid: string) => {
    return Number(amount) - Number(amountPaid) === 0 ? 'Paid' : 'Unpaid';
  };

  return (
    <Box px="md">
      {isEditing ? (
        <div>
          <InvoiceForm ref={invoiceFormsRef} invoiceInitialValues={invoice} />
          <Flex mt="md" mb="lg" justify="space-between" align="center">
            <Flex mt="md" mb="md" justify="flex-end">
              <Button
                className={styles.removeButton}
                type="button"
                onClick={() => setIsEditing(false)}
              >
                <Flex gap="0.5rem" justify="center" align="center">
                  <MdCancel />
                  Cancel
                </Flex>
              </Button>
            </Flex>
            <Flex mt="md" mb="md" justify="flex-end">
              <Button
                // component="a"
                // href={`/dashboard/invoices/${invoice.invoiceId}`}
                className={styles.submitButton}
                type="button"
                onClick={handleUpdate}
              >
                <Flex gap="0.5rem" justify="center" align="center">
                  <FaCheckSquare />
                  Submit
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </div>
      ) : (
        <div>
          <InvoiceDetails
            customers={customerDetails}
            invoices={{
              ...invoice,
              invoiceStatus: paidStatus(invoice.amount, invoice.amountPaid),
            }}
          />
          <Flex mt="md" mb="md" justify="flex-end">
            <Button
              className={styles.updateButton}
              type="button"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <Flex gap="0.5rem" justify="center" align="center">
                <MdOutlinePublishedWithChanges />
                Update Invoice
              </Flex>
            </Button>
          </Flex>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={5000} />
    </Box>
  );
}
