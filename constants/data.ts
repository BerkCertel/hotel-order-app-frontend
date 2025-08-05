import {
  LuQrCode,
  LuMapPin,
  LuUsers,
  LuList,
  LuCirclePlus,
} from "react-icons/lu";
import { TbCategory } from "react-icons/tb";
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
  // {
  //   id: "04",
  //   label: "Location Create",
  //   icon: MdOutlineAddLocationAlt,
  //   path: "/admin/location-create",
  // },
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

export const ADMIN_SIDE_MENU_DATA = [
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
    label: "Category",
    icon: TbCategory,
    path: "/admin/category",
  },
  {
    id: "05",
    label: "Subcategory",
    icon: MdOutlineCategory,
    path: "/admin/subcategory",
  },
  {
    id: "06",
    label: "Users",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "07",
    label: "Orders",
    icon: LuList,
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
