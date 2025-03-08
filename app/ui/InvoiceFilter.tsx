'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Group, Radio } from '@mantine/core';

export function InvoiceFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sortDate, setSortDate] = useState('DESC');
  const [invoiceStatus, setInvoiceStatus] = useState('All');

  useEffect(() => {
    const newsortDate = searchParams.get('sortDate');
    if (newsortDate) {
      setSortDate(newsortDate);
    }

    const newInvoiceStatus = searchParams.get('invoiceStatus');
    if (newInvoiceStatus) {
      setInvoiceStatus(newInvoiceStatus);
    }
  }, [searchParams]);

  // Modify this based on the radio group...refer to CustomerFilter for necessary mods
  function setFilteredQuery(filterType: 'sortDate' | 'invoiceStatus', newValue: string): void {
    const params = new URLSearchParams(searchParams);

    const query = searchParams.get('query');
    if (query) {
      params.set('query', query);
    }

    params.set(`${filterType}`, newValue);

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <Radio.Group
        name="filter-invoices-by-date"
        label="Order by Issue Date:"
        value={sortDate}
        onChange={(newValue) => {
          setSortDate(newValue);
          setFilteredQuery('sortDate', newValue);
        }}
      >
        <Group mt="xs">
          <Radio value="DESC" label="Newest - Oldest" checked />
          <Radio value="ASC" label="Oldest - Newest" />
        </Group>
      </Radio.Group>

      <Radio.Group
        name="filter-invoices-by-status"
        label="Order by Invoice Status:"
        value={invoiceStatus}
        onChange={(newValue) => {
          setInvoiceStatus(newValue);
          setFilteredQuery('invoiceStatus', newValue);
        }}
      >
        <Group mt="xs">
          <Radio value="All" label="All" checked />
          <Radio value="Paid" label="Paid" />
          <Radio value="Unpaid" label="Unpaid" />
        </Group>
      </Radio.Group>
    </div>
  );
}
