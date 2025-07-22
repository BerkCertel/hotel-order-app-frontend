import React from "react";

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`container mx-auto w-full min-h-screen ${className}`}>
      {children}
    </div>
  );
}
