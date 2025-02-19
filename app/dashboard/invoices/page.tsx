import { Container } from '@mantine/core';
import { DisplayContents } from '@/app/ui/DisplayContents';
import { lusitana } from '@/app/ui/fonts';
import { InvoiceFilter } from '@/app/ui/InvoiceFilter';
import Search from '@/app/ui/Search';

export default async function Page(queryParmas: {
  searchParams?: Promise<{
    query?: string;
    sortDate?: string;
    invoiceStatus?: string;
  }>;
}) {
  const params = new URLSearchParams();
  const resolvedParams = await queryParmas.searchParams;
  const query = resolvedParams?.query;
  const sortDate = resolvedParams?.sortDate;
  const invoiceStatus = resolvedParams?.invoiceStatus;

  params.set('query', query ?? '');
  params.set('sortDate', sortDate ?? 'DESC');
  params.set('invoiceStatus', invoiceStatus ?? '');

  const queryString = params.size > 0 ? `?${params.toString()}` : '';

  const displayHeadings = [
    'Name',
    'Restauarnt',
    'Amount',
    'Balance',
    'Date',
    'Invoice #',
    '',
    // 'Status',
  ];

  return (
    <Container>
      <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      <Search placeholder="Search invoices..." />
      <InvoiceFilter />
      <DisplayContents
        queryParams={queryString}
        apiResource="invoices"
        displayHeadings={displayHeadings}
        dataType="invoice"
      />
    </Container>
  );
}
