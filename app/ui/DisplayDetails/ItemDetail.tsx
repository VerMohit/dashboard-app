import { Flex } from '@mantine/core';

type formattingMethod = ((value: string) => string) | ((value: string[]) => string);

type Params = {
  label: string;
  value: string | string[];
  formatMethod?: formattingMethod;
};

export default function ItemDetail({ label, value, formatMethod }: Params) {
  const displayValue = formatMethod
    ? formatMethod(value)
    : Array.isArray(value)
      ? value.join(', ')
      : value;

  return (
    <Flex mb="md">
      <div style={{ fontWeight: '600', width: '150px' }}>{label}: </div>
      {displayValue}
    </Flex>
  );
}
