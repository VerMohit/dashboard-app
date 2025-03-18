import { Button, Container, Pill, Table } from '@mantine/core';
import { CustomerRequestData } from '@/app/types/customerTypes';
import { InvoiceRequestData } from '@/app/types/invoiceTypes';
import {
  formatAddress,
  formatCurrency,
  formatDate,
  formatPhoneNo,
} from '@/app/utility/formatValues';
import ItemDetail from './ItemDetail';

export default function CustomerDetails({
  customer,
  invoices,
  sumBalance,
  onUpdateClick,
  onDeleteClick,
}: {
  customer: CustomerRequestData;
  invoices: InvoiceRequestData[];
  sumBalance: number;
  onUpdateClick: () => void;
  onDeleteClick: () => void;
}) {
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
    height: '30vh',
    overflowY: 'auto', // Enables scrolling when content exceeds max height
  };

  // make into css class
  const statusStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'Paid':
        return {
          backgroundColor: '#A5D6A7',
          textAlign: 'center',
          fontWeight: 'bold',
          width: '4rem',
          display: 'inline-block', // Ensures the text is centered
        };
      case 'Unpaid':
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

  return (
    <div className="customer-details">
      <h3>Customer Details</h3>
      <div className="customer-info">
        <ItemDetail label="Name" value={`${customer.firstName} ${customer.lastName}`} />
        <ItemDetail label="Email" value={customer.email} />
        <ItemDetail label="Phone" value={customer.phoneNo} formatMethod={formatPhoneNo} />
        <ItemDetail
          label="Address"
          value={[customer.street, customer.city, customer.postalCode, customer.state]}
          formatMethod={formatAddress}
        />
        <ItemDetail label="Unit Number" value={customer.unitNo} />
        <ItemDetail label="Country" value={customer.country} />
        <ItemDetail label="Customer Status" value={customer.isActive ? 'Active' : 'Inactive'} />
        <p>
          <strong>Notes:</strong>
          <br />
          {customer.notes}
        </p>
      </div>
      <h3>Invoice Details</h3>
      <p>Recent 5 invoices:</p>
      <Container style={tableStyle}>
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
      <br />
      <div
        style={{
          border: '3px solid #ccc', // Border around the table
          borderRadius: '10px',
          width: '200px',
          height: '100px',
          padding: '10px',
        }}
      >
        <strong>Remaining Balance</strong>
        <div>{sumBalance}</div>
      </div>
      <Button onClick={onUpdateClick}>Update Customer</Button>
      <Button onClick={onDeleteClick}>Delete Customer</Button>
    </div>
  );
}
