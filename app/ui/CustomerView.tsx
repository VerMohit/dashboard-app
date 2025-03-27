'use client';

import { useRef, useState } from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import { MdCancel, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { TiUserDelete } from 'react-icons/ti';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Container, Flex } from '@mantine/core';
import { ValidationError } from '../CustomErrors/CustomErrorrs';
import { FetchedCustomerData, FetchedInvoiceData } from '../types/SpecializedTypes';
import { getBaseUrlClientSide } from '../utility/getBaseUrlClientSide';
import CustomerDetails from './DisplayDetails/CustomerDetails';
import CustomerForm, { CustomerFormHandle } from './FormUI/CustomerForm';
import styles from '../ui/Button.module.css';

type CustViewProps = {
  customerDetails: FetchedCustomerData;
  invoiceDetails: FetchedInvoiceData[];
  totalInvoiceDetails: {
    balanceDue: number;
    totalInvoices: number;
    totalUnpaidInvoices: number;
  }[];
};

export default function CustomerView({
  customerDetails,
  invoiceDetails,
  totalInvoiceDetails,
}: CustViewProps) {
  const [customer, setCustomer] = useState<FetchedCustomerData>(customerDetails);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const custFormRef = useRef<CustomerFormHandle>(null);

  const handleUpdate = async () => {
    if (custFormRef.current) {
      const updatedCustomer = await custFormRef.current.validateAndGetValues();
      if (!updatedCustomer) {
        throw new ValidationError('One or more fields have errors.');
      }

      console.log('before submission: ', updatedCustomer.phoneNo);
      const baseURL = getBaseUrlClientSide();
      const response = await fetch(`${baseURL}customers/${customer.customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedCustomer,
        }),
      });

      console.log(response.ok);

      if (!response.ok) {
        console.log(`Couldn't complete request: ${response.statusText}`);
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || response.statusText}`);
      } else {
        toast.success('Customer successfully updated!');
        custFormRef.current.reset();
        console.log(updatedCustomer.phoneNo);
        setCustomer({ ...updatedCustomer, phoneNo: `+1${updatedCustomer.phoneNo}` });
        setIsEditing(false);
      }
    }
  };

  const handleDelete = async () => {
    const baseURL = getBaseUrlClientSide();

    const response = await fetch(`${baseURL}customers/${customer.customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`Couldn't complete request: ${response.statusText}`);
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || response.statusText}`);
    } else {
      toast.success('Customer successfully soft deleted!');
    }
  };

  return (
    <Container>
      {isEditing ? (
        <div>
          <CustomerForm
            ref={custFormRef}
            customerInitialValues={{ ...customer, phoneNo: customer.phoneNo.slice(2) }}
            formUsage="newCustomer"
          />
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
              <Button className={styles.submitButton} type="button" onClick={handleUpdate}>
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
          <CustomerDetails
            customer={customer}
            invoices={invoiceDetails}
            totalInvoiceDetails={totalInvoiceDetails}
          />{' '}
          <Flex mt="md" mb="lg" justify="space-between" align="center">
            <Flex mt="md" mb="md" justify="flex-end">
              <Button className={styles.removeButton} type="button" onClick={handleDelete}>
                <Flex gap="0.5rem" justify="center" align="center">
                  <TiUserDelete />
                  Delete Customer
                </Flex>
              </Button>
            </Flex>
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
                  Update Customer
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={5000} />
    </Container>
  );
}
