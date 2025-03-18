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
  varchar,
  uuid
} from 'drizzle-orm/pg-core';
import { InvoiceStatus } from '../lib/invoiceEnum';
import { sql } from 'drizzle-orm';

// Customer table
export const Customer = pgTable('customers', {
  customerId: serial('customer_id')
    .notNull()
    .primaryKey(),                // Autoincrementing ID
  customerUUID: uuid('customer_uuid')
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`), 
  firstName: varchar('first_name', { length: 255 })
    .notNull(),
  lastName: varchar('last_name', { length: 255 })
    .notNull(),
  phoneNo: varchar('phone_number', { length: 15 })
    .unique()
    .notNull(),
  email: varchar('email', { length: 255 })
    .unique()
    .notNull(),
  companyName: varchar('company_name', { length: 255 })
    .unique()
    .notNull(),
  unitNo: varchar('unit_no', { length: 20 })
    .default(''),
  street: varchar('street', { length: 255 })
    .notNull(),
  city: varchar('city', { length: 255 })
    .notNull(),
  postalCode: varchar('postal_code', { length: 7 })
    .notNull(),
  state: varchar('state', { length: 30 })
    .notNull(),
  country: varchar('country', { length: 255 })
    .notNull(),
  notes: varchar('notes', { length: 50 })
    .default(''),
  isActive: boolean('is_active')
    .default(true),   // Soft delete purposes
});

// Invoices table
export const Invoices = pgTable('invoices', {
  invoiceId: serial('invoice_id')
    .notNull()
    .primaryKey(),
  invoiceUUID: uuid('invoice_uuid')
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
  customerUUID: uuid('customer_uuid')
    .notNull()
    .references(() => Customer.customerUUID),
  customerId: integer('customer_id')
    .references(() => Customer.customerId)
    .notNull(),
  invoiceNumber: varchar('invoice_number', { length: 50 })
    .unique()
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 })
    .notNull(),   // 10 digits for integer part and 2 digits for fractional part
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 })
    .default('0.00')
    .notNull(),
  invoiceDate: date('invoice_date')
    .defaultNow()
    .notNull(),              // Default to current date and time
  invoiceStatus: varchar('invoice_status', { length: 10 })
    .default(InvoiceStatus.Unpaid)
    .notNull(),
  invoiceNotes: varchar('invoice_notes', { length: 50 })
    .default(''),
  isArchived: boolean('is_archived')
    .default(false)
    .notNull(),  // Soft delete purposes
});

// InvoiceDocuments table
export const InvoiceDocuments = pgTable('invoice_documents', {
  documentId: serial('document_id')
    .primaryKey(),
  invoiceUUID: uuid('invoice_uuid')
    .notNull()
    .references(() => Invoices.invoiceUUID),
  fileName: varchar('file_name', { length: 255 })
    .unique()
    .notNull(),
  filePath: varchar('file_path', { length: 255 })
    .unique()
    .notNull(),
  fileType: varchar('file_type', { length: 50 })
    .notNull(),
  uploadDate: date('upload_date')
    .defaultNow()
    .notNull(),
  fileSize: integer('file_size')
    .notNull(),
});
