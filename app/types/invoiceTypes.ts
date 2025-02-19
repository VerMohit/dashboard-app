// For form request data coming from fronend when submitting invoice related data
type InvoiceRequestData = {
    invoiceNumber: string,
    customerId: number,
    amount: string,
    amountPaid: string,
    invoiceDate: string,
    invoiceStatus: "Paid" | "Unpaid",
    isArchived: true | false
}




// For inserted invoice data (returned from DB after insertion)
type InsertedInvoice = {
    invoiceId: number,
    customerId: number,
    invoiceNumber: string,
    amount: string,
    amountPaid: string,
    invoiceDate: string,
    invoiceStatus: string, 
    isArchived: true | false
}


// need to specify `type` because of tsconfig.json settings having `isolatedModules` enabled
export type {InvoiceRequestData, InsertedInvoice};