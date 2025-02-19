import React from 'react';
import { Button, Container, Table } from '@mantine/core';
import { CustomerRequestData } from '../types/customerTypes';
import { InvoiceRequestData } from '../types/invoiceTypes';

export function TabularDisplay({
  tableHeadings,
  data,
  dataType,
}: {
  tableHeadings: string[];
  data: CustomerRequestData[] | InvoiceRequestData[];
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

    const invoice = entry as InvoiceRequestData;
    return (
      <tr key={invoice.invoiceNumber}>
        <td style={rowStyle}>{invoice.invoiceNumber}</td>
        <td style={rowStyle}>{invoice.amount}</td>
        <td style={rowStyle}>{invoice.amountPaid}</td>
        <td style={rowStyle}>{invoice.invoiceDate}</td>
        <td style={rowStyle}>{invoice.invoiceStatus}</td>
        <td>
          <Button>view</Button>
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
