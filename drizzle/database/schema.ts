// Schema for project using Drizzle ORM

/*
    To genearte migration with specific name: 
    `yarn generate-gration --name=test_migration` OR
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
} from 'drizzle-orm/pg-core';
import { InvoiceStatus } from '../lib/invoiceEnum';

// Customer table
export const Customer = pgTable('customers', {
  // Autoincrementing ID
  customerId: serial('customer_id').primaryKey(),
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
  // Soft delete purposes
  isActive: boolean('is_active').default(true),
});

// Invoices table
export const Invoices = pgTable('invoices', {
  // Autoincrementing ID
  invoiceId: serial('invoice_id').primaryKey(),
  // Foreign key to Customer
  customerId: integer('customer_id')
    .references(() => Customer.customerId)
    .notNull(),
  invoiceNumber: text('invoice_Number').unique().notNull(),
  // 10 digits for integer part and 2 digits for fractional part
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).default('0.00').notNull(),
  // Default to current date and time
  invoiceDate: date('invoice_date').defaultNow().notNull(),
  invoiceStatus: text('invoice_status').default(InvoiceStatus.Unpaid).notNull(),
  // Soft delete purposes
  isArchived: boolean('is_archived').default(false).notNull(),
});

// InvoiceDocuments table
export const InvoiceDocuments = pgTable('invoice_documents', {
  documentId: serial('document_id').primaryKey(),
  invoiceId: integer('invoice_id')
    .references(() => Invoices.invoiceId)
    .notNull(),
  fileName: varchar('file_name', { length: 255 }).unique().notNull(),
  filePath: text('file_path').unique().notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  uploadDate: date('upload_date').defaultNow().notNull(),
  fileSize: integer('file_size').notNull(),
});
