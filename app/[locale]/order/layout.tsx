"use client";

import OrderSuccessModal from "@/components/modals/OrderSuccessModal";
import PreOrderStatusProvider from "@/components/modals/PreOrderStatusModal";
import { HotelAuthProvider } from "@/context/HotelAuthProvider";

import React from "react";

interface OrderLayoutProps {
  children?: React.ReactNode;
}

function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <HotelAuthProvider>
      <PreOrderStatusProvider />
      <OrderSuccessModal />
      {children}
    </HotelAuthProvider>
  );
}

export default OrderLayout;
