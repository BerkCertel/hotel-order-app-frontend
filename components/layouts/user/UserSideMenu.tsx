import { useLogout } from "@/hooks/useLogout";
import { LuLogOut } from "react-icons/lu";
import { PiQrCodeDuotone } from "react-icons/pi";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdOutlineMenuBook } from "react-icons/md";
import { useEffect } from "react";
import {
  getAllLocations,
  getUserLocations,
  selectLocationState,
} from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";

export default function UserSideMenu() {
  const dispatch = useAppDispatch();
  const { locations, loading, error } = useAppSelector(selectLocationState);
  const navigate = useRouter();
  const logout = useLogout();

  useEffect(() => {
    dispatch(getUserLocations());
  }, [dispatch]);

  const handleNavigate = (locId: string) => {
    navigate.push(`/user/order/${locId}`);
  };

  const handleQrPage = () => {
    navigate.push("/user");
  };

  if (loading)
    return (
      <div className="flex flex-col gap-4 p-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-full h-12 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
        <div className="text-center text-red-600 font-semibold">
          {typeof error === "string"
            ? error
            : "An error occurred while loading locations."}
        </div>
        <button
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all"
          onClick={() => dispatch(getAllLocations())}
        >
          Try Again
        </button>
      </div>
    );

  return (
    <aside className="w-64 h-[calc(100vh-61px)] bg-gradient-to-b from-indigo-50 via-white to-indigo-100 border-r border-black/10 px-6 py-6 sticky top-[61px] z-50 overflow-y-auto flex flex-col gap-6 shadow-sm">
      {/* QR Codes butonu */}
      <button
        onClick={handleQrPage}
        className="cursor-pointer w-full flex items-center gap-3 text-[15px] font-semibold bg-indigo-100 text-indigo-900 py-3 px-6 rounded-xl mb-3 shadow hover:bg-indigo-600 hover:text-white transition-all duration-200 group"
      >
        <PiQrCodeDuotone className="text-xl group-hover:text-white transition-colors" />
        <span>QR Codes</span>
      </button>

      {/* Orders başlığı ve locations listesi */}
      <div>
        <h5 className="flex items-center gap-2 text-lg font-extrabold mb-3 text-black/80 tracking-wide">
          <MdOutlineMenuBook className="text-indigo-400" />
          <span>Orders</span>
        </h5>
        <div className="flex flex-col gap-2">
          {locations.map((loc, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleNavigate(loc._id as string)}
              className="cursor-pointer w-full flex items-center gap-3 text-[15px] text-black bg-white/60 py-2 px-5 rounded-xl shadow hover:bg-indigo-500 hover:text-white transition-all duration-200 group"
            >
              <span className="font-semibold truncate">{loc.location}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div
        onClick={logout}
        className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-xl mb-3 bg-gradient-to-r from-red-600 to-red-500 text-white cursor-pointer shadow hover:opacity-80 transition-all duration-200 font-semibold"
      >
        <LuLogOut className="text-lg" />
        <span>Logout</span>
      </div>
    </aside>
  );
}
