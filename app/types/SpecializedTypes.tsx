import { FetchedCustomerData } from './customerTypes';
import { FetchedInvoiceData } from './invoiceTypes';

type CustomerWithInvoiceData = { customers: FetchedCustomerData } & {
  invoices: FetchedInvoiceData | null;
};

type requestData = FetchedCustomerData | CustomerWithInvoiceData;

export type { CustomerWithInvoiceData, requestData };
