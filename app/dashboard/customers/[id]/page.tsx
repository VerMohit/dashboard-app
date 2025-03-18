import { CustomerRequestData } from '@/app/types/customerTypes';
import { InvoiceRequestData, InvoiceTableData } from '@/app/types/invoiceTypes';
import CustomerView from '@/app/ui/CustomerView';
import { getBaseUrlServerSide } from '@/app/utility/getBaseUrlServerSide';

type respData = {
  data: InvoiceTableData[];
  remainingBalanceSum: { balance: number }[];
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
  // const data: InvoiceTableData[] = await response.json();
  const { data, remainingBalanceSum }: respData = await response.json();

  // console.log(data);
  // console.log(typeof remainingBalanceSum);
  // console.log(remainingBalanceSum[0].balance);

  const customer: CustomerRequestData = data[0].customers;

  const invoices: InvoiceRequestData[] = data.map((item) => item.invoices);

  const sumBalance = remainingBalanceSum[0].balance;
  console.log(sumBalance);

  // console.log(customer);
  // console.log(invoices);

  return (
    <div>
      {/* <h3>Customer Details</h3> */}
      <CustomerView customerDetails={customer} invoiceDetails={invoices} sumBalance={sumBalance} />
    </div>
  );

  return <div>CustomerID: {custId}</div>;
}
