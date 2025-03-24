import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import { TiUserDelete } from 'react-icons/ti';
import { Button, Container, Flex, Pill, Table } from '@mantine/core';
import { CustomerRequestData } from '@/app/types/customerTypes';
import { InvoiceRequestData } from '@/app/types/invoiceTypes';
import {
  formatAddress,
  formatCurrency,
  formatDate,
  formatPhoneNo,
} from '@/app/utility/formatValues';
import ItemDetail from './ItemDetail';
import WidgetDisplay from './WidgetDisplay';

type CustDetailsProps = {
  customer: CustomerRequestData;
  invoices: InvoiceRequestData[];
  totalInvoiceDetails: {
    balanceDue: number;
    totalInvoices: number;
    totalUnpaidInvoices: number;
  }[];
};

export default function CustomerDetails({
  customer,
  invoices,
  totalInvoiceDetails,
}: CustDetailsProps) {
  // make into css class
  const rowStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid #ddd', // Separator between rows
    width: '500px',
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden', // Hide overflowed content
    textOverflow: 'ellipsis', // Add ellipsis when text overflows
  };

  // make into css class
  const tableStyle: React.CSSProperties = {
    border: '3px solid #ccc', // Border around the table
    borderRadius: '10px', // Rounded corners
    overflow: 'hidden', // Ensures border-radius is applied properly
    height: '270px', //'32vh',
    overflowY: 'auto', // Enables scrolling when content exceeds max height
  };

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

  // Displaying all invoices associated with customer
  const displayHeadings = ['Amount', 'Balance', 'Date', 'Invoice #', 'Paid Status'];
  const rows = invoices.map((invoice: InvoiceRequestData) => {
    // Skip if a customer's invoice is null - don't display in table
    if (!invoice) {
      return null;
    }
    const amountDue = (parseFloat(invoice.amount) - parseFloat(invoice.amountPaid)).toFixed(2);
    return (
      <tr key={invoice.invoiceId}>
        <td style={rowStyle}>{formatCurrency(invoice.amount)}</td>
        <td style={rowStyle}>{formatCurrency(amountDue)}</td>
        <td style={rowStyle}>{formatDate(invoice.invoiceDate)}</td>
        <td style={rowStyle}>{invoice.invoiceNumber}</td>
        <td style={rowStyle}>
          <Pill style={statusStyle(invoice.invoiceStatus)}>{invoice.invoiceStatus}</Pill>
        </td>
      </tr>
    );
  });

  console.log(customer.phoneNo);

  return (
    <div>
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
        <div style={{ fontWeight: '600', width: '150px' }}>Customer Activity: </div>
        <Pill style={statusStyle(customer.isActive ? 'Active' : 'Inactive')}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </Pill>
      </Flex>
      <ItemDetail label="Notes" value={customer.notes} />

      <hr />
      <h3>Invoice Details</h3>
      <Flex mb="lg" justify="space-evenly" align="center">
        <WidgetDisplay
          widgetTitle="Total No. of Invoices"
          value={totalInvoiceDetails[0].totalInvoices}
        />
        <WidgetDisplay
          widgetTitle="Total Unpaid Invoices"
          value={totalInvoiceDetails[0].totalUnpaidInvoices}
        />
        <WidgetDisplay widgetTitle="Amount Due" value={`$${totalInvoiceDetails[0].balanceDue}`} />
      </Flex>
      <div style={{ fontWeight: '600' }}>Recent 5 invoices:</div>
      <Container mt="md" style={tableStyle}>
        <Table stickyHeader stickyHeaderOffset={60}>
          <thead>
            <tr>
              {displayHeadings.map((heading) => (
                <th
                  key={heading}
                  style={{ textAlign: 'left', padding: '10px', borderBottom: '3px solid #ddd' }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
      {/* <br /> */}
      {/* <Flex mt="md" mb="lg" justify="space-between" align="center">
        <Flex mt="md" mb="md" justify="flex-end">
          <Button className={styles.removeButton} type="submit">
            <Flex gap="0.5rem" justify="center" align="center">
              <TiUserDelete />
              Delete Customer
            </Flex>
          </Button>
        </Flex>
        <Flex mt="md" mb="md" justify="flex-end">
          <Button className={styles.updateButton} type="submit">
            <Flex gap="0.5rem" justify="center" align="center">
              <MdOutlinePublishedWithChanges />
              Update Customer
            </Flex>
          </Button>
        </Flex>
      </Flex> */}
    </div>
  );
}
