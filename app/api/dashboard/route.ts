import { asc, count, sql,  } from "drizzle-orm"
import { Customer, Invoices } from "@/drizzle/database/schema"
import { db } from "@/drizzle/database/db"
import { NextResponse } from "next/server";

export async function GET(_: Request) {

    try {

        const totalCustomerCount = await db.select( { value: count( Customer.customerId ) } )
                                           .from(Customer);

        const totalCustomers = totalCustomerCount[0].value ?? 0;

        const howManyYearsAgo = 6;
        const xYearsAgo = sql.raw(`CURRENT_DATE - INTERVAL '${howManyYearsAgo} years'`);

        const pastXYearsFigures = await db.select({
                                                        year: sql`EXTRACT(YEAR FROM ${Invoices.invoiceDate})`
                                                                .as('year'),
                                                        annualSales: sql<number>`COALESCE(SUM("amount"), 0)`
                                                                .as('annualSales'),
                                                        annualRevenue: sql<number>`COALESCE(SUM("amount_paid"), 0)`
                                                                .as('annualRevenue'),
                                                        annualBalanceDue: sql<number>`COALESCE(SUM(CASE WHEN "invoice_status" = 'Unpaid' THEN "amount" - "amount_paid"  ELSE 0 END), 0)`
                                                                .as('annualBalanceDue')
                                                    })
                                          .from(Invoices)
                                          .where(sql`${Invoices.invoiceDate} >= ${xYearsAgo}`) 
                                          .groupBy(sql`EXTRACT(YEAR FROM ${Invoices.invoiceDate})`)
                                          .orderBy(sql`EXTRACT(YEAR FROM ${Invoices.invoiceDate})`);

        // const currentYear = new Date().getFullYear();

        const currentYearsFigures = await db.select( { 
                                                        sales: sql<number>`COALESCE(SUM("amount"), 0)`
                                                                    .as('sales'),
                                                        balanceDue: sql<number>`COALESCE(SUM("amount" - "amount_paid"), 0)`
                                                                        .as('balanceDue'),
                                                        totalInvoices: sql<number>`COALESCE(COUNT(*), 0)`
                                                                        .as('totalInvoices'),
                                                        totalUnpaidInvoices: sql<number>`COALESCE(COUNT(CASE WHEN "invoice_status" = 'Unpaid' THEN 1 END), 0)`
                                                                        .as('totalUnpaidInvoices')
                                                    } )
                                                    .from(Invoices)
                                                    .where(sql`EXTRACT(YEAR FROM ${Invoices.invoiceDate}) = EXTRACT(YEAR FROM CURRENT_DATE)`);

        const currentMonthlyFigures = await db.select({
                                                        month: sql`TO_CHAR(${Invoices.invoiceDate}, 'MM')`
                                                            .as('month'),
                                                        monthlySales: sql<number>`COALESCE(SUM("amount"), 0)`
                                                            .as('monthlySales'),
                                                        monthlyRevenue: sql<number>`COALESCE(SUM("amount_paid"), 0)`
                                                            .as('monthlyRevenue'),
                                                        monthlyBalanceDue: sql<number>`COALESCE(SUM(CASE WHEN "invoice_status" = 'Unpaid' THEN "amount" - "amount_paid" ELSE 0 END), 0)`
                                                            .as('monthlyBalanceDue')
                                                    })
                                                    .from(Invoices)
                                                    .where(sql`${Invoices.invoiceDate} >= ${sql`DATE_TRUNC('year', CURRENT_DATE)`}`)
                                                    .groupBy(sql`TO_CHAR(${Invoices.invoiceDate}, 'MM')`)
                                                    .orderBy(sql`TO_CHAR(${Invoices.invoiceDate}, 'MM')`);
    
        return NextResponse.json({
            totalCustomers,
            pastXYearsFigures,
            currentYearsFigures,
            currentMonthlyFigures
        });
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