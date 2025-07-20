import React from "react";
import StoreProvider from "./StoreProvider";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <>
      <StoreProvider>{children}</StoreProvider>
    </>
  );
}

export default ProvidersWrapper;
