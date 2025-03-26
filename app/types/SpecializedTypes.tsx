import {
  CustomerIds,
  CustomerUUID,
  OptionalCustomerData,
  PrimaryCustomerData,
  SecondaryCustomerData,
} from './customerTypes';
import { InvoiceIds, PrimaryInvoiceData, SecondaryInvoiceData } from './invoiceTypes';

type CustomerWithInvoiceData = { customers: FetchedCustomerData } & {
  invoices: FetchedInvoiceData | null;
};

type CustomerIdentifier = CustomerIds & CustomerUUID;
// type InvoiceIdentifier = InvoiceIds & InvoiceUUID;

// Type used for Display Contents and Tabular Display
type RequestData = FetchedCustomerData | CustomerWithInvoiceData;

type RequestBody = {
  customer: FetchedCustomerData;
  invoice: FetchedInvoiceData[];
};

type FetchedCustomerAndInvoiceData = {
  customers: FetchedCustomerData;
  invoices: FetchedInvoiceData;
};

type CustomerData = PrimaryCustomerData & SecondaryCustomerData & Partial<OptionalCustomerData>;

type FetchedCustomerData = CustomerIdentifier & CustomerData;

// All fields in PrimaryCustomerData are req'd but fields of SecondaryCustomerData are optional
type CustomerFormData = PrimaryCustomerData & Partial<SecondaryCustomerData>;

type InsertedCustomerData = CustomerUUID & CustomerData;

type InvoiceFormData = PrimaryInvoiceData & Partial<SecondaryInvoiceData>;

type FetchedInvoiceData = InvoiceIds & PrimaryInvoiceData & SecondaryInvoiceData;

type InsertedInvoiceDataWithCustomerId = CustomerIdentifier &
  PrimaryInvoiceData &
  SecondaryInvoiceData;

export type {
  CustomerWithInvoiceData,
  RequestData,
  CustomerFormData,
  InsertedCustomerData,
  InvoiceFormData,
  FetchedCustomerData,
  InsertedInvoiceDataWithCustomerId,
  FetchedCustomerAndInvoiceData,
  CustomerIdentifier,
  RequestBody,
  FetchedInvoiceData,
  CustomerData,
};
