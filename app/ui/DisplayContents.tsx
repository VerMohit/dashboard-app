import { CustomerRequestData } from '../types/customerTypes';
import { InvoiceTableData } from '../types/invoiceTypes';
import { getBaseUrl } from '../utility/getBaseUrl';
import { TabularDisplay } from './TabularDisplay';

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
    const baseURL = await getBaseUrl();

    const response = await fetch(`${baseURL}${apiResource}${queryParams}`);

    if (!response.ok) {
      throw new Error(`Couldn't retreive ${apiResource} data.`);
    }

    const data: CustomerRequestData[] | InvoiceTableData[] = await response.json();

    return <TabularDisplay tableHeadings={displayHeadings} data={data} dataType={dataType} />;

    // return <p>placeholder text</p>;
  } catch (error) {
    console.error(`Error fetching ${apiResource} data:`, error);

    return <p>Error: Unable to fetch {apiResource} data. Please try again later.</p>;
  }
}
