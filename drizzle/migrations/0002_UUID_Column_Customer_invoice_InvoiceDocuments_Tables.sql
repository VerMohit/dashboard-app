ALTER TABLE "invoice_documents" DROP CONSTRAINT "invoice_documents_invoice_id_invoices_invoice_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customer_id_customers_customer_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'customers'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "customers" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'invoices'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "invoices" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "customer_uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_documents" ADD COLUMN "invoice_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customer_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_documents" ADD CONSTRAINT "invoice_documents_invoice_uuid_invoices_invoice_uuid_fk" FOREIGN KEY ("invoice_uuid") REFERENCES "public"."invoices"("invoice_uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_uuid_customers_customer_uuid_fk" FOREIGN KEY ("customer_uuid") REFERENCES "public"."customers"("customer_uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_documents" DROP COLUMN "invoice_id";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "customer_id";--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_customer_id_unique" UNIQUE("customer_id");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_invoice_id_unique" UNIQUE("invoice_id");