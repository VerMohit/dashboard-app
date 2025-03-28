'use client';

import { DashboardShell } from '../ui/DashboardShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
