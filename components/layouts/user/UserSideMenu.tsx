import { useRouter } from "@/i18n/navigation";
import { useLogout } from "@/hooks/useLogout";
import { LuLogOut } from "react-icons/lu";
import { PiQrCodeDuotone } from "react-icons/pi";
import { useEffect } from "react";

import { getAllLocations, selectLocationState } from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FaExclamationTriangle } from "react-icons/fa"; // Hata ikonu eklendi

export default function UserSideMenu() {
  const dispatch = useAppDispatch();
  const { locations, loading, error } = useAppSelector(selectLocationState);
  const navigate = useRouter();
  const logout = useLogout();

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  const handleNavigate = (locId: string) => {
    navigate.push(`/user/order/${locId}`);
  };

  const handleQrPage = () => {
    navigate.push("/user/qrcodes");
  };

  if (loading)
    return (
      <div className="flex flex-col gap-4 p-8">
        {/* 3 adet dikdörtgen skeleton kart örneği */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"
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
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          onClick={() => dispatch(getAllLocations())}
        >
          Try Again
        </button>
      </div>
    );

  return (
    <aside className="w-64 h-[calc(100vh-61px)] bg-white border-r border-black/20 p-5 sticky top-[61px] z-50 overflow-y-auto flex flex-col">
      {/* QR Codes butonu */}
      <button
        onClick={handleQrPage}
        className="w-full flex items-center gap-3 text-[15px] font-semibold bg-indigo-50 text-indigo-900 py-3 px-6 rounded-lg mb-5 hover:bg-indigo-600 hover:text-white transition-all duration-200"
      >
        <PiQrCodeDuotone className="text-xl" />
        Qr Codes
      </button>

      {/* Orders başlığı ve locations listesi */}
      <div className="mb-6">
        <h5 className="text-lg font-bold mb-2 text-black/80">Orders</h5>
        <div className="flex flex-col gap-2">
          {locations.map((loc, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleNavigate(loc._id as string)}
              className="w-full flex items-center gap-3 text-[15px] text-black bg-black/10 py-2 px-5 rounded-lg hover:bg-black hover:text-white transition-all duration-200"
            >
              {/* Dilersen buraya icon ekleyebilirsin */}
              <span className="font-semibold truncate">{loc.location}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        onClick={logout}
        className="w-full flex items-center gap-4 text-[15px]  py-3 px-6 rounded-lg mb-3  bg-red-600 text-white cursor-pointer hover:opacity-65 transition-all duration-200"
      >
        <LuLogOut />
        Logout
      </div>
    </aside>
  );
}
