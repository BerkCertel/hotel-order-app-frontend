import React from "react";

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`container mx-auto mt-8  w-full h-full flex flex-col gap-10 ${className}`}
    >
      {children}
    </div>
  );
}
