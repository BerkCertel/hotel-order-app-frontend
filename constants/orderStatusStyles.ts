import { Order } from "@/types/OrderTypes";

export const ORDER_STATUS_STYLES: Record<
  Order["status"],
  { badge: string; label: string }
> = {
  pending: {
    badge: "bg-yellow-100 text-black ",
    label: "Pending",
  },
  success: {
    badge: "bg-green-200 text-black ",
    label: "Completed",
  },
  rejected: {
    badge: "bg-red-500 text-white dark:bg-red-300/20 dark:text-red-300",
    label: "Rejected",
  },
};
