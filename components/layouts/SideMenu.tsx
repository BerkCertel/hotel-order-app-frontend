"use client";

import {
  ADMIN_SIDE_MENU_DATA,
  SUPERADMIN_SIDE_MENU_DATA,
} from "@/constants/data";
import { useLogout } from "@/hooks/useLogout";
import { LuLogOut } from "react-icons/lu";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

function SideMenu() {
  const navigate = useRouter();
  const logout = useLogout();

  const handleClick = (route: string) => {
    navigate.push(route);
  };

  const { user } = useContext(UserContext);

  const SIDE_MENU_DATA =
    user?.role === "SUPERADMIN"
      ? SUPERADMIN_SIDE_MENU_DATA
      : ADMIN_SIDE_MENU_DATA;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-black/20 p-5 sticky top-[61px] z-50 overflow-y-auto flex flex-col">
      {SIDE_MENU_DATA.map((item, index) => (
        <div
          onClick={() => handleClick(item.path)}
          key={`menu_${index}`}
          className="w-full flex items-center gap-4 text-[15px] text-black bg-black/15 py-3 px-6 rounded-lg mb-3 hover:bg-black hover:text-white cursor-pointer transition-all duration-200"
        >
          {item.icon && <item.icon className="" />}
          {item.label}
        </div>
      ))}

      <div
        onClick={logout}
        className="w-full flex items-center gap-4 text-[15px]  py-3 px-6 rounded-lg mb-3  bg-red-600 text-white cursor-pointer hover:opacity-65 transition-all duration-200"
      >
        <LuLogOut />
        Logout
      </div>
    </div>
  );
}

export default SideMenu;
