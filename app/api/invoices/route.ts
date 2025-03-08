import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, ilike, or, and, desc, asc, sql } from "drizzle-orm";
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