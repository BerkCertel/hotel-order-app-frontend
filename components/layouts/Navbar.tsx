import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { Button } from "../ui/button";

function Navbar() {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="relative w-full">
      {/* Overlay */}
      {openSideMenu && (
        <div
          className="fixed lg:hidden inset-0 bg-black/40 z-40"
          onClick={() => setOpenSideMenu(false)}
        />
      )}

      <div className="flex items-center bg-gradient-to-b from-indigo-50 via-white to-indigo-100 border-b border-black/20 backdrop-blur-[2px] py-4 px-4 fixed w-full top-0 z-50">
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
      </div>

      {/* Mobil SideMenu - fixed ve tam height */}
      {openSideMenu && (
        <div
          className="fixed top-0 left-0 h-screen z-40 "
          onClick={(e) => e.stopPropagation()} // Burası önemli!
        >
          <SideMenu />
        </div>
      )}
    </div>
  );
}

export default Navbar;
