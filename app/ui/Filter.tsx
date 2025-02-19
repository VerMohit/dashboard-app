'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Group, Radio } from '@mantine/core';

export function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isActive, setIsActive] = useState('true');

  useEffect(() => {
    const activeParam = searchParams.get('isActive');
    if (activeParam) {
      setIsActive(activeParam);
    }
  }, [searchParams]);

  function setFilteredQuery(newValue: string): void {
    const params = new URLSearchParams(searchParams);

    const query = searchParams.get('query');
    if (query) {
      params.set('query', query);
    }

    params.set('isActive', newValue);

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Radio.Group
      name="filter customer by activity"
      label="Customer Status:"
      value={isActive}
      onChange={(newValue) => {
        setIsActive(newValue);
        setFilteredQuery(newValue);
      }}
    >
      <Group mt="xs">
        <Radio value="true" label="Active" />
        <Radio value="false" label="Inactive" />
      </Group>
    </Radio.Group>
  );
}
