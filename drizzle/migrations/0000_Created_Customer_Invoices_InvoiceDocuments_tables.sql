CREATE TABLE "customers" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company_name" varchar(355) NOT NULL,
	"unit_no" varchar(7) DEFAULT '',
	"street" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"notes" text DEFAULT '',
	"is_active" boolean DEFAULT true,
	CONSTRAINT "customers_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "customers_email_unique" UNIQUE("email"),
	CONSTRAINT "customers_company_name_unique" UNIQUE("company_name"),
	CONSTRAINT "check_active_boolean" CHECK ("active" IN (true, false))
);
--> statement-breakpoint
CREATE TABLE "invoice_documents" (
	"document_id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"upload_date" date DEFAULT now() NOT NULL,
	"file_size" integer NOT NULL,
	CONSTRAINT "invoice_documents_file_name_unique" UNIQUE("file_name"),
	CONSTRAINT "invoice_documents_file_path_unique" UNIQUE("file_path")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"invoice_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"invoice_Number" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"invoice_date" date DEFAULT now() NOT NULL,
	"invoice_status" text DEFAULT 'Unpaid' NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	CONSTRAINT "invoices_invoice_Number_unique" UNIQUE("invoice_Number"),
	CONSTRAINT "check_invoice_status" CHECK ("invoice_status" IN ('Paid', 'Unpaid'))
);
--> statement-breakpoint
ALTER TABLE "invoice_documents" ADD CONSTRAINT "invoice_documents_invoice_id_invoices_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("invoice_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE no action ON UPDATE no action;