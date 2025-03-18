import { Dispatch, SetStateAction } from 'react';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Flex, Group, Radio, Text } from '@mantine/core';

type setFilteredQueryProps = {
  newValue: string;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
  replace: (href: string, options?: NavigateOptions) => void;
  filterType?: 'sortDate' | 'invoiceStatus';
};

function setFilteredQuery({
  newValue,
  searchParams,
  pathname,
  replace,
  filterType,
}: setFilteredQueryProps): void {
  const params = new URLSearchParams(searchParams);

  const query = searchParams.get('query');
  if (query) {
    params.set('query', query);
  }

  if (filterType) {
    params.set(`${filterType}`, newValue);
  } else {
    params.set('isActive', newValue);
  }

  replace(`${pathname}?${params.toString()}`);
}

type RadioOption = {
  radioValue: string;
  radioLabel: string;
};

type RadioProps = {
  name: string;
  label: string;
  stateValue: string;
  filterType?: 'sortDate' | 'invoiceStatus';
  setState: Dispatch<SetStateAction<string>>;
  radioProps: RadioOption[];
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
  replace: (href: string, options?: NavigateOptions) => void;
};

export default function RadioButtons({
  name,
  label,
  stateValue,
  filterType,
  setState,
  radioProps,
  searchParams,
  pathname,
  replace,
}: RadioProps) {
  return (
    <Flex justify="flex-start" align="center" gap="sm">
      <Text style={{ fontWeight: 'bold', width: '150px' }}>{label}</Text>
      <Radio.Group
        name={name}
        value={stateValue}
        onChange={(newValue) => {
          setState(newValue);
          setFilteredQuery({ newValue, searchParams, pathname, replace, filterType });
        }}
      >
        <Group>
          {radioProps.map((radioParams, index) => (
            <Radio
              key={index}
              value={radioParams.radioValue}
              label={radioParams.radioLabel}
              checked={stateValue === radioParams.radioValue}
            />
          ))}
        </Group>
      </Radio.Group>
    </Flex>
  );
}
