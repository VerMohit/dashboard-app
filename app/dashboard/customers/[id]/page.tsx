import { FetchedCustomerAndInvoiceData } from '@/app/types/SpecializedTypes';
import CustomerView from '@/app/ui/CustomerView';
import { getBaseUrlServerSide } from '@/app/utility/getBaseUrlServerSide';

type respData = {
  // data: InvoiceTableData[];
  data: FetchedCustomerAndInvoiceData[];
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

  console.log(data);

  const customer = data[0].customers;

  const invoices = data.filter((item) => item.invoices != null).map((item) => item.invoices);

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
