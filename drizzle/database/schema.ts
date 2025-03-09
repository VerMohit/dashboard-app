// Schema for project using Drizzle ORM

/*
    To genearte migration with specific name: 
    `yarn generate-migration --name=<MIGRATION_NAME>` OR
    `yarn drizzle-kit generate --config ./drizzle/drizzle.config.ts --name <name_of_schema_updates>`

    To drop migration:
        `yarn drop-migration` OR
        `yarn drizzle-kit drop` OR 
        `yarn drizzle-kit drop --config ./drizzle/drizzle.config.ts`

        NOTE: dropping a migration only drops that file and DOSEN'T revert the db change.
              So make sure that the migration is what we want before pushing, else it may be difficult
              to revert the db back to the last state

    To push changes to actual db: 
        `yarn push-migration` OR
        `yarn drizzle-kit push` OR 
        `yarn drizzle-kit push --config ./drizzle/drizzle.config.ts`

        Now conenct to DBeaver and should see the tables on Postgres

    Any changes we make to the schema will be done in this file. When we micgrate, Drizzle will compare agsint
    current db schema and apply changes made. We then need to push the migrations to see the updates on DBeaver



    */

import {
  boolean,
  date,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  varchar,
  uuid
} from 'drizzle-orm/pg-core';
import { InvoiceStatus } from '../lib/invoiceEnum';
import { sql } from 'drizzle-orm';

// Customer table
export const Customer = pgTable('customers', {
  
  customerUUID: uuid('customer_uuid').default(sql`gen_random_uuid()`).primaryKey(), 
  customerId: serial('customer_id').unique().notNull(),                // Autoincrementing ID
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNo: varchar('phone_number', { length: 15 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  companyName: varchar('company_name', { length: 355 }).unique().notNull(),
  unitNo: varchar('unit_no', { length: 7 }).default(''),
  street: text('street').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  notes: text('notes').default(''),
  isActive: boolean('is_active').default(true),   // Soft delete purposes
});

// Invoices table
export const Invoices = pgTable('invoices', {
  invoiceUUID: uuid('invoice_uuid').default(sql`gen_random_uuid()`).primaryKey(),
  invoiceId: serial('invoice_id').unique().notNull(),
  customerUUID: uuid('customer_uuid').notNull().references(() => Customer.customerUUID),
  invoiceNumber: text('invoice_number').unique().notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),   // 10 digits for integer part and 2 digits for fractional part
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).default('0.00').notNull(),
  invoiceDate: date('invoice_date').defaultNow().notNull(),              // Default to current date and time
  invoiceStatus: text('invoice_status').default(InvoiceStatus.Unpaid).notNull(),
  
  isArchived: boolean('is_archived').default(false).notNull(),  // Soft delete purposes
});

// InvoiceDocuments table
export const InvoiceDocuments = pgTable('invoice_documents', {
  documentId: serial('document_id').primaryKey(),
  invoiceUUID: uuid('invoice_uuid').notNull().references(() => Invoices.invoiceUUID),
  fileName: varchar('file_name', { length: 255 }).unique().notNull(),
  filePath: text('file_path').unique().notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  uploadDate: date('upload_date').defaultNow().notNull(),
  fileSize: integer('file_size').notNull(),
});
