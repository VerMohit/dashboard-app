import { db } from "@/drizzle/database/db";
import { Customer, Invoices } from "@/drizzle/database/schema";
import { eq, ilike, or, and, desc, asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query')?.trim();
        const  sortDate = searchParams.get('sortDate')?.trim();
        const  invoiceStatus = searchParams.get('invoiceStatus')?.trim();

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

        return NextResponse.json(getInvoices);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 }); // Return an error response
    }
    
}