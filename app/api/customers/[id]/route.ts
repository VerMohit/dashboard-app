// This route.ts file is specifically for dynamic parameter [id]

import { AppError, NotFoundError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { InvoiceTableData } from "@/app/types/invoiceTypes";
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

export async function GET(req: Request, {params}: Params) {
    try {
        const param = await params;
        const id = paramID(param.id);

        // Compute the remaining balance sum using Drizzle's raw query functionality
        const remainingBalanceSum = await db.select( { 
                                                                balance: sql<number>`SUM("amount" - "amount_paid")`
                                                                .as('balance') } )
                                                  .from(Invoices)
                                                  .where(eq(Invoices.customerId, id))

        const data = await db.transaction(async (tsx) => {
            const result = await tsx.select()
                                    .from(Customer)
                                    .leftJoin(Invoices, eq(Customer.customerId, Invoices.customerId))
                                    .where( eq( Customer.customerId, id ) )
                                    .orderBy(desc(Invoices.invoiceDate))
                                    .limit(5);
            return result;
        })

        // console.log(typeof remainingBalanceSum);



        // const customer = data[0].customers;

        // const invoices = data.map((item) => 
        //     item.invoices
        // )

        // console.log(data)
        // const {customers, invoices} = data[0];
        // console.log(customer)
        // console.log(invoices)
        
        return NextResponse.json({data, remainingBalanceSum })

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

export async function PATCH(req: Request, { params }: Params) {
    try {
        const param = await params;
        const id = paramID(param.id);
        console.log(id);

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
export async function DELETE(req: Request, { params }:Params) {
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
