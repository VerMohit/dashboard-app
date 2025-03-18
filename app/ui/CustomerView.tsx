'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { InvoiceRequestData } from '@/app/types/invoiceTypes';
import { CustomerRequestData } from '../types/customerTypes';
import { getBaseUrlClientSide } from '../utility/getBaseUrlClientSide';
import CustomerDetails from './DisplayDetails/CustomerDetails';

export default function CustomerView({
  customerDetails,
  invoiceDetails,
  sumBalance,
}: {
  customerDetails: CustomerRequestData;
  invoiceDetails: InvoiceRequestData[];
  sumBalance: number;
}) {
  //   console.log(customer);
  //   console.log(invoices);
  const [customer, setCustomer] = useState<CustomerRequestData>(customerDetails);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleUpdate = (updatedCustomer: CustomerRequestData) => {
    setCustomer(updatedCustomer);
    setIsEditing(false);
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
    <div>
      {/* <p>`customer ${customer.customerId}`</p> */}
      {isEditing ? (
        <CustomerUpdateForm //TODO: Add this
          customer={customer}
          invoices={invoiceDetails}
          onUpdate={handleUpdate}
          onCancle={() => setIsEditing(false)}
        />
      ) : (
        <CustomerDetails
          customer={customer}
          invoices={invoiceDetails}
          sumBalance={sumBalance}
          onUpdateClick={() => setIsEditing(true)}
          onDeleteClick={handleDelete}
        />
      )}
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}
