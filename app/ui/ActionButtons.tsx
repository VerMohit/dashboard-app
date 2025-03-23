import { Dispatch, SetStateAction } from 'react';
import { Button, Flex } from '@mantine/core';

type CustomButtonProps = {
  label1: string;
  icon1: React.ReactNode;
  onClick1: () => void;
  label2: string;
  icon2: React.ReactNode;
  onClick2: (e: React.FormEvent) => Promise<void>;
};

export default function ActionButtons({
  label1,
  icon1,
  onClick1,
  label2,
  icon2,
  onClick2,
}: CustomButtonProps) {
  return (
    <Flex>
      <Button type="button" onClick={onClick1}>
        {icon1}
        {label1}
      </Button>
      <Button type="button" onClick={onClick2}>
        {icon2}
        {label2}
      </Button>

      {/* <Button type="submit">Submit</Button> */}
    </Flex>
  );
}
