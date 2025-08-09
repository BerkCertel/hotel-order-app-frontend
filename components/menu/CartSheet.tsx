import React from "react";
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
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  selectCartState,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/store/cartSlice";

function CartSheet() {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector(selectCartState);
  const roomNumber = useSelector((state: RootState) => state.room.roomNumber);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative">
          <FaShoppingBasket className="w-6 h-6" />
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
          {roomNumber && (
            <div className="text-xs mb-2">
              Your room: <b>{roomNumber}</b>
            </div>
          )}

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center mt-10 text-muted-foreground">
              <FaBoxOpen className="w-12 h-12 mb-2 opacity-40" />
              <div className="font-medium text-base">Your cart is empty</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
                    <div className="font-semibold text-base truncate">
                      {item.name}
                    </div>
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
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => dispatch(removeFromCart(item._id))}
                    aria-label="Remove from cart"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <SheetFooter className="border-t p-4 flex justify-between">
          <SheetClose asChild>
            <Button variant="outline" type="button">
              <FaTimes className="w-5 h-5" />
            </Button>
          </SheetClose>
          <Button
            variant="destructive"
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
