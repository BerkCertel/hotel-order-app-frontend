"use client";

import { HotelAuthProvider } from "@/context/HotelAuthProvider";

import React from "react";

interface OrderLayoutProps {
  children?: React.ReactNode;
}

function OrderLayout({ children }: OrderLayoutProps) {
  return <HotelAuthProvider>{children}</HotelAuthProvider>;
}

export default OrderLayout;
