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
    // const insertedCustomer = await db
    //   .insert(Customer)
    //   .values([
    //     {
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       email: 'john.doe@example.com',
    //       companyName: 'Doe Enterprises',
    //       unitNo: '101',
    //       street: '123 Main St',
    //       city: 'Toronto',
    //       postalCode: 'M5H 2N2',
    //       state: 'ON',
    //       country: 'Canada',
    //       phoneNo: '+14164567890',
    //       isActive: true, // Explicitly setting active status
    //     },
    //     {
    //       firstName: 'Jane',
    //       lastName: 'Smith',
    //       email: 'jane.smith@example.com',
    //       companyName: 'Smith Solutions',
    //       unitNo: '202A',
    //       street: '456 Elm St',
    //       city: 'Vancouver',
    //       postalCode: 'V6B 4N8',
    //       state: 'BC',
    //       country: 'Canada',
    //       phoneNo: '+16046543210',
    //       isActive: true,
    //     },
    //     {
    //       firstName: 'Alice',
    //       lastName: 'Johnson',
    //       email: 'alice.johnson@example.com',
    //       companyName: 'Alice Corp',
    //       street: '789 Oak St',
    //       city: 'Montreal',
    //       postalCode: 'H3B 1A7',
    //       state: 'QC',
    //       country: 'Canada',
    //       phoneNo: '+15141234567',
    //       isActive: false,
    //     },
    //   ])
    //   .returning({ customerId: Customer.customerId, customerUUID: Customer.customerUUID });

    // const customerIds = insertedCustomer.map((customer) => customer.customerId);
    // const customerUUIDs = insertedCustomer.map((customer) => customer.customerUUID);

    // // Create fake invoices with all required fields
    // const invoices = await db.insert(Invoices).values([
    //   {
    //     customerId: customerIds[0],
    //     customerUUID: customerUUIDs[0],
    //     invoiceNumber: 'INV-001',
    //     amount: '150.00',
    //     amountPaid: '0.00',
    //     invoiceStatus: InvoiceStatus.Unpaid,

    //     invoiceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    //   },
    //   {
    //     customerId: customerIds[1],
    //     customerUUID: customerUUIDs[1],
    //     invoiceNumber: 'INV-002',
    //     amount: '200.00',
    //     amountPaid: '200.00',
    //     invoiceStatus: InvoiceStatus.Paid,
    //     invoiceDate: new Date().toISOString().split('T')[0],
    //   },
    //   {
    //     customerId: customerIds[1],
    //     customerUUID: customerUUIDs[1],
    //     invoiceNumber: 'INV-003',
    //     amount: '250.00',
    //     amountPaid: '0.00',
    //     invoiceStatus: InvoiceStatus.Unpaid,
    //     invoiceDate: new Date().toISOString().split('T')[0],
    //   },
    //   {
    //     customerId: customerIds[2],
    //     customerUUID: customerUUIDs[2],
    //     invoiceNumber: 'INV-004',
    //     amount: '300.00',
    //     amountPaid: '0.00',
    //     invoiceStatus: InvoiceStatus.Unpaid,
    //     invoiceDate: new Date().toISOString().split('T')[0],
    //     isArchived: true,
    //   },
    //   {
    //     customerId: customerIds[2],
    //     customerUUID: customerUUIDs[2],
    //     invoiceNumber: 'INV-005',
    //     amount: '100.00',
    //     amountPaid: '100.00',
    //     invoiceStatus: InvoiceStatus.Paid,
    //     invoiceDate: new Date().toISOString().split('T')[0],
    //     isArchived: true,
    //   },
    // ]);
    const insertedCustomers = await db
    .insert(Customer)
    .values([
      // Original customers
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        companyName: 'Doe Enterprises',
        unitNo: '101',
        street: '123 Main St',
        city: 'Toronto',
        postalCode: 'M5H 2N2',
        state: 'Ontario',
        country: 'Canada',
        phoneNo: '+14164567890',
        isActive: true,
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
        state: 'British Columbia',
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
        state: 'Quebec',
        country: 'Canada',
        phoneNo: '+15141234567',
        isActive: false,
      },
      {
        firstName: 'Bob',
        lastName: 'Anderson',
        email: 'bob.anderson@example.com',
        companyName: 'Anderson Tech',
        unitNo: '305',
        street: '789 Pine St',
        city: 'Calgary',
        postalCode: 'T2P 1G7',
        state: 'Alberta',
        country: 'Canada',
        phoneNo: '+14031234567',
        isActive: true,
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@example.com',
        companyName: 'Wilson Marketing',
        street: '456 Birch St',
        city: 'Ottawa',
        postalCode: 'K1P 5G4',
        state: 'Ontario',
        country: 'Canada',
        phoneNo: '+16131234567',
        isActive: false,
      },
      {
        firstName: 'Liam',
        lastName: 'Brown',
        email: 'liam.brown@example.com',
        companyName: 'Brown Consulting',
        street: '123 Maple St',
        city: 'Winnipeg',
        postalCode: 'R3C 4T3',
        state: 'Manitoba',
        country: 'Canada',
        phoneNo: '+12047891234',
        isActive: true,
      },
      {
        firstName: 'Olivia',
        lastName: 'Davis',
        email: 'olivia.davis@example.com',
        companyName: 'Davis Logistics',
        street: '987 Cedar Ave',
        city: 'Edmonton',
        postalCode: 'T5J 0N3',
        state: 'Alberta',
        country: 'Canada',
        phoneNo: '+17805551234',
        isActive: true,
      },
      {
        firstName: 'Noah',
        lastName: 'Miller',
        email: 'noah.miller@example.com',
        companyName: 'Miller Industries',
        street: '654 Spruce Dr',
        city: 'Halifax',
        postalCode: 'B3J 3N4',
        state: 'Nova Scotia',
        country: 'Canada',
        phoneNo: '+19021234567',
        isActive: false,
      },
      {
        firstName: 'Sophia',
        lastName: 'Wilson',
        email: 'sophia.wilson@example.com',
        companyName: 'Wilson Engineering',
        street: '321 Redwood Ln',
        city: 'Regina',
        postalCode: 'S4P 3Y2',
        state: 'Saskatchewan',
        country: 'Canada',
        phoneNo: '+13065551234',
        isActive: false,
      },
      {
        firstName: 'Ethan',
        lastName: 'Taylor',
        email: 'ethan.taylor@example.com',
        companyName: 'Taylor Solutions',
        street: '852 Fir St',
        city: 'Charlottetown',
        postalCode: 'C1A 1M9',
        state: 'Prince Edward Island',
        country: 'Canada',
        phoneNo: '+19026549876',
        isActive: true,
      },
    ])
    .returning({ customerId: Customer.customerId, customerUUID: Customer.customerUUID });
  
  const customerIds = insertedCustomers.map((c) => c.customerId);
  const customerUUIDs = insertedCustomers.map((c) => c.customerUUID);
  
  // Utility function to generate a random date
  const getRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString()
      .split('T')[0];
  };
  
  // Insert invoices separately
  const invoices = await db.insert(Invoices).values([
    // John Doe with 5 invoices
    { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-001', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Initial invoice for services', isArchived: false },
    { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-002', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Invoice for added features', isArchived: false },
    { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-003', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Service charge for consultation', isArchived: false },
    { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-004', amount: '100.00', amountPaid: '100.00', invoiceStatus: InvoiceStatus.Paid, invoiceDate: getRandomDate(), invoiceNotes: 'Paid invoice', isArchived: false },
    { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-005', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Final invoice for project', isArchived: false },
  
    // Liam Brown (new customer) with 5 invoices
    { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-006', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Initial invoice for services', isArchived: false },
    { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-007', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Invoice for added features', isArchived: false },
    { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-008', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Service charge for consultation', isArchived: false },
    { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-009', amount: '100.00', amountPaid: '100.00', invoiceStatus: InvoiceStatus.Paid, invoiceDate: getRandomDate(), invoiceNotes: 'Paid invoice', isArchived: false },
    { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-010', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Final invoice for project', isArchived: false },
  
    // Remaining customers with 2 invoices each
    { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-011', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Consultation fee', isArchived: false },
    { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-012', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Additional services', isArchived: false },
  
    { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-013', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Pending invoice', isArchived: true },
    { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-014', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Final pending invoice', isArchived: true },
  
    { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-015', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Service fee', isArchived: false },
    { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-016', amount: '350.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Consulting fee', isArchived: false },
  
    // For inactive customers (with isActive: false), invoices have isArchived set to true
    { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-017', amount: '160.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Invoice for maintenance', isArchived: true },
    { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-018', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Service fee for improvements', isArchived: true },
  
    { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-019', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Invoice for new services', isArchived: true },
    { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-020', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: getRandomDate(), invoiceNotes: 'Final service fee', isArchived: true },
  ])
    .returning({ invoiceId: Invoices.invoiceId });
  
  


    console.log('✅ Seeded database successfully!');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  }
}

seedDB().catch((err) => console.error('❌ Error seeding:', err));
