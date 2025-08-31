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
import { Order } from "@/types/OrderTypes";
import { STATUS_OPTIONS } from "@/constants/orderStatus";
import { OrderItemsTable } from "./OrderTableCard";

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

  // Status change handler
  const handleChangeStatus = (status: "pending" | "success" | "rejected") => {
    if (status === "rejected") {
      setNextStatus(status);
      setOpen(true);
    } else {
      dispatch(updateOrderStatus({ id: order._id, status }));
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

  // Badge color and text
  const badgeBorderColor = isJustArrived
    ? "#ea580c"
    : order.status === "rejected"
    ? "#b91c1c"
    : "#222";

  const badgeColor = isJustArrived
    ? "bg-orange-500 text-white"
    : order.status === "rejected"
    ? "bg-red-500 text-white dark:bg-red-300/20 dark:text-red-300"
    : order.status === "success"
    ? "bg-green-200 text-black"
    : "bg-yellow-100 text-black";

  const badgeText = isJustArrived ? "New Order" : meta.label;

  function getTextColor(order: Order, isJustArrived: boolean) {
    if (isJustArrived) return "text-orange-700";
    if (order.status === "success") return "text-green-700";
    if (order.status === "pending") return "text-yellow-700";
    if (order.status === "rejected") return "text-white";
    return "text-foreground";
  }

  const textColor = getTextColor(order, isJustArrived);

  return (
    <>
      <Card
        className={clsx(
          "p-4 min-h-[220px] max-h-[400px] flex flex-col gap-3 border border-border/60 bg-background/95 backdrop-blur transition-all duration-300",
          isJustArrived ? "bg-orange-100 border-orange-300" : meta.badge,
          isJustArrived && "ring-4 ring-orange-300 shadow-lg"
        )}
      >
        {/* Top row: Guest and Status badge */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-base uppercase truncate max-w-[140px]">
            {order.orderUserName || "Guest"}
          </h3>
          <span
            className={clsx(
              "text-xs font-semibold px-3 py-1 rounded-full  border ml-2",
              badgeColor
            )}
            style={{
              borderColor: badgeBorderColor,
            }}
          >
            {badgeText}
          </span>
        </div>

        <div className={clsx("text-xs leading-relaxed space-y-1", textColor)}>
          <div>
            <span className="font-medium">Room:</span> {order.roomNumber}
          </div>

          <div>
            <span className="font-medium ">Name:</span>{" "}
            {order.orderUserName || "Guest"}
          </div>
          <div>
            <span className="font-medium">QR:</span> {order.qrcodeLabel}
          </div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {format(created, "dd.MM.yyyy HH:mm:ss")}
          </div>

          {order.TotalPrice && order.TotalPrice > 0 && (
            <div>
              <span className="font-bold ">Total Price:</span>{" "}
              {order.TotalPrice} $
            </div>
          )}
        </div>
        <OrderItemsTable items={order.items} />

        {/* Status change buttons */}
        {/* Durum değiştirme butonları */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              size="sm"
              variant={
                opt.key === "success"
                  ? "success"
                  : opt.key === "rejected"
                  ? "destructive"
                  : "secondary"
              }
              disabled={order.status === opt.key}
              onClick={() => handleChangeStatus(opt.key)}
              className={
                order.status === opt.key ? "opacity-50 pointer-events-none" : ""
              }
            >
              {opt.icon}
              {opt.label}
            </Button>
          ))}
        </div>
      </Card>
      {/* Cancel dialog */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={"cancel-order-dialog-description"}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to cancel this order?
            </DialogTitle>
            <DialogDescription>
              This action will cancel the order.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
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
