import { SIDE_MENU_DATA } from "@/constants/data";
import { UserContext } from "@/context/userContext";
import { useRouter } from "@/i18n/navigation";
import { useContext } from "react";

function SideMenu() {
  const { clearUser } = useContext(UserContext);
  const navigate = useRouter();

  const handleClick = (route: string) => {
    if (route == "logout") {
      handleLogout();
      return;
    }
    navigate.push(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate.push("/");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-black/20 p-5 sticky top-[61px] z-60 overflow-y-auto">
      {SIDE_MENU_DATA.map((item, index) => (
        <div
          onClick={() => handleClick(item.path)}
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] text-black bg-black/15  py-3 px-6 rounded-lg mb-3 hover:bg-black hover:text-white cursor-pointer transition-all duration-200`}
        >
          {item.icon && <item.icon className="" />}
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default SideMenu;
