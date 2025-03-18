ALTER TABLE "customers" ALTER COLUMN "first_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "last_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "company_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "unit_no" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "street" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "city" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "postal_code" SET DATA TYPE varchar(7);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "state" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "country" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "notes" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "invoice_documents" ALTER COLUMN "file_path" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_number" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_status" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_notes" varchar(50) DEFAULT '';