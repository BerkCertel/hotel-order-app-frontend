"use client";

import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import { useContext, useEffect, useState } from "react";

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
    if (!user) {
      router.replace("/"); // login yoksa ana sayfa
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
      return;
    }
    setChecked(true);
  }, [user, allowedRoles, router, redirectTo]);

  if (!checked) return null; // YETKİSİZLER hiç render görmez
  return <>{children}</>;
}
