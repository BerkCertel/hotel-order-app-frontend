"use client";

import { useUserAuth } from "@/hooks/useUserAuth";
import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  useUserAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AdminPageMainLayout;
