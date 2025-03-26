import { requestData } from '@/app/types/SpecializedTypes';
import { CustomerRequestData, FetchedCustomerData } from '../../types/customerTypes';
import { FetchedInvoiceData, InvoiceTableData } from '../../types/invoiceTypes';
import { getBaseUrlServerSide } from '../../utility/getBaseUrlServerSide';
import { TabularDisplay } from './TabularDisplay';

// export type requestData = { customers: FetchedCustomerData } | { invoices: FetchedInvoiceData };

export async function DisplayContents({
  queryParams,
  apiResource,
  displayHeadings,
  dataType,
}: {
  queryParams: string;
  apiResource: string;
  displayHeadings: string[];
  dataType: 'customer' | 'invoice';
}) {
  try {
    const baseURL = await getBaseUrlServerSide();

    const response = await fetch(`${baseURL}${apiResource}${queryParams}`);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    // const data: CustomerRequestData[] | InvoiceTableData[] = await response.json();
    const data: requestData[] = await response.json();

    // console.log(data);

    return <TabularDisplay tableHeadings={displayHeadings} data={data} dataType={dataType} />;
  } catch (error) {
    console.error(`Error fetching ${apiResource} data:`, error);

    return <p>Error: Unable to fetch {apiResource} data. Please try again later.</p>;
  }
}
