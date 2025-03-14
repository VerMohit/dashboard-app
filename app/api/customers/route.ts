import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { mapDBErrorToHttpResponse } from "@/app/utility/mapDBErrorToHttpResponse";
import { validatePaidStatus } from "@/app/utility/validateValues";
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
        const customers = await db.transaction(async (tsx) => {
            const result = await tsx.select()
                                   .from(Customer)
                                   .where(and(...conditions));
            return result;
        });

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
        const {customer, invoice} = await req.json();
        const uuid = uuidv4();
        // console.log('Customer body: ', customer);
        // console.log('Invoice body email: ', invoice);
        // console.log('UUIDD body: ', uuid);

        await db.transaction(async (tsx) => {

            const insertCustomerValues = {
                customerUUID: uuid,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phoneNo: customer.phoneNo,
                email: customer.email,
                companyName: customer.companyName,
                unitNo: customer.unitNo,
                street: customer.streetName,
                city: customer.city,
                postalCode: customer.postalCode,
                country: customer.country,
                state: customer.state,
                notes: customer.notes,
            }

            if(invoice.invoiceNo === '') {
                await tsx.insert(Customer).values( insertCustomerValues );
            }
            else {
                const newCustomer = await tsx.insert(Customer)
                                             .values( insertCustomerValues )
                                             .returning({ customerId: Customer.customerId });
                
                const newCustID = newCustomer[0].customerId

                const newInvoice = await tsx.insert(Invoices).values({
                    customerUUID: uuid,
                    customerId: newCustID,
                    invoiceNumber: invoice.invoiceNo,
                    amount: invoice.amount,
                    amountPaid: invoice.amountPaid,
                    // invoiceStatus: invoice.paidStatus,
                    invoiceStatus: validatePaidStatus(invoice.amount, invoice.amountPaid),
                    ...(invoice.invoiceDate && invoice.invoiceDate.trim() !== "" ? { invoiceDate: invoice.invoiceDate } : {}),
                })
                .returning( {invoiceUUID: Invoices.invoiceUUID} );

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

