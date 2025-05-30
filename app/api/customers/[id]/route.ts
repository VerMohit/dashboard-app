// This route.ts file is specifically for dynamic parameter [id]

import { AppError, NotFoundError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { CustomerData } from "@/app/types/SpecializedTypes";
import { formatCapitalizeString, validateAndFormatPhone } from "@/app/utility/formatValues";
import { validateCustomerInsertedData } from "@/app/utility/validateValues";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


type Params = {
    params: {
        id: string;
    }
}

const paramID = (idStr: string) => {
    const id = Number(idStr);

    if(isNaN(id)) {
        throw new ValidationError(`Invalid customer id: ${id}`);
    }

    return id;
}

export async function GET(_: Request, {params}: Params) {
    try {
        const param = await params;
        const id = paramID(param.id);

        // Compute the remaining balanceDue sum using Drizzle's raw query functionality
        const totalInvoiceDetails = await db.select({ 
                                                        balanceDue: sql<number>`COALESCE(SUM("amount" - "amount_paid"), 0)`
                                                                        .as('balanceDue'),
                                                        totalInvoices: sql<number>`COALESCE(COUNT(*), 0)`
                                                                        .as('totalInvoices'),
                                                        totalUnpaidInvoices: sql<number>`COALESCE(COUNT(CASE WHEN "invoice_status" = 'Unpaid' THEN 1 END), 0)`
                                                                        .as('totalUnpaidInvoices')
                                                    })
                                                        .from(Invoices)
                                                        .where(eq(Invoices.customerId, id))


        const data = await db.select()
                             .from(Customer)
                             .leftJoin(Invoices, eq(Customer.customerId, Invoices.customerId))
                             .where( eq( Customer.customerId, id ) )
                             .orderBy(desc(Invoices.invoiceDate))
                             .limit(5);

        // const data = await db.transaction(async (tsx) => {
        //     const result = await tsx.select()
        //                             .from(Customer)
        //                             .leftJoin(Invoices, eq(Customer.customerId, Invoices.customerId))
        //                             .where( eq( Customer.customerId, id ) )
        //                             .orderBy(desc(Invoices.invoiceDate))
        //                             .limit(5);
        //     return result;
        // })

        return NextResponse.json({data, totalInvoiceDetails })

    } catch (error) {
        console.log("error: ", error);  // debugging purposes

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

export async function PUT(req: Request, { params }: Params) {
    try {
        const {updatedCustomer: customer, isReactivated} = await req.json();
        const param = await params;
        const id = paramID(param.id);
        // console.log(id);

        if(isReactivated) {
            await db.transaction(async (tsx) => {
                const reactivateCust = await tsx.update(Customer)
                                                .set({isActive: true})
                                                .where(eq(Customer.customerId, id))
                                                .returning({customerId: Customer.customerId});
                
                if (reactivateCust.length === 0) {
                    throw new NotFoundError(`Customer with id ${id} was not found`);
                }       
    
                await tsx.update(Invoices).set({isArchived: false}).where(eq(Invoices.customerId, id));
            });

            return NextResponse.json({message: 'Customer is now active!'})
        }

        const {formattedValue, err: phoneErr} = validateAndFormatPhone(customer.phoneNo);
        if(phoneErr) {
            throw new ValidationError(phoneErr);
        }
        if(formattedValue == null) {
            new ValidationError('There is an issue with the phone number, please check');
        }
        const formattedPhone = `+1${formattedValue}`

        const customerUpdate: CustomerData = {
            firstName: formatCapitalizeString(customer.firstName).formattedValue,
            lastName: formatCapitalizeString(customer.lastName).formattedValue,
            phoneNo: formattedPhone!,
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
        const errCust = validateCustomerInsertedData(customerUpdate)
        if(errCust !== null) {
            throw new ValidationError(errCust)
        }
        
        await db.transaction(async (tsx) => {
            await tsx.update(Customer).set(customerUpdate).where(eq(Customer.customerId, id));
        })

        return NextResponse.json({message: 'Changes successful'})
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

// Soft delete
export async function DELETE(_req: Request, { params }:Params) {
    try {
        
        const param = await params;
        const id = paramID(param.id);

        await db.transaction(async (tsx) => {
            const deletedCust = await tsx.update(Customer)
                                           .set({isActive: false})
                                           .where(eq(Customer.customerId, id))
                                           .returning({customerId: Customer.customerId});
            
            if (deletedCust.length === 0) {
                throw new NotFoundError(`Customer with id ${id} was not found`);
            }       

            await tsx.update(Invoices).set({isArchived: true}).where(eq(Invoices.customerId, id));
        });

        // Perform deletion logic here
        return NextResponse.json({ message: `Soft deleted customer with id ${id}` });
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
