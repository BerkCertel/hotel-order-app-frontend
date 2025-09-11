"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedPageProvider from "@/components/Providers/ProtectedPageProvider";

import { useUserAuth } from "@/hooks/useUserAuth";
import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  useUserAuth();

  return (
    <AdminLayout>
      {/* <ProtectedPageProvider
        allowedRoles={["ADMIN", "SUPERADMIN"]}
        redirectTo="/"
      > */}
      {children}
      {/* </ProtectedPageProvider> */}
    </AdminLayout>
  );
}

export default AdminPageMainLayout;
