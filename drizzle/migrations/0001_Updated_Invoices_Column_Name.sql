ALTER TABLE "invoices" RENAME COLUMN "invoice_Number" TO "invoice_number";--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_invoice_Number_unique";--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number");