"use client";
import { useContext, useEffect } from "react";
import { API_PATHS } from "@/constants/apiPaths";
import { UserContext } from "@/context/userContext";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "@/i18n/navigation";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (isMounted) {
          clearUser();
          router.push("/sdfsfgsfg");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [clearUser, router, updateUser, user]);
};
