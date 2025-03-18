import React from 'react';
import { Button, Container, Pill, Table } from '@mantine/core';
import { CustomerRequestData } from '../../types/customerTypes';
import { InvoiceTableData } from '../../types/invoiceTypes';
import { formatCurrency, formatDate } from '../../utility/formatValues';
import styles from './TabularDisplay.module.css';

export function TabularDisplay({
  tableHeadings,
  data,
  dataType,
}: {
  tableHeadings: string[];
  data: CustomerRequestData[] | InvoiceTableData[];
  dataType: 'customer' | 'invoice';
}) {
  // // make into css class
  // const rowStyle: React.CSSProperties = {
  //   textAlign: 'left',
  //   padding: '10px',
  //   borderBottom: '1px solid #ddd', // Separator between rows
  //   width: '500px',
  //   whiteSpace: 'nowrap', // Prevent text wrapping
  //   overflow: 'hidden', // Hide overflowed content
  //   textOverflow: 'ellipsis', // Add ellipsis when text overflows
  // };

  // // make into css class
  // const tableStyle: React.CSSProperties = {
  //   border: '3px solid #ccc', // Border around the table
  //   borderRadius: '10px', // Rounded corners
  //   overflow: 'hidden', // Ensures border-radius is applied properly
  //   height: '50vh',
  //   overflowY: 'auto', // Enables scrolling when content exceeds max height
  // };

  // // make into css class
  // const statusStyle = (status: string): React.CSSProperties => {
  //   switch (status) {
  //     case 'Paid':
  //       return {
  //         backgroundColor: '#A5D6A7',
  //         textAlign: 'center',
  //         fontWeight: 'bold',
  //         width: '4rem',
  //         display: 'inline-block', // Ensures the text is centered
  //       };
  //     case 'Unpaid':
  //       return {
  //         backgroundColor: '#FFCC80',
  //         textAlign: 'center',
  //         fontWeight: 'bold',
  //         width: '4rem',
  //         display: 'inline-block',
  //       };
  //     default:
  //       return {};
  //   }
  // };

  const rows = data.map((entry) => {
    if (dataType === 'customer') {
      const customer = entry as CustomerRequestData;
      return (
        <tr key={customer.customerId}>
          <td className={styles.tableRow}>{`${customer.firstName} ${customer.lastName}`}</td>
          <td className={styles.tableRow}>{customer.companyName}</td>
          <td className={styles.tableRow}>{customer.phoneNo}</td>
          <td className={styles.tableRow}>{customer.email}</td>
          <td className={styles.tableRow}>
            <Button component="a" href={`/dashboard/customers/${customer.customerId}`}>
              view
            </Button>
          </td>
        </tr>
      );
    }

    const invoice = entry as InvoiceTableData;

    // Skip if a customer's invoice is null - don't display in table
    if (!invoice.invoices) {
      return null;
    }

    const { customers, invoices } = invoice; // Destructure invoice data into customers and invoices components
    const amountDue = (parseFloat(invoices.amount) - parseFloat(invoices.amountPaid)).toFixed(2);
    return (
      <tr key={invoices.invoiceId}>
        <td className={styles.tableRow}>
          {customers.firstName} {customers.lastName}
        </td>
        <td className={styles.tableRow}>{invoices.invoiceNumber}</td>
        <td className={styles.tableRow}>{customers.companyName}</td>
        <td className={styles.tableRow}>{formatCurrency(invoices.amount)}</td>
        <td className={styles.tableRow}>{formatCurrency(amountDue)}</td>
        <td className={styles.tableRow}>{formatDate(invoices.invoiceDate)}</td>
        <td className={styles.tableRow}>
          <Pill
            className={invoices.invoiceStatus === 'Paid' ? styles.statusPaid : styles.statusUnpaid}
          >
            {invoices.invoiceStatus}
          </Pill>
        </td>
        <td className={styles.tableRow}>
          <Button component="a" href={`/dashboard/invoices/${invoices.invoiceId}`}>
            view
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Container className={styles.tableContainer}>
      <Table stickyHeader stickyHeaderOffset={60}>
        <thead>
          <tr>
            {tableHeadings.map((heading) => (
              <th key={heading} className={styles.tableHeading}>
                {heading}
              </th>
            ))}
            <th className={styles.tableHeading}> </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  );
}
