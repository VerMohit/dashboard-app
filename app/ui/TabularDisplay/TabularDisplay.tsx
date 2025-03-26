import { Button, Container, Pill, Table } from '@mantine/core';
import {
  CustomerWithInvoiceData,
  FetchedCustomerData,
  RequestData,
} from '@/app/types/SpecializedTypes';
import { formatCurrency, formatDate } from '../../utility/formatValues';
import styles from './TabularDisplay.module.css';

export function TabularDisplay({
  tableHeadings,
  data,
  dataType,
}: {
  tableHeadings: string[];
  data: RequestData[];
  dataType: 'customer' | 'invoice';
}) {
  const rows = data.map((entry) => {
    if (dataType === 'customer') {
      // const customer = entry as CustomerRequestData;
      const customer = entry as FetchedCustomerData;
      return (
        <tr key={customer.customerId}>
          <td className={styles.tableRow}>{`${customer.firstName} ${customer.lastName}`}</td>
          <td className={styles.tableRow}>{customer.companyName}</td>
          <td className={styles.tableRow}>{customer.phoneNo}</td>
          <td className={styles.tableRow}>{customer.email}</td>
          <td className={styles.tableRow}>
            <Pill
              className={customer.isActive === true ? styles.statusActive : styles.statusInActive}
            >
              {customer.isActive === true ? 'Active' : 'Inactive'}
            </Pill>
          </td>
          <td className={styles.tableRow}>
            <Button component="a" href={`/dashboard/customers/${customer.customerId}`}>
              view
            </Button>
          </td>
        </tr>
      );
    }

    const invoice = entry as CustomerWithInvoiceData;

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
