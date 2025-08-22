"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedPageProvider from "@/components/Providers/ProtectedPageProvider";
import { useUserAuth } from "@/hooks/useUserAuth";

interface UserPageLayoutProps {
  children?: React.ReactNode;
}

export default function UserPageLayout({ children }: UserPageLayoutProps) {
  useUserAuth();

  return (
    <AdminLayout>
      <ProtectedPageProvider allowedRoles={["USER"]} redirectTo="/">
        {children}
      </ProtectedPageProvider>
    </AdminLayout>
  );
}
