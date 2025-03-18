import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { validatePaidStatus } from "@/app/utility/validateValues";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, ilike, or, and, desc, asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


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

        const queryBuilder = db.select()
                                .from(Customer)
                                .leftJoin(Invoices, eq(Customer.customerId, Invoices.customerId))
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


export async function POST(req: Request) {

    try {
        // const {customer, invoice} = await req.json();
        // const uuid = uuidv4();
        // // console.log('Customer body: ', customer);
        // // console.log('Invoice body email: ', invoice);
        // // console.log('UUIDD body: ', uuid);

        // await db.transaction(async (tsx) => {

        //     const insertCustomerValues = {
        //         firstName: customer.firstName,
        //         lastName: customer.lastName,
        //         phoneNo: customer.phoneNo,
        //         email: customer.email,
        //         companyName: customer.companyName,
        //     }

            
        //     //  TODO: check to see what the value of the invoice is if we don't fill it in at all. If null, use that as the condition check insetad 
        //     if(invoice.invoiceNo === '') {
        //         await tsx.insert(Customer).values( insertCustomerValues );
        //     }
        //     else {
        //         const newCustomer = await tsx.insert(Customer)
        //                                      .values( insertCustomerValues )
        //                                      .returning({ customerId: Customer.customerId });
                
        //         const newCustID = newCustomer[0].customerId

        //         const newInvoice = await tsx.insert(Invoices).values({
        //             customerUUID: uuid,
        //             customerId: newCustID,
        //             invoiceNumber: invoice.invoiceNo,
        //             amount: invoice.amount,
        //             amountPaid: invoice.amountPaid,
        //             // invoiceStatus: invoice.paidStatus,
        //             invoiceStatus: validatePaidStatus(invoice.amount, invoice.amountPaid),
        //             ...(invoice.invoiceDate && invoice.invoiceDate.trim() !== "" ? { invoiceDate: invoice.invoiceDate } : {}),
        //         })
        //         .returning( {invoiceUUID: Invoices.invoiceUUID} );

        //         // This variable would be used for the invoice_document table
        //         console.log(newInvoice[0].invoiceUUID);
        //     }
        // });

        console.log('hello')

        return NextResponse.json('Successfully added new invoice');
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

