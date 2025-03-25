import { Button, Flex } from '@mantine/core';

type LinkButtonProps = {
  link?: string;
  label: string;
  icon?: React.ReactNode;
};

export default function LinkButton({ link, label, icon }: LinkButtonProps) {
  return (
    <div>
      <Button component="a" href={link} radius="5px">
        <Flex gap="0.5rem" justify="center" align="center">
          {icon}
          {label}
        </Flex>
      </Button>
    </div>
  );
}
