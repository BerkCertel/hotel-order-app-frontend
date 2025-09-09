import { LuQrCode, LuMapPin, LuUsers, LuList } from "react-icons/lu";
import { TbCategory, TbListDetails } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";

export const SUPERADMIN_SIDE_MENU_DATA = [
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
    label: "Category",
    icon: TbCategory,
    path: "/admin/category",
  },
  {
    id: "04",
    label: "Subcategory",
    icon: MdOutlineCategory,
    path: "/admin/subcategory",
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
    icon: TbListDetails,
    path: "/admin/orders",
  },
];

export const ADMIN_SIDE_MENU_DATA = [
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
    label: "Category",
    icon: TbCategory,
    path: "/admin/category",
  },
  {
    id: "04",
    label: "Subcategory",
    icon: MdOutlineCategory,
    path: "/admin/subcategory",
  },
  {
    id: "05",
    label: "Orders",
    icon: LuUsers,
    path: "/admin/orders",
  },
];

export const USER_SIDE_MENU_DATA = [
  {
    id: "01",
    label: "QR Code",
    icon: LuQrCode,
    path: "/user/qrcodes",
  },
  {
    id: "02",
    label: "Orders",
    icon: LuList,
    path: "/user/orders",
  },
];
