import { FetchedCustomerAndInvoiceData } from '@/app/types/SpecializedTypes';
import InvoiceView from '@/app/ui/InvoiceView';
import { getBaseUrlServerSide } from '@/app/utility/getBaseUrlServerSide';

type respData = {
  data: FetchedCustomerAndInvoiceData[];
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

  const customer = data[0].customers;

  const invoices = data[0].invoices;

  return (
    <div>
      <InvoiceView customerDetails={customer} invoiceDetails={invoices} />
    </div>
  );
}
