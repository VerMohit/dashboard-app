import { Flex, Pill } from '@mantine/core';
// import { CustomerRequestData } from '@/app/types/customerTypes';
// import { InvoiceRequestData } from '@/app/types/invoiceTypes';
import { FetchedCustomerAndInvoiceData } from '@/app/types/SpecializedTypes';
import {
  formatAddress,
  formatCurrency,
  formatDate,
  formatPhoneNo,
} from '@/app/utility/formatValues';
import ItemDetail from './ItemDetail';
import WidgetDisplay from './WidgetDisplay';

// type InvoiceDetailsProps = {
//   customer: CustomerRequestData;
//   invoices: InvoiceRequestData;
// };
// export default function InvoiceDetails({ customer, invoices }: InvoiceDetailsProps) {
export default function InvoiceDetails({
  customers: customer,
  invoices,
}: FetchedCustomerAndInvoiceData) {
  // make into css class
  const statusStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'Paid':
      case 'Active':
        return {
          backgroundColor: '#A5D6A7',
          textAlign: 'center',
          fontWeight: 'bold',
          width: '4rem',
          display: 'inline-block', // Ensures the text is centered
        };
      case 'Unpaid':
      case 'Inactive':
        return {
          backgroundColor: '#FFCC80',
          textAlign: 'center',
          fontWeight: 'bold',
          width: '4rem',
          display: 'inline-block',
        };
      default:
        return {};
    }
  };

  const amountDue = (parseFloat(invoices.amount) - parseFloat(invoices.amountPaid)).toFixed(2);
  return (
    <div>
      <h3>Invoice Details</h3>
      <ItemDetail label="Invoice Number" value={invoices.invoiceNumber} />
      <ItemDetail label="Date Issued" value={formatDate(invoices.invoiceDate)} />
      <Flex mb="md" align="center">
        <div style={{ fontWeight: '600', width: '150px' }}>Paid Status: </div>
        <Pill style={statusStyle(invoices.invoiceStatus)}>{invoices.invoiceStatus}</Pill>
      </Flex>
      <Flex mb="lg" justify="space-evenly" align="center">
        <WidgetDisplay widgetTitle="Total Amount" value={formatCurrency(invoices.amount)} />
        <WidgetDisplay widgetTitle="Balance Due" value={formatCurrency(amountDue)} />
      </Flex>
      <ItemDetail label="Notes" value={invoices.invoiceNotes} />
      <hr />

      <h3>Customer Details</h3>
      <ItemDetail label="Name" value={`${customer.firstName} ${customer.lastName}`} />
      <ItemDetail label="Email" value={customer.email} />
      <ItemDetail label="Phone" value={customer.phoneNo} formatMethod={formatPhoneNo} />
      <ItemDetail label="Unit Number" value={customer.unitNo} />
      <ItemDetail
        label="Address"
        value={[customer.street, customer.city, customer.postalCode, customer.state]}
        formatMethod={formatAddress}
      />
      <ItemDetail label="Country" value={customer.country} />
      <Flex mb="md" align="center">
        <div style={{ fontWeight: '600', width: '150px' }}>Customer Status: </div>
        <Pill style={statusStyle(customer.isActive ? 'Active' : 'Inactive')}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </Pill>
      </Flex>
      <ItemDetail label="Notes" value={customer.notes} />
    </div>
  );
}
