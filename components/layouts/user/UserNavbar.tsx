import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import UserSideMenu from "./UserSideMenu";

export default function UserNavbar() {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex items-center bg-gradient-to-b from-indigo-50 via-white to-indigo-100  border-b border-black/20 backdrop-blur-[2px] py-4 px-4 sticky top-0 z-30 ">
      <Button
        className="block lg:hidden"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </Button>

      <h2 className="text-lg font-medium text-black ml-1 lg:ml-0">
        Hotel Order System
      </h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <UserSideMenu />
        </div>
      )}
    </div>
  );
}
