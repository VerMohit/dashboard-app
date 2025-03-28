// This route.ts file is specifically for dynamic parameter [id]

import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { InvoiceFormData } from "@/app/types/SpecializedTypes";
import { validateInvoiceInsertedData, validatePaidStatus } from "@/app/utility/validateValues";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq} from "drizzle-orm";
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

        const data = await db.transaction(async (tsx) => {
            const result = await tsx.select()
                                    .from(Customer)
                                    .leftJoin(Invoices, eq(Customer.customerId, Invoices.customerId))
                                    .where( eq( Invoices.invoiceId, id ) );
            return result;
        })

        return NextResponse.json({ data })

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

export async function PUT(req: Request, { params }: Params) {
    try {
        const {updatedInvoice: invoice} = await req.json();
        const param = await params;
        const id = paramID(param.id);
        // console.log(id);
        // console.log(invoice)

        // const invoiceUpdate: InsertedInvoice = {
        const invoiceUpdate: InvoiceFormData = {
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            amountPaid: invoice.amountPaid,
            invoiceStatus: validatePaidStatus(invoice.amount, invoice.amountPaid),
            invoiceDate: invoice.invoiceDate.trim() || undefined, 
            invoiceNotes: invoice.invoiceNotes,
        };

        // Pre-insertion validations
        const errInvoice = validateInvoiceInsertedData(invoiceUpdate);
        if (errInvoice !== null) {
            throw new ValidationError(errInvoice);
        }
        
        await db.transaction(async (tsx) => {
            await tsx.update(Invoices).set(invoiceUpdate).where(eq(Invoices.invoiceId, id));
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


