import UserProvider from "@/context/userContext";
import { Toaster } from "../ui/sonner";
import { RateLimitModal } from "../modals/RateLimitModal";
import StoreProvider from "./StoreProvider";

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
