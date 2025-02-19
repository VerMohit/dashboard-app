import React from 'react';
import { Button, Container, Pill, Table } from '@mantine/core';
import { CustomerRequestData } from '../types/customerTypes';
import { InvoiceTableData } from '../types/invoiceTypes';

export function TabularDisplay({
  tableHeadings,
  data,
  dataType,
}: {
  tableHeadings: string[];
  data: CustomerRequestData[] | InvoiceTableData[];
  dataType: 'customer' | 'invoice';
}) {
  const rowStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid #ddd', // Separator between rows
    width: '500px',
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden', // Hide overflowed content
    textOverflow: 'ellipsis', // Add ellipsis when text overflows
  };

  const tableStyle: React.CSSProperties = {
    border: '3px solid #ccc', // Border around the table
    borderRadius: '10px', // Rounded corners
    overflow: 'hidden', // Ensures border-radius is applied properly
    height: '30vh',
    overflowY: 'auto', // Enables scrolling when content exceeds max height
  };

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

  const rows = data.map((entry) => {
    if (dataType === 'customer') {
      const customer = entry as CustomerRequestData;
      return (
        <tr key={customer.customerId}>
          <td style={rowStyle}>{`${customer.firstName} ${customer.lastName}`}</td>
          <td style={rowStyle}>{customer.companyName}</td>
          <td style={rowStyle}>{customer.phoneNo}</td>
          <td style={rowStyle}>{customer.email}</td>
          <td style={rowStyle}>
            <Button component="a" href={`/customers/${customer.customerId}`}>
              view
            </Button>
          </td>
        </tr>
      );
    }

    const invoice = entry as InvoiceTableData;
    const { customers, invoices } = invoice; // Destructure invoice data into customers and invoices components
    const amountDue = (parseFloat(invoices.amount) - parseFloat(invoices.amountPaid)).toFixed(2);
    return (
      <tr key={invoices.invoiceId}>
        <td style={rowStyle}>{`${customers.firstName} ${customers.lastName}`}</td>
        <td style={rowStyle}>{customers.companyName}</td>
        <td style={rowStyle}>{invoices.amount}</td>
        <td style={rowStyle}>{amountDue}</td>
        <td style={rowStyle}>{invoices.invoiceDate}</td>
        <td style={rowStyle}>{invoices.invoiceNumber}</td>
        <td style={rowStyle}>
          <Pill style={statusStyle(invoices.invoiceStatus)}>{invoices.invoiceStatus}</Pill>
        </td>
        <td style={rowStyle}>
          <Button component="a" href={`/invoices/${invoices.invoiceId}`}>
            view
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Container style={tableStyle}>
      <Table stickyHeader stickyHeaderOffset={60}>
        <thead>
          <tr>
            {tableHeadings.map((heading) => (
              <th
                key={heading}
                style={{ textAlign: 'left', padding: '10px', borderBottom: '3px solid #ddd' }}
              >
                {heading}
              </th>
            ))}
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '3px solid #ddd' }}>
              {' '}
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  );
}
