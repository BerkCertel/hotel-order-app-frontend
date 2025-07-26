"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useUserAuth } from "@/hooks/useUserAuth";
import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  useUserAuth();

  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}

export default AdminPageMainLayout;
