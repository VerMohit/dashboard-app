import { AiFillFileAdd } from 'react-icons/ai';
import { Box, Button, Container, Flex, Title } from '@mantine/core';
import FilterOptions from '@/app/ui/FormUI/FilterOptions';
import Search from '@/app/ui/Search';
import { DisplayContents } from '@/app/ui/TabularDisplay/DisplayContents';

// UPDATED TYPES

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

  const displayHeadings = ['Invoice #', 'Name', 'Restauarnt', 'Amount', 'Balance', 'Date', ''];

  return (
    <Box px="md">
      <Title order={2} size="h1" mb="lg">
        Invoices
      </Title>
      <div style={{ width: '80%', marginInline: 'auto' }}>
        <Search placeholder="Search invoices..." />
        <FilterOptions whichCategory="invoice" />
      </div>
      <Container>
        <Flex justify="flex-end" my="1rem">
          <Button component="a" href="./invoices/newInvoice" radius="5px">
            <Flex gap="0.5rem" justify="center" align="center">
              <AiFillFileAdd />
              Add Invoice
            </Flex>
          </Button>
        </Flex>
        <DisplayContents
          queryParams={queryString}
          apiResource="invoices"
          displayHeadings={displayHeadings}
          dataType="invoice"
        />
      </Container>
    </Box>
  );
}
