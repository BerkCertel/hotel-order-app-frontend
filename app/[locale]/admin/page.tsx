"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
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
import { useLogout } from "@/hooks/useLogout";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";

function AdminMainPage() {
  // const { user } = useContext(UserContext);

  const logout = useLogout();

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <div></div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => logout()}>Logout</Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}

export default AdminMainPage;
