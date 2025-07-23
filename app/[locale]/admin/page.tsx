"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserContext } from "@/context/userContext";
import { useLogout } from "@/hooks/useLogout";
import { useContext } from "react";

function AdminMainPage() {
  const { user } = useContext(UserContext);

  const logout = useLogout();
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
          <Button onClick={logout}>Logout</Button>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminMainPage;
