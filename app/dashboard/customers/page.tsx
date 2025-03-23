import { IoPersonAddSharp } from 'react-icons/io5';
import { Container, Flex } from '@mantine/core';
import { lusitana } from '@/app/ui/fonts';
import FilterOptions from '@/app/ui/FormUI/FilterOptions';
import LinkButton from '@/app/ui/LinkButton';
import Search from '@/app/ui/Search';
import { DisplayContents } from '@/app/ui/TabularDisplay/DisplayContents';

export default async function Page(queryParmas: {
  searchParams?: Promise<{
    query?: string;
    isActive?: string;
  }>;
}) {
  const params = new URLSearchParams();
  const resolvedParams = await queryParmas.searchParams;
  const query = resolvedParams?.query ?? '';
  const isActive = resolvedParams?.isActive ?? 'all';

  params.set('query', query);

  params.set('isActive', isActive);

  const queryString = params.size > 0 ? `?${params.toString()}` : '';

  const displayHeadings = ['Name', 'Restauarnt', 'Phone Number', 'Email', ''];

  return (
    <Container>
      <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      <Search placeholder="Search customers..." />
      <br />
      <FilterOptions whichCategory="customer" />
      <Flex justify="flex-end" my="1rem">
        <LinkButton
          link="./customers/newCustomer"
          label="Add Customer"
          icon={<IoPersonAddSharp />}
        />
      </Flex>
      <DisplayContents
        queryParams={queryString}
        apiResource="customers"
        displayHeadings={displayHeadings}
        dataType="customer"
      />
    </Container>
  );
}
