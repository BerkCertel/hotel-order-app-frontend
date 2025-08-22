"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import { useUserAuth } from "@/hooks/useUserAuth";

interface UserPageLayoutProps {
  children?: React.ReactNode;
}

export default function UserPageLayout({ children }: UserPageLayoutProps) {
  useUserAuth();

  return <AdminLayout>{children}</AdminLayout>;
}
