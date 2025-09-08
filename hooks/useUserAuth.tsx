"use client";
import { useContext, useEffect } from "react";
import { API_PATHS } from "@/constants/apiPaths";
import { UserContext } from "@/context/userContext";
import axiosInstance from "@/utils/axiosInstance";
import { setLoggedInUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data);
          dispatch(setLoggedInUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (isMounted) {
          clearUser();
          router.push("/");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [clearUser, router, updateUser, user, dispatch]);
};
