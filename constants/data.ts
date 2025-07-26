import { LuQrCode, LuMapPin, LuUsers, LuList, LuLogOut } from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "QR Code",
    icon: LuQrCode,
    path: "/admin/qrcode",
  },
  {
    id: "02",
    label: "Locations",
    icon: LuMapPin,
    path: "/admin/locations",
  },
  {
    id: "03",
    label: "Users",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "04",
    label: "Orders",
    icon: LuList,
    path: "/admin/orders",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "/admin/logout",
  },
];
