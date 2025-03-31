import Link from 'next/link';
import { Button, Flex, Title } from '@mantine/core';

export default function HomePage() {
  return (
    <Flex direction="column" align="center" pt="2rem" rowGap="2rem">
      <Title>DashApp</Title>

      <Link href="/dashboard/">
        <Button mx="auto" h={35} mt="sm">
          Log In
        </Button>
      </Link>
    </Flex>
  );
}
