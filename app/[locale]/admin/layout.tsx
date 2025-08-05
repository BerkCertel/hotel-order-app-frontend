"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useUserAuth } from "@/hooks/useUserAuth";
import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  useUserAuth();

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default AdminPageMainLayout;
