"use client";

import UserLayout from "@/components/layouts/user/UserLayout";
import ProtectedPageProvider from "@/components/Providers/ProtectedPageProvider";
import { useUserAuth } from "@/hooks/useUserAuth";

interface UserPageLayoutProps {
  children?: React.ReactNode;
}

export default function UserPageLayout({ children }: UserPageLayoutProps) {
  useUserAuth();

  return (
    <UserLayout>
      <ProtectedPageProvider allowedRoles={["USER"]} redirectTo="/">
        {children}
      </ProtectedPageProvider>
    </UserLayout>
  );
}
