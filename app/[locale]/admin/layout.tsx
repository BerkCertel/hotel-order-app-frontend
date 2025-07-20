import React from "react";

interface AdminPageMainLayoutProps {
  children?: React.ReactNode;
}

function AdminPageMainLayout({ children }: AdminPageMainLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {children}
    </div>
  );
}

export default AdminPageMainLayout;
