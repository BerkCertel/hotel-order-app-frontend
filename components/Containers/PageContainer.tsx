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
      className={`container  px-4 mx-auto pt-8 w-full h-full  flex flex-col gap-8 ${className}`}
    >
      {children}
    </div>
  );
}
