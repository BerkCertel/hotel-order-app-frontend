"use client";

import UserProvider from "@/context/userContext";
import RateLimitModal from "../modals/RateLimitModal";
import StoreProvider from "./StoreProvider";
import { Toaster } from "../ui/sonner";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <StoreProvider>
      <UserProvider>
        <RateLimitModal />
        {children}
        <Toaster />
      </UserProvider>
    </StoreProvider>
  );
}
