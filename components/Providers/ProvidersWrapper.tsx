import React from "react";
import StoreProvider from "./StoreProvider";
import { Toaster } from "../ui/sonner";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <>
      <StoreProvider>
        {children} <Toaster />
      </StoreProvider>
    </>
  );
}

export default ProvidersWrapper;
