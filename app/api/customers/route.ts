import { db } from "@/drizzle/database/db";
import { Customer } from "@/drizzle/database/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query')?.trim();
        const isActive = searchParams.get('isActive')?.trim();
        const conditions = [];

        console.log(isActive)

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

        conditions.push(
            eq(
                Customer.isActive, 
                    isActive == null    || 
                    isActive === 'true' || 
                    isActive === '' 
            )
        );

        const getCustomers = await db.select()
                                     .from(Customer)
                                     .where( and(...conditions) )

        return NextResponse.json(getCustomers);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 }); // Return an error response
    }
    
}