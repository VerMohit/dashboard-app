'sue client';

import React from 'react';
import Link from 'next/link';
import { AppShell, Burger, Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { roboto } from '@/app/ui/fonts';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const buttonDetails = [
    { label: 'Home', link: '/dashboard' },
    { label: 'Customers', link: '/dashboard/customers/' },
    { label: 'Invoices', link: '/dashboard/invoices/' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>DashApp</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className={`${roboto.className}`}>
        {/* Page Navigation */}
        {buttonDetails.map((bttn, index) => (
          <Link key={index} href={bttn.link}>
            <Button h={35} w="100%" mt="sm">
              {bttn.label}
            </Button>
          </Link>
        ))}
      </AppShell.Navbar>
      <AppShell.Main className={`${roboto.className}`}>{children}</AppShell.Main>
    </AppShell>
  );
}
