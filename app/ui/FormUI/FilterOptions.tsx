'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import RadioButtons from '../RadioButtons';

export default function FilterOptions({
  whichCategory,
}: {
  whichCategory: 'customer' | 'invoice';
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sortDate, setSortDate] = useState('DESC');
  const [invoiceStatus, setInvoiceStatus] = useState('All');
  const [isActive, setIsActive] = useState('all');

  useEffect(() => {
    whichCategory === 'invoice'
      ? (setSortDate(searchParams.get('sortDate') || 'DESC'),
        setInvoiceStatus(searchParams.get('invoiceStatus') || 'All'))
      : setIsActive(searchParams.get('isActive') || 'all');
  }, [searchParams]);

  return (
    <div>
      {whichCategory === 'invoice' ? (
        <>
          <RadioButtons
            name="filter-invoices-by-date"
            label="Date Issued:"
            filterType="sortDate"
            stateValue={sortDate}
            setState={setSortDate}
            radioProps={[
              { radioValue: 'DESC', radioLabel: 'Newest - Oldest' },
              { radioValue: 'ASC', radioLabel: 'Oldest - Newest' },
            ]}
            searchParams={searchParams}
            pathname={pathname}
            replace={replace}
          />
          <br />
          <RadioButtons
            name="filter-invoices-by-status"
            label="Invoice Status:"
            filterType="invoiceStatus"
            stateValue={invoiceStatus}
            setState={setInvoiceStatus}
            radioProps={[
              { radioValue: 'All', radioLabel: 'All' },
              { radioValue: 'Paid', radioLabel: 'Paid' },
              { radioValue: 'Unpaid', radioLabel: 'Unpaid' },
            ]}
            searchParams={searchParams}
            pathname={pathname}
            replace={replace}
          />
        </>
      ) : (
        <>
          <RadioButtons
            name="filter-customer-by-active-status"
            label="Customer Status:"
            stateValue={isActive}
            setState={setIsActive}
            radioProps={[
              { radioValue: 'all', radioLabel: 'All' },
              { radioValue: 'true', radioLabel: 'Active' },
              { radioValue: 'false', radioLabel: 'Inactive' },
            ]}
            searchParams={searchParams}
            pathname={pathname}
            replace={replace}
          />
        </>
      )}
    </div>
  );
}
