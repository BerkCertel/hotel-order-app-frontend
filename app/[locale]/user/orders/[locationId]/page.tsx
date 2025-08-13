"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { addOrder, getOrdersByLocation, updateOrder } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getSocket } from "@/utils/socket";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Order } from "@/types/OrderTypes";

const statusColor = {
  pending: "bg-yellow-300 text-yellow-900",
  success: "bg-green-300 text-green-900",
  rejected: "bg-red-300 text-red-900",
};

export default function OrdersByLocation() {
  const dispatch = useAppDispatch();
  const { orders, loading, error, total, page, totalPages } = useAppSelector(
    (state) => state.order
  );
  const params = useParams();
  const locationId = params.locationId as string;

  useEffect(() => {
    if (locationId) dispatch(getOrdersByLocation({ locationId, page }));
  }, [locationId, page, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    socket.on(
      "orderUpdate",
      (payload: { type: "new" | "update"; order: Order }) => {
        console.log("Canlı sipariş geldi!", payload);
        const { type, order } = payload;
        if (type === "new") dispatch(addOrder(order));
        if (type === "update") dispatch(updateOrder(order));
      }
    );
    return () => {
      socket.off("orderUpdate");
    };
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    console.log("Socket bağlantı durumu:", socket.connected);
  }, []);

  if (loading) return <Loader2 className="animate-spin mx-auto my-10" />;
  if (error)
    return <div className="text-red-500 text-center my-10">{error}</div>;

  // Pagination: Sayfa değiştirme fonksiyonu
  const handlePageChange = (newPage: number) => {
    if (locationId)
      dispatch(getOrdersByLocation({ locationId, page: newPage }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Siparişler ({total})</h1>
      {orders.length === 0 ? (
        <div className="text-muted-foreground text-center">
          Bu lokasyonda sipariş yok.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order._id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{order.userName}</span>
                <Badge className={statusColor[order.status]}>
                  {order.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Oda: <b>{order.roomNumber}</b> | QR: <b>{order.qrcodeLabel}</b>{" "}
                | Tarih: {new Date(order.createdAt).toLocaleString()}
              </div>
              <ul className="list-disc ml-4 text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(page - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
