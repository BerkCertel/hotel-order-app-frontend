import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import { useContext } from "react";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const { clearUser } = useContext(UserContext);

  const logout = () => {
    router.push("/");
    localStorage.removeItem("token");
    clearUser();
    toast.warning("Logout successful!");
  };

  return logout;
}
