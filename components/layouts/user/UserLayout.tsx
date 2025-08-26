import React, { useContext } from "react";
import UserSideMenu from "./UserSideMenu";
import UserNavbar from "./UserNavbar";
import { UserContext } from "@/context/userContext";

interface UserLayoutProps {
  children?: React.ReactNode;
}

function UserLayout({ children }: UserLayoutProps) {
  const { user } = useContext(UserContext);

  return (
    <div>
      {" "}
      <div className="">
        <UserNavbar />
        {user && (
          <div className="flex  justify-center w-full">
            <div className="max-[1000px]:hidden">
              <UserSideMenu />
            </div>

            <div className="w-full">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLayout;
