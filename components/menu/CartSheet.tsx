"use client";
import React, { useEffect, useState } from "react";
import {
  FaThList,
  FaTimes,
  FaBoxOpen,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import {
  Sheet,
  SheetClose,
  SheetContent,
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
  addToUpdateCartItems,
  setReduxPreOrderStatus,
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
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { selectOrderUserState } from "@/store/orderuserSlice";
import { selectQrCodeState } from "@/store/qrcodeSlice";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getActualPrice } from "@/utils/SubcategoryUtils";
import { getAllCategoriesWithSubcategories } from "@/store/categorySlice";

function CartSheet() {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const {
    items: cartItems,
    preOrderStatus,
    updatedItems,
  } = useSelector(selectCartState);
  const { orderUser } = useSelector(selectOrderUserState);
  const { orderStatus } = useAppSelector(selectOrderState);
  const { activeQrCodeId } = useAppSelector(selectQrCodeState);
  const [sheetStatus, setSheetStatus] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [clearCartState, setClearCartState] = useState(false);
  const [preOrderStatusButton, setPreOrderStatusButton] = useState(false);
  const [placeOrderDialogOpen, setPlaceOrderDialogOpen] = useState(false);
  const [newCatAndSubFetched, setNewCatAndSubFetched] = useState(false);

  const TotalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0
  );

  const handlePreCreateOrder = () => {
    // QR code check
    if (
      activeQrCodeId === null ||
      activeQrCodeId === undefined ||
      activeQrCodeId === ""
    ) {
      navigate.push("/scan-qrcode-again");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      setPreOrderStatusButton(true);
      return;
    }

    // Scan cart items and collect updates (synchronous collection)
    let foundUpdates = false;
    for (const item of cartItems) {
      if (item.priceSchedule && item.price !== item.basePrice) {
        const actualPrice = getActualPrice(item.basePrice, item.priceSchedule);

        // If displayPrice differs from calculated actualPrice, register an update
        if (
          typeof item.displayPrice === "number" &&
          item.displayPrice !== actualPrice
        ) {
          // Add to updatedItems list (reducer should dedupe)
          dispatch(
            addToUpdateCartItems({
              _id: item._id,
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              oldPrice: item.displayPrice,
              newPrice: actualPrice,
              priceSchedule: item.priceSchedule,
            })
          );

          foundUpdates = true;
        }
      }
    }

    if (foundUpdates) {
      dispatch(setReduxPreOrderStatus(true));
      setPreOrderStatusButton(true);

      if (newCatAndSubFetched === false) {
        dispatch(getAllCategoriesWithSubcategories());
      }
      setNewCatAndSubFetched(true);
      setPlaceOrderDialogOpen(false);
      return; // güncelleme varsa dialog açılmasın
    } else {
      // No updates found -> clear pre-order status and open the place-order dialog
      dispatch(setReduxPreOrderStatus(false));
      setPreOrderStatusButton(false);
      setPlaceOrderDialogOpen(true);
    }
  };

  const handleCreateOrder = () => {
    if (orderNote.length > 200) {
      toast.error("Note cannot be longer than 200 characters.");
      return;
    }

    if (
      preOrderStatusButton === false &&
      updatedItems.length === 0 &&
      preOrderStatus === false
    ) {
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
    } else {
      toast.error(
        "Please fix the price issues in your cart before placing the order."
      );
    }
  };

  useEffect(() => {
    if (orderStatus === "succeeded") {
      dispatch(clearCart());
      setSheetStatus(false);
      setPlaceOrderDialogOpen(false);
      setOrderNote("");
    }
  }, [orderStatus, dispatch]);

  useEffect(() => {
    if (!updatedItems || updatedItems.length === 0) {
      setPreOrderStatusButton(false);
    }
  }, [updatedItems]);

  const handleClear = () => {
    dispatch(clearCart());
    setClearCartState(false);
  };

  return (
    <Sheet open={sheetStatus} onOpenChange={setSheetStatus}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 bg-red-500 text-white items-center justify-center rounded-full text-xs font-medium ">
              {cartItems.length}
            </span>
          )}

          <span className="sr-only">Sepet</span>
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
                                displayPrice: item.displayPrice,
                                price: item.price,
                                priceSchedule: item.priceSchedule,
                                basePrice: item.price,
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
                                displayPrice: item.displayPrice,
                                price: item.price,
                                priceSchedule: item.priceSchedule,
                                basePrice: item.price,
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

          <Button
            className="w-full "
            type="button"
            onClick={handlePreCreateOrder}
            disabled={
              orderStatus === "loading" || cartItems.length === 0 || !cartItems
            }
          >
            {orderStatus === "loading" ? "Sending..." : "Place Order"}
          </Button>

          <Dialog
            open={placeOrderDialogOpen}
            onOpenChange={(open) => {
              setPlaceOrderDialogOpen(open);
              if (!open) {
                setOrderNote("");
              }
            }}
          >
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
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setPlaceOrderDialogOpen(false);
                      setOrderNote("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={
                    orderStatus === "loading" ||
                    orderNote.length > 200 ||
                    preOrderStatusButton === true ||
                    preOrderStatus === true
                  }
                  onClick={handleCreateOrder}
                >
                  {orderStatus === "loading" ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={clearCartState} onOpenChange={setClearCartState}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                type="button"
                disabled={cartItems.length === 0 || !cartItems}
              >
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear the cart?.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button
                  variant="destructive"
                  type="button"
                  disabled={cartItems.length === 0 || !cartItems}
                  onClick={handleClear}
                >
                  Clear Cart
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <SheetClose asChild>
            <Button variant="outline" type="button">
              <FaTimes className="w-5 h-5" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
