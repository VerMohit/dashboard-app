import { Button, Flex } from '@mantine/core';

type CustomButtonProps = {
  link: string;
  label: string;
  icon: React.ReactNode;
};

export default function CustomButton({ link, label, icon }: CustomButtonProps) {
  return (
    <Flex justify="flex-end" my="1rem">
      <Button component="a" href={link} radius="50px">
        <Flex gap="0.5rem" justify="center" align="center">
          {icon}
          {label}
        </Flex>
      </Button>
    </Flex>
  );
}
