type InvoiceIds = {
    invoiceId: number,
}

type InvoiceUUID = {
    invoiceUUID: string,
}
  
type PrimaryInvoiceData = {
invoiceNumber: string,
amount: string,
amountPaid: string,
invoiceDate: string,
invoiceNotes: string,
}

type SecondaryInvoiceData = {
    invoiceStatus: string,
    isArchived?: true | false
}

// need to specify `type` because of tsconfig.json settings having `isolatedModules` enabled
export type {
    PrimaryInvoiceData,
    InvoiceIds,
    InvoiceUUID,
    SecondaryInvoiceData,
};