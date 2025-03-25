import { CustomerRequestData } from '@/app/types/customerTypes';
import { InvoiceRequestData, InvoiceTableData } from '@/app/types/invoiceTypes';
import InvoiceView from '@/app/ui/InvoiceView';
import { getBaseUrlServerSide } from '@/app/utility/getBaseUrlServerSide';

type respData = {
  data: InvoiceTableData[];
};

export default async function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const baseURL = await getBaseUrlServerSide();
  const response = await fetch(`${baseURL}invoices/${invoiceId}`);
  const { data }: respData = await response.json();

  //   console.log(data);

  const customer: CustomerRequestData = data[0].customers;

  const invoices: InvoiceRequestData = data[0].invoices;

  return (
    <div>
      <InvoiceView customerDetails={customer} invoiceDetails={invoices} />
    </div>
  );
}
