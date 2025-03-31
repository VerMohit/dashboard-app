    // Get conflict fields from the error detail
export const getConflictFieldFromDetail = (detail: string): string | null => {
    if (detail.includes("email")) {
        return 'email';
    } else if (detail.includes('phone_number')) {
        return 'phone number';
    } else if (detail.includes('company_name')) {
        return 'company name';
    } else if (detail.includes('invoice_number')) {
        return 'invoice number';
    }
    return null;
}

// export const getConflictInvoiceField = (detail: string): string | null => {
//     if (detail.includes('invoice_number')) {
//         return 'invoice number';
//     }
//     return null;
// }