"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getOrdersByLocation,
  addOrder,
  updateOrder,
  selectOrderState,
} from "@/store/orderSlice";
import { Loader2, AlertCircle, Inbox } from "lucide-react";
import { OrderCard } from "@/components/cards/OrderCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSocket } from "@/utils/socket";
import { Order } from "@/types/OrderTypes";

type OrderWithMeta = Order & { __justArrived?: boolean };

type Props = {
  selectedLocationId: string;
};

export default function AdminOrdersList({ selectedLocationId }: Props) {
  const dispatch = useAppDispatch();
  const { orders, loading, error, total, page, totalPages } =
    useAppSelector(selectOrderState);

  const limit = 6;

  // Fetch orders when selectedLocationId or page changes
  useEffect(() => {
    if (selectedLocationId) {
      dispatch(
        getOrdersByLocation({
          locationId: selectedLocationId,
          page: 1,
          limit,
        })
      );
    }
  }, [selectedLocationId, dispatch]);

  // Real-time socket updates (new/update order)
  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (payload: {
      type: "new" | "update";
      order: Order;
    }) => {
      if (!payload?.order) return;
      const { type, order } = payload;
      if (String(order.location) !== String(selectedLocationId)) return;

      if (type === "new") {
        const newOrder: OrderWithMeta = { ...order, __justArrived: true };
        dispatch(addOrder(newOrder));
        setTimeout(() => {
          dispatch(updateOrder({ ...order, __justArrived: false }));
        }, 3000);
      } else if (type === "update") {
        dispatch(updateOrder(order));
      }
    };

    socket.on("orderUpdate", handleUpdate);
    return () => {
      socket.off("orderUpdate", handleUpdate);
    };
  }, [dispatch, selectedLocationId]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(
      getOrdersByLocation({
        locationId: selectedLocationId,
        page: newPage,
        limit,
      })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-10 flex flex-col items-center gap-6">
        <Card className="w-full max-w-xs flex flex-col items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <CardTitle className="text-center text-base">
            Loading Orders...
          </CardTitle>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we fetch the orders for this location.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-10 flex flex-col items-center">
        <Card className="max-w-md w-full flex flex-col items-center p-8 shadow-lg border border-red-200">
          <CardHeader className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle className="font-semibold text-center text-red-800">
              Failed to load orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-16">
        <Card className="max-w-sm w-full flex flex-col items-center rounded-2xl shadow-md p-0">
          <CardHeader className="flex flex-col items-center pt-7 pb-2">
            <Inbox className="h-12 w-12 text-gray-400 mb-2" />
            <CardTitle className="font-bold text-lg text-center text-gray-700 tracking-tight">
              No Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-7">
            <p className="text-sm text-gray-500 text-center leading-relaxed px-4">
              There are currently no orders for this location.
              <br />
              Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto mt-3 px-2">
      <div>
        <p className="text-sm text-muted-foreground my-1 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1 mb-1 text-base font-semibold"
          >
            <span>Total:</span>
            {total}
          </Badge>
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
        {orders.map((order: Order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                const active = p === page;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={active}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-40" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
