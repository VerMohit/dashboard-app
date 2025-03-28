ALTER TABLE "customers" ALTER COLUMN "unit_no" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_notes" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_notes" SET NOT NULL;