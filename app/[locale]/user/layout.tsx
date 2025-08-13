"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserAuth } from "@/hooks/useUserAuth";

interface UserPageLayoutProps {
  children?: React.ReactNode;
}

export default function UserPageLayout({ children }: UserPageLayoutProps) {
  useUserAuth();

  return <DashboardLayout>{children}</DashboardLayout>;
}
