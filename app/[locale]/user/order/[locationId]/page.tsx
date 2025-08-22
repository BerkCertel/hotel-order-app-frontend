"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getOrdersByLocation, addOrder, updateOrder } from "@/store/orderSlice";
import { getSocket } from "@/utils/socket";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Order } from "@/types/OrderTypes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OrderCard } from "@/components/cards/OrderCard";

// Order tipini meta property ile genişlet
type OrderWithMeta = Order & { __justArrived?: boolean };

export default function OrdersByLocation() {
  const dispatch = useAppDispatch();
  const { orders, loading, error, total, page, totalPages } = useAppSelector(
    (s) => s.order
  );
  const params = useParams();
  const locationId = params.locationId as string;

  // Limit 10
  const [limit] = useState<number>(12);

  // İlk fetch
  useEffect(() => {
    if (locationId) {
      dispatch(
        getOrdersByLocation({
          locationId,
          page,
          limit,
        })
      );
    }
  }, [locationId, page, limit, dispatch]);

  // Socket realtime
  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (payload: {
      type: "new" | "update";
      order: Order;
    }) => {
      if (!payload?.order) return;
      const { type, order } = payload;
      if (String(order.location) !== String(locationId)) return;

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
  }, [dispatch, locationId]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(
      getOrdersByLocation({
        locationId,
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
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertTitle>Failed to load orders</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 flex flex-col items-center">
        <Card className="max-w-md w-full flex flex-col items-center p-8">
          <Inbox className="h-12 w-12 text-muted-foreground mb-3" />
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-semibold text-center">
              No Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <p className="text-sm text-muted-foreground text-center">
              There are no orders for this location yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto  mt-3 px-2">
      <div className="  mb-">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-center">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground my-1 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-base font-semibold"
            >
              <span>Total:</span>
              {total}
            </Badge>
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
