"use client";

import AdminLayout from "@/components/layouts/AdminLayout";

import { useUserAuth } from "@/hooks/useUserAuth";
import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  useUserAuth();

  return <AdminLayout>{children}</AdminLayout>;
}

export default AdminPageMainLayout;
