import {
  LuQrCode,
  LuMapPin,
  LuUsers,
  LuList,
  LuCirclePlus,
} from "react-icons/lu";
import { MdOutlineAddLocationAlt } from "react-icons/md";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "QR Code",
    icon: LuQrCode,
    path: "/admin/qrcode",
  },
  {
    id: "02",
    label: "QR Code Create",
    icon: LuCirclePlus,
    path: "/admin/qrcode-create",
  },
  {
    id: "03",
    label: "Locations",
    icon: LuMapPin,
    path: "/admin/locations",
  },
  {
    id: "04",
    label: "Location Create",
    icon: MdOutlineAddLocationAlt,
    path: "/admin/location-create",
  },
  {
    id: "05",
    label: "Users",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Orders",
    icon: LuList,
    path: "/admin/orders",
  },
];
