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
  
  // // Utility function to generate a random date
  // const getRandomDate = () => {
  //   const start = new Date(2023, 0, 1);
  //   const end = new Date();
  //   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  //     .toISOString()
  //     .split('T')[0];
  // };
  
  // Insert invoices separately
  const invoices = await db.insert(Invoices).values([
   // John Doe with 10 invoices
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-001', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-01-15', invoiceNotes: 'Initial invoice for services', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-002', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-03-20', invoiceNotes: 'Invoice for added features', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-003', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-07-12', invoiceNotes: 'Service charge for consultation', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-004', amount: '100.00', amountPaid: '100.00', invoiceStatus: InvoiceStatus.Paid, invoiceDate: '2021-01-30', invoiceNotes: 'Paid invoice', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-005', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-08-05', invoiceNotes: 'Final invoice for project', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-006', amount: '175.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-02-18', invoiceNotes: 'Invoice for follow-up services', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-007', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-04-22', invoiceNotes: 'Invoice for maintenance', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-008', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-06-14', invoiceNotes: 'Consultation for new features', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-009', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-09-10', invoiceNotes: 'Service charge', isArchived: false },
  { customerId: customerIds[0], customerUUID: customerUUIDs[0], invoiceNumber: 'INV-010', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2024-12-25', invoiceNotes: 'Final services invoice', isArchived: false },

  // Jane Smith with 10 invoices
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-011', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-02-05', invoiceNotes: 'Consultation fee', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-012', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-07-25', invoiceNotes: 'Additional services', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-013', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-01-15', invoiceNotes: 'Service charge', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-014', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-09-10', invoiceNotes: 'Consulting fee', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-015', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-03-12', invoiceNotes: 'Invoice for new features', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-016', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-06-22', invoiceNotes: 'Follow-up charge', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-017', amount: '170.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-05-05', invoiceNotes: 'Maintenance services', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-018', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-09-30', invoiceNotes: 'Consultation for features', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-019', amount: '230.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-04-18', invoiceNotes: 'Invoice for feature enhancements', isArchived: false },
  { customerId: customerIds[1], customerUUID: customerUUIDs[1], invoiceNumber: 'INV-020', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2024-10-15', invoiceNotes: 'Final invoice', isArchived: false },

  // Alice Johnson with 10 invoices
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-021', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-03-10', invoiceNotes: 'Invoice for consultation', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-022', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-10-25', invoiceNotes: 'Service charge', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-023', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-06-14', invoiceNotes: 'Consulting for project', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-024', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-01-25', invoiceNotes: 'Service charge for maintenance', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-025', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-09-20', invoiceNotes: 'Invoice for follow-up work', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-026', amount: '230.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-03-18', invoiceNotes: 'Final invoice for features', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-027', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-12-10', invoiceNotes: 'Maintenance invoice', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-028', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-07-30', invoiceNotes: 'Invoice for additional work', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-029', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2024-02-10', invoiceNotes: 'Final invoice for project', isArchived: false },
  { customerId: customerIds[2], customerUUID: customerUUIDs[2], invoiceNumber: 'INV-030', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-01-18', invoiceNotes: 'Consultation charge', isArchived: false },

  // Bob Anderson with 10 invoices
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-031', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-04-14', invoiceNotes: 'Initial consultation', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-032', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-02-10', invoiceNotes: 'Service for new feature', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-033', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-11-03', invoiceNotes: 'Invoice for additional work', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-034', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-04-14', invoiceNotes: 'Final consulting charge', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-035', amount: '280.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-08-17', invoiceNotes: 'Invoice for follow-up service', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-036', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-02-12', invoiceNotes: 'Additional service fee', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-037', amount: '170.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-09-09', invoiceNotes: 'Consulting for optimization', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-038', amount: '240.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-06-15', invoiceNotes: 'Maintenance invoice', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-039', amount: '230.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-10-18', invoiceNotes: 'Final invoice', isArchived: false },
  { customerId: customerIds[3], customerUUID: customerUUIDs[3], invoiceNumber: 'INV-040', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2024-03-09', invoiceNotes: 'Project completion charge', isArchived: false },

  // Emma Wilson - Inactive
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-041', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-01-15', invoiceNotes: 'Consultation on marketing strategy', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-042', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-02-20', invoiceNotes: 'Project management services', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-043', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-03-25', invoiceNotes: 'Advertising campaign services', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-044', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-05-10', invoiceNotes: 'Strategy session', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-045', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-01-15', invoiceNotes: 'Market research services', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-046', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-03-10', invoiceNotes: 'Consultation on SEO', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-047', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-06-05', invoiceNotes: 'Market strategy development', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-048', amount: '230.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-07-25', invoiceNotes: 'Social media campaign', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-049', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-08-30', invoiceNotes: 'Branding strategy', isArchived: true },
  { customerId: customerIds[4], customerUUID: customerUUIDs[4], invoiceNumber: 'INV-050', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-10-10', invoiceNotes: 'Campaign analysis', isArchived: true },

  // Liam Brown - Active
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-051', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-05-10', invoiceNotes: 'Consulting services', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-052', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-03-25', invoiceNotes: 'Consulting for client development', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-053', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-06-15', invoiceNotes: 'Marketing strategy consultation', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-054', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-07-20', invoiceNotes: 'SEO services', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-055', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-01-12', invoiceNotes: 'Consultation for branding strategy', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-056', amount: '240.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-03-01', invoiceNotes: 'Strategy session', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-057', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-05-25', invoiceNotes: 'Advertising campaign management', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-058', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-07-15', invoiceNotes: 'Consultation on brand growth', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-059', amount: '240.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-08-10', invoiceNotes: 'Digital marketing strategy', isArchived: false },
  { customerId: customerIds[5], customerUUID: customerUUIDs[5], invoiceNumber: 'INV-060', amount: '260.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-09-05', invoiceNotes: 'Social media consultation', isArchived: false },

  // Olivia Davis - Active
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-061', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-08-05', invoiceNotes: 'Logistics service', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-062', amount: '230.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-12-12', invoiceNotes: 'Consultation on logistics strategy', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-063', amount: '210.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-04-10', invoiceNotes: 'Logistics improvement consultation', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-064', amount: '240.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-07-15', invoiceNotes: 'Logistics support', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-065', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-02-12', invoiceNotes: 'Supply chain consulting', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-066', amount: '280.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-04-18', invoiceNotes: 'Logistics optimization strategy', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-067', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-06-05', invoiceNotes: 'Consulting on delivery systems', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-068', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-08-10', invoiceNotes: 'Process improvement advice', isArchived: false },
  { customerId: customerIds[6], customerUUID: customerUUIDs[6], invoiceNumber: 'INV-069', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-09-15', invoiceNotes: 'Consultation for efficiency improvements', isArchived: false },

  // Noah Miller - Inactive
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-070', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-10-18', invoiceNotes: 'Consultation on industrial processes', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-071', amount: '280.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-12-20', invoiceNotes: 'Strategy planning', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-072', amount: '320.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-01-10', invoiceNotes: 'Industrial consultation', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-073', amount: '350.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-05-18', invoiceNotes: 'Process optimization consultation', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-074', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-09-02', invoiceNotes: 'Factory production system advice', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-075', amount: '290.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-03-01', invoiceNotes: 'Manufacturing consultation', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-076', amount: '310.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-06-15', invoiceNotes: 'Industrial optimization', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-077', amount: '330.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-01-10', invoiceNotes: 'Productivity improvement', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-078', amount: '350.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-03-10', invoiceNotes: 'Consultation on production enhancement', isArchived: true },
  { customerId: customerIds[7], customerUUID: customerUUIDs[7], invoiceNumber: 'INV-079', amount: '370.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-06-20', invoiceNotes: 'Manufacturing efficiency strategies', isArchived: true },

  // Sophia Wilson - Inactive
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-080', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2018-08-01', invoiceNotes: 'Engineering project consultation', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-081', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2019-10-05', invoiceNotes: 'Technology integration consultation', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-082', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2020-12-10', invoiceNotes: 'Systems engineering advice', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-083', amount: '290.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-03-10', invoiceNotes: 'Consultation on technical systems', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-084', amount: '310.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2021-06-15', invoiceNotes: 'Tech solution consultation', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-085', amount: '330.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-01-18', invoiceNotes: 'Engineering project oversight', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-086', amount: '350.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-04-01', invoiceNotes: 'Systems engineering project management', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-087', amount: '370.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2022-09-25', invoiceNotes: 'Project technical support', isArchived: true },
  { customerId: customerIds[8], customerUUID: customerUUIDs[8], invoiceNumber: 'INV-088', amount: '390.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2023-02-15', invoiceNotes: 'Consultation on system efficiency', isArchived: true },

// Ethan Taylor with 10 invoices
{ customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-089', amount: '150.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-01-10', invoiceNotes: 'Initial invoice for services', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-090', amount: '200.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-01-15', invoiceNotes: 'Invoice for added features', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-091', amount: '250.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-02-05', invoiceNotes: 'Service charge for consultation', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-092', amount: '100.00', amountPaid: '100.00', invoiceStatus: InvoiceStatus.Paid, invoiceDate: '2025-02-20', invoiceNotes: 'Paid invoice', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-093', amount: '300.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-02', invoiceNotes: 'Final invoice for project', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-094', amount: '180.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-08', invoiceNotes: 'Consultation fee', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-095', amount: '220.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-10', invoiceNotes: 'Invoice for additional services', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-096', amount: '270.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-12', invoiceNotes: 'Service charge for support', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-097', amount: '320.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-15', invoiceNotes: 'Invoice for consultation', isArchived: false },
  { customerId: customerIds[9], customerUUID: customerUUIDs[9], invoiceNumber: 'INV-098', amount: '350.00', amountPaid: '0.00', invoiceStatus: InvoiceStatus.Unpaid, invoiceDate: '2025-03-20', invoiceNotes: 'Final project invoice', isArchived: false },
  ])
    .returning({ invoiceId: Invoices.invoiceId });
  
  


    console.log('✅ Seeded database successfully!');
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  }
}

seedDB().catch((err) => console.error('❌ Error seeding:', err));
