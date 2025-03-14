ALTER TABLE "invoice_documents" DROP CONSTRAINT "invoice_documents_invoice_id_invoices_invoice_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "customer_uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_documents" ADD COLUMN "invoice_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customer_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_documents" ADD CONSTRAINT "invoice_documents_invoice_uuid_invoices_invoice_uuid_fk" FOREIGN KEY ("invoice_uuid") REFERENCES "public"."invoices"("invoice_uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_uuid_customers_customer_uuid_fk" FOREIGN KEY ("customer_uuid") REFERENCES "public"."customers"("customer_uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_documents" DROP COLUMN "invoice_id";--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_customer_uuid_unique" UNIQUE("customer_uuid");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_invoice_uuid_unique" UNIQUE("invoice_uuid");
ALTER TABLE "invoices" ADD CONSTRAINT "check_amountPaid_amount" CHECK ('amountPaid' <= 'amount');
