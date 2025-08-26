import { API_PATHS } from "@/constants/apiPaths";
import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useContext } from "react";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const { clearUser } = useContext(UserContext);

  const logout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      clearUser();
      toast.success("Logout successful!");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed!");
    }
  };

  return logout;
}
