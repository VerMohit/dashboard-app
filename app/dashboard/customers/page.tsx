import { Container } from '@mantine/core';
import { CustomerFilter } from '@/app/ui/CustomerFilter';
import { DisplayContents } from '@/app/ui/DisplayContents';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/Search';

export default async function Page(queryParmas: {
  searchParams?: Promise<{
    query?: string;
    isActive?: string;
  }>;
}) {
  const params = new URLSearchParams();
  const resolvedParams = await queryParmas.searchParams;
  const query = resolvedParams?.query;
  const isActive = resolvedParams?.isActive;

  // if (query) {
  params.set('query', query ?? '');
  // }

  params.set('isActive', isActive ?? 'true');

  const queryString = params.size > 0 ? `?${params.toString()}` : '';

  const displayHeadings = ['Name', 'Restauarnt', 'Phone Number', 'Email'];

  return (
    <Container>
      <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      <Search placeholder="Search customers..." />
      <CustomerFilter />
      <DisplayContents
        queryParams={queryString}
        apiResource="customers"
        displayHeadings={displayHeadings}
        dataType="customer"
      />
    </Container>
  );
}
