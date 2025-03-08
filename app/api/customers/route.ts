import { AppError, ValidationError } from "@/app/CustomErrors/CustomErrorrs";
import { db } from "@/drizzle/database/db";
import { Customer } from "@/drizzle/database/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";


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

        
        // const customers = await db.select()
        //                              .from(Customer)
        //                              .where( and(...conditions) )

        return NextResponse.json(customers);
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