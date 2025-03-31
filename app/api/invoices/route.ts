import { AppError, ConflictError, NotFoundError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { CustomerIdentifier, FetchedInvoiceData, InsertedInvoiceDataWithCustomerId, RequestBody } from "@/app/types/SpecializedTypes";
import { formatCapitalizeString } from "@/app/utility/formatValues";
import { mapDBErrorToHttpResponse } from "@/app/utility/mapDBErrorToHttpResponse";
import { validateInvoiceInsertedData, validatePaidStatus } from "@/app/utility/validateValues";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, ilike, or, and, desc, asc, sql, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query')?.trim();
        const sortDate = searchParams.get('sortDate')?.trim() ?? 'DESC';
        const invoiceStatus = searchParams.get('invoiceStatus')?.trim() ?? 'All';

        const sortDateParams = new Set(['ASC', 'asc', 'DESC', 'desc']);
        const invoiceStatusParams = new Set(['All', 'all', 'Paid', 'paid', 'Unpaid', 'unpaid']);

        if (!sortDateParams.has(sortDate)) {
            throw new ValidationError(`Error: Invalid parameter for sortDate field. sortDate cannot be ${sortDate}`);
        }

        if (!invoiceStatusParams.has(invoiceStatus)) {
            throw new ValidationError(`Error: Invalid parameter for invoiceStatus field. invoiceStatus cannot be ${invoiceStatus}`);
        }

        const conditions = [];

        if (query) {
            conditions.push(
                or(
                    ilike(Customer.firstName, `%${query}%`), 
                    ilike(Customer.lastName, `%${query}%`),
                    ilike(Customer.companyName, `%${query}%`),
                    ilike(sql`CAST(${Invoices.invoiceDate} AS TEXT)`, `%${query}%`),  // Cast invoiceDate to text
                    ilike(Invoices.invoiceNumber, `%${query}%`),
                )
            );
        }

        if(invoiceStatus === 'Paid' || invoiceStatus === 'Unpaid'){
            conditions.push(
                eq(
                    Invoices.invoiceStatus, invoiceStatus
                )
            );
        }

        // Only return customers that have invoices associated with them
        const queryBuilder = db.select()
                                .from(Customer)
                                .leftJoin(Invoices, 
                                          and(
                                                eq(Customer.customerId, Invoices.customerId), 
                                                isNotNull(Invoices.invoiceId),
                                             )
                                         )
                                .where( and(...conditions))

        // Only apply orderBy if sortDate is not an empty string
        if (sortDate === 'ASC' || sortDate === 'asc') {
            queryBuilder.orderBy(
                asc(Invoices.invoiceDate)
            );
        } else if (sortDate === 'DESC' || sortDate === 'desc') {
            queryBuilder.orderBy(
                desc(Invoices.invoiceDate)
            );
        }

        const getInvoices = await queryBuilder;

        return NextResponse.json(getInvoices)
    } catch (error) {
        console.log("error: ", error);  // debugging purposes

        if (error instanceof AppError) {
            return NextResponse.json(
                error.toJSON(),
                {
                    status: error.statusCode
                }
            )
        };

        return NextResponse.json(
            {
                status: 'error',
                message: "Unexpected error occured",
                code: "INTERNAL_SERVER-ERROR"
            },
            {
                status: 500
            }
        );
    }
}




// Function processes all the invovices added concurrently. If a single promise fails, transaction rolls back and throws error
//  if everything passes, then the invoiceUUID array will be returned
const processInvoices = async (customerExists: CustomerIdentifier, invoice: FetchedInvoiceData[]) => {
    return db.transaction(async (tsx) => {
        // Promise.all will handle async insert operations in parallel
        const invoiceUUIDs = await Promise.all(
            invoice.map(async (invoice) => {
                // const invoiceValues: InsertedInvoice = {
                const invoiceValues: InsertedInvoiceDataWithCustomerId = {
                    customerUUID: customerExists.customerUUID,
                    customerId: customerExists.customerId,
                    invoiceNumber: invoice.invoiceNumber,
                    amount: invoice.amount,
                    amountPaid: invoice.amountPaid,
                    invoiceStatus: validatePaidStatus(invoice.amount, invoice.amountPaid),
                    invoiceDate: invoice.invoiceDate.trim() || new Date().toISOString().split('T')[0], //undefined, 
                    invoiceNotes: invoice.invoiceNotes,
                };
                
                // Pre-insertion validations
                const errInvoice = validateInvoiceInsertedData(invoiceValues);
                if (errInvoice !== null) {
                    throw new ValidationError(errInvoice);
                }
                
                // Insert into DB
                const newInvoice = await tsx
                    .insert(Invoices)
                    .values(invoiceValues)
                    .returning({ invoiceUUID: Invoices.invoiceUUID });
    

                // This variable would be used for the invoice_document table
                return newInvoice[0].invoiceUUID;
            })
        )
        return invoiceUUIDs;
    });

}

export async function POST(req: Request) {

    try {
        const {customer, invoice}: RequestBody = await req.json();
        console.log('Customer body: ', customer);
        console.log('Invoice body email: ', invoice);

        await db.transaction(async (tsx) => {

            const companyName = formatCapitalizeString(customer.companyName).formattedValue;
            const phoneNo = customer.phoneNo;
            const email = customer.email;

            const customerExists: CustomerIdentifier[] = await tsx.select({ customerId: Customer.customerId, customerUUID: Customer.customerUUID })
                                            .from(Customer)
                                            .where(or(
                                                    eq(Customer.phoneNo, phoneNo),
                                                    eq(Customer.email, email), 
                                                    eq(Customer.companyName, companyName)
                                                )
                                            )
                                            .limit(1);

            if(!customerExists.length) {
                const mssg: string = 'Customer not found. \n Make sure Customer details are correct or add the customer first.'
                throw new NotFoundError(mssg)
            }

            // Check for duplicate invoice numbers using a Set
            const invoiceNumbers = new Set(invoice.map(inv => inv.invoiceNumber));
            if (invoiceNumbers.size !== invoice.length) {
                throw new ConflictError('Duplicate invoice number found. Please correct the error.');
            }

            // Process the invoices to be submitted into the db
            // This variable would be used for the invoice_document table when added in future
            const invoiceUUID: string[] = await processInvoices(customerExists[0], invoice) 
            console.log(invoiceUUID);
            
        });

        return NextResponse.json('Successfully added new invoice(s)');
    } catch (error: any) {
        console.log("error: ", error);  // debugging purposes

        // Catch custom errors
        if (error instanceof AppError) {
            return NextResponse.json(
                error.toJSON(),
                {
                    status: error.statusCode
                }
            )
        };

        // Catch postgres db errors
        const err = mapDBErrorToHttpResponse(error);
        return NextResponse.json(
            {
                status: 'error',
                message: err?.message,
                code: err?.code
            },
            {
                status: err?.statusCode
            }
        );
    }
}
