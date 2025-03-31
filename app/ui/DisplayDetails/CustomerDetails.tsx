import { Box, Container, Flex, Pill, Table, Title } from '@mantine/core';
import { FetchedCustomerData, FetchedInvoiceData } from '@/app/types/SpecializedTypes';
import {
  formatAddress,
  formatCurrency,
  formatDate,
  formatPhoneNo,
} from '@/app/utility/formatValues';
import ItemDetail from './ItemDetail';
import WidgetDisplay from './WidgetDisplay';

type CustDetailsProps = {
  customer: FetchedCustomerData;
  invoices: FetchedInvoiceData[];
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
    borderBottom: '1px solid #ddd',
    width: '500px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // make into css class
  const tableStyle: React.CSSProperties = {
    border: '3px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '310px',
    overflowY: 'auto',
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
  const rows = invoices.map((invoice) => {
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
    <div>
      <Title order={2} size="h2" mb="lg">
        Customer Details
      </Title>
      <Box px="md">
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
      </Box>

      <hr />

      <Title order={2} size="h2" mb="lg" mt="lg">
        Invoice Details
      </Title>
      <Box px="md">
        <Flex mb="lg" columnGap="5rem" justify="center" align="center" pb="md">
          <WidgetDisplay
            widgetTitle="Total No. of Invoices"
            value={totalInvoiceDetails[0].totalInvoices}
          />
          <WidgetDisplay
            widgetTitle="Total Unpaid Invoices"
            value={totalInvoiceDetails[0].totalUnpaidInvoices}
          />
          <WidgetDisplay
            widgetTitle="Amount Due"
            value={
              totalInvoiceDetails[0].balanceDue == null
                ? '$0'
                : `$${totalInvoiceDetails[0].balanceDue}`
            }
          />
        </Flex>

        <Container mt="md" style={tableStyle}>
          <Flex direction="column" style={{ position: 'relative' }}>
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
            <Box
              style={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '8px',
                backgroundColor: 'white',
                borderTop: '1px solid #ddd',
                textAlign: 'start',
                fontWeight: 600,
                color: '#9ca3af',
                zIndex: 10,
              }}
            >
              Recent 5 invoices
            </Box>
          </Flex>
        </Container>
      </Box>
    </div>
  );
}
