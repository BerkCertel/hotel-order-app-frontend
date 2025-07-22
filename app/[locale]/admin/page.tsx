"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchMe } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";

function AdminMainPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
    console.log("Fetching user data...");
    if (user) {
      console.log("User data fetched:", user);
    }
  }, [dispatch]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <div>
            {user ? (
              <p>
                Hoşgeldin, {user.email} {user.role}
              </p>
            ) : (
              <p>Giriş yapmadınız.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminMainPage;
