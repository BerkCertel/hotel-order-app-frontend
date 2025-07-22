import React from "react";

export function ItemContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
