"use client";
import React, { useEffect, useState } from "react";
import {
  FaThList,
  FaTimes,
  FaShoppingBasket,
  FaBoxOpen,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import {
  addToCart,
  removeFromCart,
  clearCart,
  selectCartState,
} from "@/store/cartSlice";

import { createOrder, selectOrderState } from "@/store/orderSlice";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { selectOrderUserState } from "@/store/orderuserSlice";
import { selectQrCodeState } from "@/store/qrcodeSlice";
import { toast } from "sonner";

function CartSheet() {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const { items: cartItems } = useSelector(selectCartState);
  const { orderUser } = useSelector(selectOrderUserState);
  const { orderStatus } = useAppSelector(selectOrderState);
  const { activeQrCodeId } = useAppSelector(selectQrCodeState);
  const [sheetStatus, setSheetStatus] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  const handleCreateOrder = () => {
    if (
      activeQrCodeId === null ||
      activeQrCodeId === undefined ||
      activeQrCodeId === ""
    ) {
      // Handle missing QR code ID
      navigate.push("/scan-qrcode-again");
      return;
    }

    if (orderNote.length > 200) {
      toast.error("Note cannot be longer than 200 characters.");
      return;
    }
    dispatch(
      createOrder({
        items: cartItems,
        qrCodeId: activeQrCodeId,
        roomNumber: orderUser.roomNumber,
        orderUserName: orderUser.name,
        TotalPrice,
        orderNote,
      })
    );
  };

  useEffect(() => {
    if (orderStatus === "succeeded") {
      dispatch(clearCart());
      setSheetStatus(false);
    }
  }, [orderStatus, dispatch]);

  const TotalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <>
      <Sheet open={sheetStatus} onOpenChange={setSheetStatus}>
        <SheetDescription />
        <SheetTrigger asChild>
          <Button className="relative text-xs md:text-base text-indigo-500 bg-indigo-200">
            <FaShoppingBasket className="w-6 h-6" />
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-white z-10">
                {cartItems.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 max-w-xs w-full">
          {/* HEADER */}
          <div className="relative flex items-center justify-center border-b h-16 bg-white">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-accent-foreground">
              <FaThList className="w-6 h-6" />
              <SheetTitle>Cart</SheetTitle>
            </div>
          </div>

          <div className="p-4">
            {orderUser.name && (
              <div className="text-xs mb-2">
                Your name: <b>{orderUser.name}</b>
              </div>
            )}

            {orderUser.roomNumber && (
              <div className="text-xs mb-2">
                Your room: <b>{orderUser.roomNumber}</b>
              </div>
            )}

            {/* Cart Content */}
            {cartItems.length === 0 ? (
              <div className="border rounded-md py-2 flex flex-col items-center mt-10 text-muted-foreground">
                <FaBoxOpen className="w-12 h-12 mb-2 opacity-40" />
                <div className="font-medium text-base">Your cart is empty</div>
              </div>
            ) : (
              <ScrollArea className="max-h-[55vh] w-full overflow-y-auto border rounded-md bg-white p-2">
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 shadow border border-gray-100"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white rounded-md border overflow-hidden">
                        {/* Placeholder image since item.image yok */}
                        <Image
                          src={item.image ?? "/placeholder.png"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className=" first-letter:uppercase font-semibold text-base truncate">
                          {item.name}
                        </div>
                        {item.price !== undefined && item.price !== 0 && (
                          <div className="text-xs bg-blue-200 rounded-sm w-28 text-center text-gray-600 font-bold">
                            ${item.price} x {item.quantity} = $
                            {item.price * item.quantity}
                          </div>
                        )}
                        {/* Quantity controls */}
                        <div className="flex items-center mt-1 gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  _id: item._id,
                                  name: item.name,
                                  quantity: -1,
                                  image: item.image,
                                })
                              )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </Button>
                          <span className="min-w-[28px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  _id: item._id,
                                  name: item.name,
                                  quantity: 1,
                                  image: item.image,
                                })
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </div>
                      {/* Remove */}
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => dispatch(removeFromCart(item._id))}
                        aria-label="Remove from cart"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* FOOTER */}
          <SheetFooter className="border-t p-2 flex justify-between">
            <div className=" text-md font-semibold text-center bg-blue-500 p-1.5 text-white rounded-md mx-1 ">
              Total: ${TotalPrice}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full "
                  type="submit"
                  disabled={
                    orderStatus === "loading" ||
                    cartItems.length === 0 ||
                    !cartItems
                  }
                >
                  {orderStatus === "loading" ? "Sending..." : "Place Order"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Place Order</DialogTitle>
                  <DialogDescription>
                    You can add your order note here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid ">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Note:</Label>
                    <Textarea
                      placeholder="Your note here..."
                      value={orderNote}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setOrderNote(e.target.value);
                        }
                      }}
                      maxLength={200}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {orderNote.length}/200 characters
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="destructive">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={
                      orderStatus === "loading" || orderNote.length > 200
                    }
                    onClick={handleCreateOrder}
                  >
                    {orderStatus === "loading" ? "Sending..." : "Place Order"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              type="button"
              disabled={cartItems.length === 0 || !cartItems}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </Button>
            <SheetClose asChild>
              <Button variant="outline" type="button">
                <FaTimes className="w-5 h-5" />
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default CartSheet;
