import { CustomerRequestData } from '@/app/types/customerTypes';
import { InvoiceRequestData, InvoiceTableData } from '@/app/types/invoiceTypes';
import CustomerView from '@/app/ui/CustomerView';
import { getBaseUrlServerSide } from '@/app/utility/getBaseUrlServerSide';

type respData = {
  data: InvoiceTableData[];
  totalInvoiceDetails: {
    balanceDue: number;
    totalInvoices: number;
    totalUnpaidInvoices: number;
  }[];
};

export default async function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const resolvedParams = await params;
  const custId = resolvedParams.id;

  const baseURL = await getBaseUrlServerSide();
  const response = await fetch(`${baseURL}customers/${custId}`);
  const { data, totalInvoiceDetails }: respData = await response.json();

  const customer: CustomerRequestData = data[0].customers;

  const invoices: InvoiceRequestData[] = data
    .filter((item) => item.invoices != null)
    .map((item) => item.invoices);

  return (
    <div>
      <CustomerView
        customerDetails={customer}
        invoiceDetails={invoices}
        totalInvoiceDetails={totalInvoiceDetails}
      />
    </div>
  );
}
