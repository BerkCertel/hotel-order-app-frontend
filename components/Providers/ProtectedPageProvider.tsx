"use client";

import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ProtectedPageProviderProps = {
  allowedRoles: string[];
  redirectTo?: string;
  children: React.ReactNode;
};

export default function ProtectedPageProvider({
  allowedRoles,
  redirectTo = "/",
  children,
}: ProtectedPageProviderProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // user null ise loading göster
    if (user === null) {
      setChecked(false);
      return;
    }
    // role uyumsuzsa yönlendir
    if (!allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
      setChecked(false);
      return;
    }
    setChecked(true);
  }, [user, allowedRoles, router, redirectTo]);

  if (user === null || !checked) {
    return (
      <Dialog open={true}>
        <DialogContent className="flex flex-col items-center gap-4">
          <DialogHeader>
            <DialogTitle>Redirecting...</DialogTitle>
          </DialogHeader>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-muted-foreground">Please wait</div>
        </DialogContent>
      </Dialog>
    ); // loading ekranı
  }

  return <>{children}</>;
}
