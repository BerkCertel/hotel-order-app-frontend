"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// OrderItem tipini örnekle
export type OrderItem = {
  name: string;
  quantity: number;
  price?: number;
};

interface OrderItemsTableProps {
  items: OrderItem[];
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="w-full overflow-x-auto mt-3 border rounded-lg  bg-white text-black">
      <Table className="min-w-[320px]">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Item</TableHead>
            <TableHead className="font-semibold text-center">
              Quantity
            </TableHead>
            <TableHead className="font-semibold text-center">
              Unit Price
            </TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <TableRow key={i} className="border-t">
                {/* Item Name */}
                <TableCell className="font-bold first-letter:uppercase truncate max-w-[90px]">
                  {item.name}
                </TableCell>
                {/* Quantity */}
                <TableCell className="font-medium text-center">
                  {item.quantity}
                </TableCell>
                {/* Unit Price */}
                <TableCell className="text-center">
                  {item.price && item.price > 0 ? (
                    <span className="font-semibold text-blue-700">
                      ₺{item.price}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
                {/* Total */}
                <TableCell className="font-semibold text-right">
                  {item.price && item.price > 0 ? (
                    <span className="text-emerald-700">
                      ₺{item.price * item.quantity}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-4 text-muted-foreground"
              >
                No items in order.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
