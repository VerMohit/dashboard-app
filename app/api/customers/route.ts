import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { FetchedCustomerData, InsertedCustomerData, InsertedInvoiceDataWithCustomerId } from "@/app/types/SpecializedTypes";
import { formatCapitalizeString, validateAndFormatPhone } from "@/app/utility/formatValues";
import { mapDBErrorToHttpResponse } from "@/app/utility/mapDBErrorToHttpResponse";
import { validateCustomerInsertedData, validateInvoiceInsertedData, validatePaidStatus } from "@/app/utility/validateValues";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export async function GET(req: Request) {
    
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query')?.trim();
        const isActive = searchParams.get('isActive')?.trim().toLowerCase() ?? 'all';
        const conditions :any[] = [];

        const isActiveParams = new Set(['all', 'true', 'false']);
        if(!isActiveParams.has(isActive)) {
            return new ValidationError(`Error: Invalid parameter for isActive field. isActive cannot be ${isActive}`)
        }

        if (query) {
            conditions.push(
                or(
                    ilike(Customer.firstName, `%${query}%`), 
                    ilike(Customer.lastName, `%${query}%`),
                    ilike(Customer.phoneNo, `%${query}%`),
                    ilike(Customer.email, `%${query}%`),
                    ilike(Customer.companyName, `%${query}%`),
                    ilike(Customer.street, `%${query}%`),
                    ilike(Customer.city, `%${query}%`),
                )
            );
        }

        if(isActive !== 'all') {
            conditions.push(
                eq( Customer.isActive, isActive === 'true' )
            );
        }
        
        // Wrap db query in a transaction
        const customers: FetchedCustomerData[] = await db.select()
                                                    .from(Customer)
                                                    .where(and(...conditions))
                                                    .orderBy(Customer.firstName);

        return NextResponse.json(customers);
    } catch (error: any) {
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

export async function POST(req: Request) {

    try {
        const {customer, invoice, addInvoice} = await req.json();
        const uuid = uuidv4();

        const {formattedValue, err: phoneErr} = validateAndFormatPhone(customer.phoneNo);
        if(phoneErr) {
            throw new ValidationError(phoneErr)
        }

        const formattedPhone = `+1${formattedValue}`

        await db.transaction(async (tsx) => {

            const customerValues: InsertedCustomerData = {
                customerUUID: uuid,
                firstName: formatCapitalizeString(customer.firstName).formattedValue,
                lastName: formatCapitalizeString(customer.lastName).formattedValue,
                phoneNo: formattedPhone,
                email: customer.email,
                companyName: formatCapitalizeString(customer.companyName).formattedValue,
                unitNo: customer.unitNo,
                street: formatCapitalizeString(customer.street).formattedValue,
                city: formatCapitalizeString(customer.city).formattedValue,
                postalCode: customer.postalCode,
                country: formatCapitalizeString(customer.country).formattedValue,
                state: formatCapitalizeString(customer.state).formattedValue,
                notes: customer.notes,
            }

            // Pre-insertion validations
            const errCust = validateCustomerInsertedData(customerValues)
            if(errCust !== null) {
                throw new ValidationError(errCust)
            }

            if(!addInvoice) {
                await tsx.insert(Customer).values( customerValues );
            }
            else {
                const newCustomer = await tsx.insert(Customer)
                                             .values( customerValues )
                                             .returning({ customerId: Customer.customerId }) as { customerId: number }[];
                
                const newCustID = newCustomer[0]?.customerId as number;

                if (newCustID === undefined || newCustID === null) {
                    throw new ValidationError('Customer ID is required for invoice insertion');
                }
                
                const insertedInvoice = invoice[0];

                const invoiceValues: InsertedInvoiceDataWithCustomerId = {
                    customerUUID: uuid,
                    customerId: newCustID,
                    invoiceNumber: insertedInvoice.invoiceNumber,
                    amount: insertedInvoice.amount,
                    amountPaid: insertedInvoice.amountPaid,
                    invoiceStatus: validatePaidStatus(insertedInvoice.amount, insertedInvoice.amountPaid),
                    invoiceDate: insertedInvoice.invoiceDate.trim() || undefined, 
                    invoiceNotes: insertedInvoice.invoiceNotes,
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
                console.log(newInvoice[0].invoiceUUID);
            }
        });


        return NextResponse.json('Successfully added new customer and invoice');
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


