/*
    To run the seed script, run `yarn ts-node drizzle/seed.ts`
    first add this into package.json file:
    ```
      "scripts": {
        "seed": "ts-node seed.ts"
      }
    ```
    The "seed" script in your package.json will only run when you manually invoke it. does not automatically run when you deploy your application unless you specifically configure it.

    Then run,

    ```
      yarn seed-db
    ```

    The way I currently sseded the data was converting this file into a .cjs file, change "type":"commonjs" 
    instead of "module" in package.json file, and running the command,

      `yarn ts-node seed.cjs`

*/

import { InvoiceStatus } from '../lib/invoiceEnum'; // Import the InvoiceStatus enum
import { db } from './db'; // Import your Drizzle db instance

import { Customer, Invoices } from './schema'; // Import the table definitions

async function seedDB() {
  console.log('🗑️ Seeding database...');
  try {
    // Create fake customers with all required fields
    const insertedCustomer = await db
      .insert(Customer)
      .values([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          companyName: 'Doe Enterprises',
          unitNo: '101',
          street: '123 Main St',
          city: 'Toronto',
          postalCode: 'M5H 2N2',
          state: 'ON',
          country: 'Canada',
          phoneNo: '+14164567890',
          isActive: true, // Explicitly setting active status
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          companyName: 'Smith Solutions',
          unitNo: '202A',
          street: '456 Elm St',
          city: 'Vancouver',
          postalCode: 'V6B 4N8',
          state: 'BC',
          country: 'Canada',
          phoneNo: '+16046543210',
          isActive: true,
        },
        {
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@example.com',
          companyName: 'Alice Corp',
          street: '789 Oak St',
          city: 'Montreal',
          postalCode: 'H3B 1A7',
          state: 'QC',
          country: 'Canada',
          phoneNo: '+15141234567',
          isActive: false,
        },
      ])
      .returning({ customerUUID: Customer.customerUUID });

    const customerUUIDs = insertedCustomer.map((customer) => customer.customerUUID);

    // Create fake invoices with all required fields
    const invoices = await db.insert(Invoices).values([
      {
        customerUUID: customerUUIDs[0],
        invoiceNumber: 'INV-001',
        amount: '150.00',
        amountPaid: '0.00',
        invoiceStatus: InvoiceStatus.Unpaid,

        invoiceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
      {
        customerUUID: customerUUIDs[0],
        invoiceNumber: 'INV-002',
        amount: '150.00',
        amountPaid: '150.00',
        invoiceStatus: InvoiceStatus.Paid,

        invoiceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
      {
        customerUUID: customerUUIDs[1],
        invoiceNumber: 'INV-003',
        amount: '200.00',
        amountPaid: '200.00',
        invoiceStatus: InvoiceStatus.Paid,
        invoiceDate: new Date().toISOString().split('T')[0],
      },
      {
        customerUUID: customerUUIDs[1],
        invoiceNumber: 'INV-004',
        amount: '250.00',
        amountPaid: '0.00',
        invoiceStatus: InvoiceStatus.Unpaid,
        invoiceDate: new Date().toISOString().split('T')[0],
      },
      {
        customerUUID: customerUUIDs[2],
        invoiceNumber: 'INV-005',
        amount: '300.00',
        amountPaid: '0.00',
        invoiceStatus: InvoiceStatus.Unpaid,
        invoiceDate: new Date().toISOString().split('T')[0],
        isArchived: true,
      },
      {
        customerUUID: customerUUIDs[2],
        invoiceNumber: 'INV-006',
        amount: '100.00',
        amountPaid: '100.00',
        invoiceStatus: InvoiceStatus.Paid,
        invoiceDate: new Date().toISOString().split('T')[0],
        isArchived: true,
      },
    ]);
    console.log('✅ Seeded database successfully!');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  }
}

seedDB().catch((err) => console.error('❌ Error seeding:', err));
