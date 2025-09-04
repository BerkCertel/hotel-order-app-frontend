"use client";
import React from "react";
import { Toaster } from "../ui/sonner";
import UserProvider from "@/context/userContext";
import RateLimitModal from "../modals/RateLimitModal";
import dynamic from "next/dynamic";
const StoreProvider = dynamic(() => import("../Providers/StoreProvider"), {
  ssr: false,
});

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <UserProvider>
      <StoreProvider>
        <RateLimitModal />
        {children} <Toaster />
      </StoreProvider>
    </UserProvider>
  );
}

export default ProvidersWrapper;
