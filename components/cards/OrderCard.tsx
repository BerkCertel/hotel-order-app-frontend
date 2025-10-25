// "use client";

// import { ORDER_STATUS_STYLES } from "@/constants/orderStatusStyles";
// import { useAppDispatch } from "@/store/store";
// import { useState, useEffect } from "react";
// import { Card } from "../ui/card";
// import { updateOrderStatus } from "@/store/orderSlice";
// import clsx from "clsx";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { format, parseISO, differenceInSeconds } from "date-fns";
// import { Order } from "@/types/OrderTypes";
// import { STATUS_OPTIONS } from "@/constants/orderStatus";
// import { OrderItemsTable } from "./OrderTableCard";

// export function OrderCard({ order }: { order: Order }) {
//   const dispatch = useAppDispatch();
//   const meta = ORDER_STATUS_STYLES[order.status];
//   const [open, setOpen] = useState(false);
//   const [nextStatus, setNextStatus] = useState<
//     "pending" | "success" | "rejected" | undefined
//   >();

//   // Date calculation
//   const created = parseISO(order.createdAt);

//   // Just arrived logic with timer
//   const [isJustArrived, setIsJustArrived] = useState(() => {
//     const now = new Date();
//     const secondsSinceCreated = differenceInSeconds(now, created);
//     return secondsSinceCreated < 60;
//   });

//   useEffect(() => {
//     if (!isJustArrived) return;
//     const now = new Date();
//     const secondsSinceCreated = differenceInSeconds(now, created);
//     const timeout = setTimeout(
//       () => setIsJustArrived(false),
//       (60 - secondsSinceCreated) * 1000
//     );
//     return () => clearTimeout(timeout);
//   }, [created, isJustArrived]);

//   // Status change handler
//   const handleChangeStatus = (status: "pending" | "success" | "rejected") => {
//     if (status === "rejected") {
//       setNextStatus(status);
//       setOpen(true);
//     } else {
//       dispatch(updateOrderStatus({ id: order._id, status }));
//       setIsJustArrived(false);
//     }
//   };

//   // Dialog confirm
//   const confirmReject = () => {
//     if (nextStatus) {
//       dispatch(updateOrderStatus({ id: order._id, status: nextStatus }));
//       setOpen(false);
//       setNextStatus(undefined);
//     }
//   };

//   // Badge color and text
//   const badgeBorderColor = isJustArrived
//     ? "#ea580c"
//     : order.status === "rejected"
//     ? "#b91c1c"
//     : "#222";

//   const badgeColor = isJustArrived
//     ? "bg-orange-500 text-white"
//     : order.status === "rejected"
//     ? "bg-red-500 text-white dark:bg-red-300/20 dark:text-red-300"
//     : order.status === "success"
//     ? "bg-green-200 text-black"
//     : "bg-yellow-100 text-black";

//   const badgeText = isJustArrived ? "New Order" : meta.label;

//   function getTextColor(order: Order, isJustArrived: boolean) {
//     if (isJustArrived) return "text-orange-700";
//     if (order.status === "success") return "text-green-700";
//     if (order.status === "pending") return "text-yellow-700";
//     if (order.status === "rejected") return "text-white";
//     return "text-foreground";
//   }

//   const textColor = getTextColor(order, isJustArrived);

//   return (
//     <>
//       <Card
//         className={clsx(
//           "p-4 min-h-[220px] max-h-[400px] flex flex-col gap-3 border border-border/60 bg-background/95 backdrop-blur transition-all duration-300",
//           isJustArrived ? "bg-orange-100 border-orange-300" : meta.badge,
//           isJustArrived && "ring-4 ring-orange-300 shadow-lg"
//         )}
//       >
//         {/* Top row: Guest and Status badge */}
//         <div className="flex justify-between items-center mb-1">
//           <h3 className="font-semibold text-base uppercase truncate max-w-[140px]">
//             {order.orderUserName || "Guest"}
//           </h3>
//           <span
//             className={clsx(
//               "text-xs font-semibold px-3 py-1 rounded-full  border ml-2",
//               badgeColor
//             )}
//             style={{
//               borderColor: badgeBorderColor,
//             }}
//           >
//             {badgeText}
//           </span>
//         </div>

//         <div className={clsx("text-xs leading-relaxed space-y-1", textColor)}>
//           <div className=" bg-white  px-2 py-1 rounded-md text-black">
//             <div className="flex flex-wrap gap-2">
//               <div>
//                 <span className="font-medium">Room:</span> {order.roomNumber}
//               </div>

//               <div>
//                 <span className="font-medium ">Name:</span>{" "}
//                 {order.orderUserName || "Guest"}
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <div>
//                 <span className="font-medium">QR:</span> {order.qrcodeLabel}
//               </div>
//               <div className="underline">
//                 <span className="font-medium">Date:</span>{" "}
//                 {format(created, "dd.MM.yyyy HH:mm:ss")}
//               </div>
//             </div>
//           </div>
//           <div className=" bg-white  px-2 py-1 rounded-md text-black">
//             {order.TotalPrice && order.TotalPrice > 0 && (
//               <div className="font-bold">
//                 <span>Total Price:</span> {order.TotalPrice} $
//               </div>
//             )}

//             {order.orderNote && (
//               <div>
//                 <span className="font-medium">Note:</span> {order.orderNote}
//               </div>
//             )}
//           </div>
//         </div>
//         <OrderItemsTable items={order.items} />

//         {/* Status change buttons */}
//         {/* Durum değiştirme butonları */}
//         <div className="flex gap-2 mt-2 flex-wrap">
//           {STATUS_OPTIONS.map((opt) => (
//             <Button
//               key={opt.key}
//               size="sm"
//               variant={
//                 opt.key === "success"
//                   ? "success"
//                   : opt.key === "rejected"
//                   ? "destructive"
//                   : "secondary"
//               }
//               disabled={order.status === opt.key}
//               onClick={() => handleChangeStatus(opt.key)}
//               className={
//                 order.status === opt.key ? "opacity-50 pointer-events-none" : ""
//               }
//             >
//               {opt.icon}
//               {opt.label}
//             </Button>
//           ))}
//         </div>
//       </Card>
//       {/* Cancel dialog */}

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent aria-describedby={"cancel-order-dialog-description"}>
//           <DialogHeader>
//             <DialogTitle>
//               Are you sure you want to cancel this order?
//             </DialogTitle>
//             <DialogDescription>
//               This action will cancel the order.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="secondary" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmReject}>
//               Yes, Cancel Order
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import { ORDER_STATUS_STYLES } from "@/constants/orderStatusStyles";
import { useAppDispatch } from "@/store/store";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { updateOrderStatus } from "@/store/orderSlice";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { format, parseISO, differenceInSeconds } from "date-fns";
import type { Order } from "@/types/OrderTypes";
import { STATUS_OPTIONS } from "@/constants/orderStatus";
import { OrderItemsTable } from "./OrderTableCard";
import {
  Clock,
  User,
  DoorOpen,
  QrCode,
  FileText,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/badge";

export function OrderCard({ order }: { order: Order }) {
  const dispatch = useAppDispatch();
  const meta = ORDER_STATUS_STYLES[order.status];
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<
    "pending" | "success" | "rejected" | undefined
  >();

  // Date calculation
  const created = parseISO(order.createdAt);

  // Just arrived logic with timer
  const [isJustArrived, setIsJustArrived] = useState(() => {
    const now = new Date();
    const secondsSinceCreated = differenceInSeconds(now, created);
    return secondsSinceCreated < 60;
  });

  useEffect(() => {
    if (!isJustArrived) return;
    const now = new Date();
    const secondsSinceCreated = differenceInSeconds(now, created);
    const timeout = setTimeout(
      () => setIsJustArrived(false),
      (60 - secondsSinceCreated) * 1000
    );
    return () => clearTimeout(timeout);
  }, [created, isJustArrived]);

  const handleChangeStatus = (status: "pending" | "success" | "rejected") => {
    if (status === "rejected") {
      setNextStatus(status);
      setOpen(true);
    } else {
      dispatch(updateOrderStatus({ id: order._id, status }));
      setIsJustArrived(false);
    }
  };

  // Dialog confirm
  const confirmReject = () => {
    if (nextStatus) {
      dispatch(updateOrderStatus({ id: order._id, status: nextStatus }));
      setOpen(false);
      setNextStatus(undefined);
    }
  };

  return (
    <>
      <Card
        className={clsx(
          "group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-none",
          isJustArrived &&
            "ring-2 ring-orange-500 shadow-lg shadow-orange-200/50 animate-pulse"
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 opacity-75",
            isJustArrived && "bg-gradient-to-br from-orange-500 to-orange-600",
            order.status === "success" &&
              "bg-gradient-to-br from-green-500 to-emerald-600",
            order.status === "pending" &&
              "bg-gradient-to-br from-yellow-500 to-amber-600",
            order.status === "rejected" &&
              "bg-gradient-to-br from-red-500 to-rose-600"
          )}
        />

        <div className="relative p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={clsx(
                  "p-2 rounded-lg",
                  isJustArrived && "bg-orange-100",
                  order.status === "success" && "bg-green-100",
                  order.status === "pending" && "bg-yellow-100",
                  order.status === "rejected" && "bg-red-100"
                )}
              >
                <User
                  className={clsx(
                    "h-5 w-5",
                    isJustArrived && "text-orange-600",
                    order.status === "success" && "text-green-600",
                    order.status === "pending" && "text-yellow-600",
                    order.status === "rejected" && "text-red-600"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">
                  {order.orderUserName || "Guest"}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(created, "dd.MM.yyyy HH:mm")}
                </p>
              </div>
            </div>

            <Badge
              variant={
                isJustArrived
                  ? "default"
                  : order.status === "success"
                  ? "default"
                  : order.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className={clsx(
                "px-3 py-1.5 font-semibold text-xs whitespace-nowrap",
                isJustArrived && "bg-orange-500 hover:bg-orange-600"
              )}
            >
              {isJustArrived && <Sparkles className="h-3 w-3 mr-1" />}
              {isJustArrived ? "New Order" : meta.label}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="bg-muted/90 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Room:</span>
                <span className="font-bold">{order.roomNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">QR:</span>
                <span className="font-mono text-xs">{order.qrcodeLabel}</span>
              </div>
            </div>

            {(order.TotalPrice || order.orderNote) && (
              <div className="bg-muted/90 rounded-lg p-3 space-y-2">
                {order.TotalPrice > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-green-600">
                      {order.TotalPrice} $
                    </span>
                  </div>
                )}
                {order.orderNote && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium">Note:</span>
                      <p className="text-muted-foreground mt-1">
                        {order.orderNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <OrderItemsTable items={order.items} />

          <div className="flex gap-2 pt-2">
            {STATUS_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                size="sm"
                variant={
                  opt.key === "success"
                    ? "default"
                    : opt.key === "rejected"
                    ? "destructive"
                    : "secondary"
                }
                disabled={order.status === opt.key}
                onClick={() => handleChangeStatus(opt.key)}
                className={clsx(
                  "flex-1 transition-all",
                  order.status === opt.key && "opacity-50 cursor-not-allowed",
                  opt.key === "success" && "bg-green-600 hover:bg-green-700"
                )}
              >
                {opt.icon}
                <span className="ml-1">{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Cancel Order?</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              No, Keep Order
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
