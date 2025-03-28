import { IoPersonAddSharp } from 'react-icons/io5';
import { Box, Button, Container, Flex, Title } from '@mantine/core';
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
    <Box px="md">
      <Title order={2} size="h1" mb="lg" px="md">
        Customers
      </Title>
      <div style={{ width: '80%', marginInline: 'auto' }}>
        <Search placeholder="Search customers..." />
        <FilterOptions whichCategory="customer" />
      </div>
      <Container>
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
    </Box>
  );
}
