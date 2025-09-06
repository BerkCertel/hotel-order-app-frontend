"use client";

import { Toaster } from "../ui/sonner";
import UserProvider from "@/context/userContext";
import RateLimitModal from "../modals/RateLimitModal";

import StoreProvider from "./StoreProvider";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <StoreProvider>
      <UserProvider>
        <RateLimitModal />
        {children} <Toaster />
      </UserProvider>
    </StoreProvider>
  );
}

export default ProvidersWrapper;
