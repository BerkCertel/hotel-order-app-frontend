"use client";

import {
  ADMIN_SIDE_MENU_DATA,
  SUPERADMIN_SIDE_MENU_DATA,
} from "@/constants/data";
import { useLogout } from "@/hooks/useLogout";
import { LuLogOut } from "react-icons/lu";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import { selectStyleState, setActiveAdminMenuId } from "@/store/styleSlice";
import { useRouter } from "@/i18n/navigation";

function SideMenu() {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const logout = useLogout();

  // Aktif menü id'sini redux'tan al
  const { ActiveAdminMenuId } = useAppSelector(selectStyleState);

  const handleClick = (route: string, activeMenuid: string) => {
    navigate.push(route);
    dispatch(setActiveAdminMenuId(activeMenuid));
  };

  const { user } = useContext(UserContext);

  const SIDE_MENU_DATA =
    user?.role === "SUPERADMIN"
      ? SUPERADMIN_SIDE_MENU_DATA
      : ADMIN_SIDE_MENU_DATA;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-gradient-to-b from-indigo-50 via-white to-indigo-100 border-r border-black/20 p-5 sticky top-[61px] z-50 overflow-y-auto flex flex-col">
      {SIDE_MENU_DATA.map((item, index) => {
        const isActive = item.id === ActiveAdminMenuId;
        return (
          <div
            onClick={() => handleClick(item.path, item.id)}
            key={`menu_${index}`}
            className={clsx(
              "w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 shadow cursor-pointer transition-all duration-200 group font-semibold truncate",
              {
                // Aktif olan menü için renkler
                "bg-indigo-500 text-white": isActive,
                // Aktifken hover olursa ekstra opacity
                "hover:opacity-70": isActive,
                // Diğerleri için klasik hover
                "bg-white/60 text-black hover:bg-indigo-500 hover:text-white":
                  !isActive,
              }
            )}
          >
            {item.icon && (
              <item.icon className="text-xl group-hover:text-white transition-colors" />
            )}
            <span>{item.label}</span>
          </div>
        );
      })}

      <div
        onClick={logout}
        className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 bg-gradient-to-r from-red-600 to-red-500 text-white cursor-pointer shadow hover:opacity-80 transition-all duration-200 font-semibold"
      >
        <LuLogOut className="text-lg" />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default SideMenu;
