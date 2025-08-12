import React from "react";
import StoreProvider from "./StoreProvider";
import { Toaster } from "../ui/sonner";
import UserProvider from "@/context/userContext";
import RateLimitModal from "../modals/RateLimitModal";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <>
      <UserProvider>
        <StoreProvider>
          <RateLimitModal />
          {children} <Toaster />
        </StoreProvider>
      </UserProvider>
    </>
  );
}

export default ProvidersWrapper;
