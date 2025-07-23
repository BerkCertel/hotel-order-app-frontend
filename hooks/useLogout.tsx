import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import { useContext } from "react";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const { clearUser } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.push("/login");
    toast.warning("Logout successful!");
  };

  return logout;
}
