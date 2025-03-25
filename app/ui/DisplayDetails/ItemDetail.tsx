import { Flex } from '@mantine/core';

// Defining method signature as union type
type FormattingMethod = ((value: string) => string) | ((value: string[]) => string);

type Params = {
  label: string;
  value: string | string[];
  formatMethod?: FormattingMethod;
};

export default function ItemDetail({ label, value, formatMethod }: Params) {
  let displayValue = value;

  if (formatMethod) {
    // Narrow down the type of formatMethod based on the value passed in
    displayValue = Array.isArray(value)
      ? (formatMethod as (value: string[]) => string)(value)
      : (formatMethod as (value: string) => string)(value);
  }

  return (
    <Flex mb="md">
      <div style={{ fontWeight: '600', width: '150px' }}>{label}:</div>
      <div style={{ wordWrap: 'break-word', flex: 1 }}>{displayValue}</div>
    </Flex>
  );
}
