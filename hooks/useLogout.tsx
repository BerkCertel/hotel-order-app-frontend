import { API_PATHS } from "@/constants/apiPaths";
import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import { setLoggedInUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/store";

import axiosInstance from "@/utils/axiosInstance";
import { useContext } from "react";
import { toast } from "sonner";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { clearUser } = useContext(UserContext);

  const logout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      clearUser();
      dispatch(setLoggedInUser(false));
      toast.success("Logout successful!");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed!");
    }
  };

  return logout;
}
