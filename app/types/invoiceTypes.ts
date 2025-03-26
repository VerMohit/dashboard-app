import { CustomerRequestData } from "./customerTypes"

type InvoiceIds = {
    invoiceId: number,
    invoiceUUID: string,
}
  
type PrimaryInvoiceData = {
invoiceNumber: string,
amount: string,
amountPaid: string,
invoiceDate: string,
invoiceStatus: "Paid" | "Unpaid",
invoiceNotes: string,
}

type SecondaryInvoiceData = {
isArchived: true | false
}
  

type FetchedInvoiceData = InvoiceIds & PrimaryInvoiceData & SecondaryInvoiceData;

// For form request data coming from fronend when submitting invoice related data
type InvoiceRequestData = {
    invoiceId: number,
    invoiceUUID?: string,
    customerUUID?: string,
    invoiceNumber: string,
    customerId: number,
    amount: string,
    amountPaid: string,
    invoiceDate: string,
    invoiceStatus: "Paid" | "Unpaid",
    invoiceNotes: string,
    isArchived: true | false
}


// For inserted invoice data (returned from DB after insertion)
type InsertedInvoice = {
    customerUUID?: string,
    customerId?: number,
    invoiceNumber: string,
    invoiceDate?: string, //check this
    amount: string,
    amountPaid: string,
    invoiceNotes: string,
    invoiceStatus: string,
}

// The invoice data retreived from the DB has 2 objects: customers and invoices
type InvoiceTableData = {
    customers: CustomerRequestData ,
    invoices: InvoiceRequestData,
}

// Defining the shape for the values used in the form for creating new invoices
type InvoiceFormValues = {
    invoiceNumber: string,
    invoiceDate: string,
    amount: string,
    amountPaid: string,
    invoiceNotes: string,
    // paidStatus: string,
  };

// need to specify `type` because of tsconfig.json settings having `isolatedModules` enabled
export type {
    FetchedInvoiceData,
    InvoiceRequestData, 
    InsertedInvoice, 
    InvoiceTableData, 
    InvoiceFormValues
};