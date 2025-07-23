import React from "react";
import StoreProvider from "./StoreProvider";
import { Toaster } from "../ui/sonner";
import UserProvider from "@/context/userContext";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <>
      <UserProvider>
        <StoreProvider>
          {children} <Toaster />
        </StoreProvider>
      </UserProvider>
    </>
  );
}

export default ProvidersWrapper;
