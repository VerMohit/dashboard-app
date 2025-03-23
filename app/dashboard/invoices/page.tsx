import { AiFillFileAdd } from 'react-icons/ai';
import { Button, Container, Flex } from '@mantine/core';
import { lusitana } from '@/app/ui/fonts';
import FilterOptions from '@/app/ui/FormUI/FilterOptions';
import LinkButton from '@/app/ui/LinkButton';
import Search from '@/app/ui/Search';
import { DisplayContents } from '@/app/ui/TabularDisplay/DisplayContents';

export default async function Page(queryParmas: {
  searchParams?: Promise<{
    query?: string;
    sortDate?: string;
    invoiceStatus?: string;
  }>;
}) {
  const params = new URLSearchParams();
  const resolvedParams = await queryParmas.searchParams;
  const query = resolvedParams?.query ?? '';
  const sortDate = resolvedParams?.sortDate ?? 'DESC';
  const invoiceStatus = resolvedParams?.invoiceStatus ?? 'all';

  params.set('query', query);
  params.set('sortDate', sortDate);
  params.set('invoiceStatus', invoiceStatus);

  const queryString = params.size > 0 ? `?${params.toString()}` : '';

  const displayHeadings = [
    'Invoice #',
    'Name',
    'Restauarnt',
    'Amount',
    'Balance',
    'Date',
    '',
    // 'Status',
  ];

  return (
    <Container>
      <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      <Search placeholder="Search invoices..." />
      <br />
      {/* <InvoiceFilter /> */}
      <FilterOptions whichCategory="invoice" />
      <Flex justify="flex-end" my="1rem">
        <LinkButton link="./invoices/newInvoice" label="Add Invoice" icon={<AiFillFileAdd />} />
      </Flex>
      <DisplayContents
        queryParams={queryString}
        apiResource="invoices"
        displayHeadings={displayHeadings}
        dataType="invoice"
      />
    </Container>
  );
}
