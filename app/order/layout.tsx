"use client";

import OrderSuccessModal from "@/components/modals/OrderSuccessModal";
import { HotelAuthProvider } from "@/context/HotelAuthProvider";

import React from "react";

interface OrderLayoutProps {
  children?: React.ReactNode;
}

function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <HotelAuthProvider>
      <OrderSuccessModal />
      {children}
    </HotelAuthProvider>
  );
}

export default OrderLayout;
