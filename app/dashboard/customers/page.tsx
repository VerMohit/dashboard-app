import { IoPersonAddSharp } from 'react-icons/io5';
import { Button, Container, Flex } from '@mantine/core';
import { lusitana, roboto } from '@/app/ui/fonts';
import FilterOptions from '@/app/ui/FormUI/FilterOptions';
import Search from '@/app/ui/Search';
import { DisplayContents } from '@/app/ui/TabularDisplay/DisplayContents';

// UPDATED TYPES

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
      <h1 className={`${roboto.className} text-2xl`}>Customers</h1>
      <Search placeholder="Search customers..." />
      <br />
      <FilterOptions whichCategory="customer" />
      <Flex justify="flex-end" my="1rem">
        <Button component="a" href="./customers/newCustomer" radius="5px">
          <Flex gap="0.5rem" justify="center" align="center">
            <IoPersonAddSharp />
            Add Customer
          </Flex>
        </Button>
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
