"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Subcategory } from "@/types/SubCategoryTypes";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCart, removeFromCart, selectCartState } from "@/store/cartSlice";
import { getActualPrice } from "@/utils/SubcategoryUtils";
import { toast } from "sonner";
import { getAllCategoriesWithSubcategories } from "@/store/categorySlice";
import { GoDotFill } from "react-icons/go";

interface ProductModalProps {
  subcategory: Subcategory | null;
  onClose: () => void;
}

export function ProductModal({ subcategory, onClose }: ProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { items: cartItems } = useAppSelector(selectCartState);

  const getCartItem = (id: string) => cartItems.find((item) => item._id === id);
  const cartItem = subcategory ? getCartItem(subcategory._id) : undefined;

  useEffect(() => {
    if (subcategory) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [subcategory]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!subcategory) return null;

  const actualPrice = getActualPrice(
    subcategory.price,
    subcategory.priceSchedule
  );

  const displayed =
    typeof subcategory.displayPrice === "number" ? subcategory.displayPrice : 0;

  const handleAddToCart = (quantityToAdd = 1) => {
    if (displayed !== actualPrice) {
      toast.error(
        `Ürün Fiyatı Güncellendi: ${displayed} $ → ${actualPrice} $`,
        {
          duration: 5000,
        }
      );
      handleClose();
      dispatch(getAllCategoriesWithSubcategories());
    }

    toast.success("Sepete eklendi!", { position: "top-center" });

    dispatch(
      addToCart({
        _id: subcategory._id,
        name: subcategory.name,
        quantity: quantityToAdd,
        image: subcategory.image,
        price: actualPrice,
        displayPrice: actualPrice,
        priceSchedule: subcategory.priceSchedule,
      })
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[90vh]   overflow-hidden rounded-t-3xl bg-card shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="relative flex max-h-[90vh] flex-col">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Kapat</span>
          </Button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            {/* Image */}
            <div
              className="relative w-full bg-muted overflow-hidden 
                aspect-[4/3] sm:aspect-[16/10] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-t-3xl"
            >
              <Image
                src={subcategory.image || "/placeholder.svg"}
                alt={subcategory.name}
                className="h-full w-full object-cover lg:object-contain"
                fill
                sizes="(min-width: 640px) 20rem, (min-width: 768px) 30rem, 40rem"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center  flex-wrap gap-2 mb-1 ">
                    <h2 className=" first-letter:uppercase text-lg md:text-2xl font-bold text-card-foreground">
                      {subcategory.name}
                    </h2>
                    /
                    {subcategory?.displayPrice &&
                    subcategory.displayPrice > 0 ? (
                      <span className="text-2xl font-bold text-red-600">
                        {subcategory.displayPrice} $
                      </span>
                    ) : (
                      <span className=" text-lg md:text-xl font-bold text-green-600">
                        Ücretsiz
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {subcategory.description}
                  </p>

                  {subcategory.priceSchedule?.activeFrom &&
                    subcategory.priceSchedule?.activeTo && (
                      <div className="flex items-center gap-1 justify-start">
                        <span className="font-medium text-xs">
                          Ücretli Saatler:
                        </span>
                        <span
                          className={`${
                            displayed ? "text-green-500" : "text-red-500"
                          } text-xs  flex items-center gap-1`}
                        >
                          {`${subcategory.priceSchedule.activeFrom} - ${subcategory.priceSchedule.activeTo}`}{" "}
                          <GoDotFill />
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* {subcategory.description && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-card-foreground">
                    İçindekiler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

              {/* {product.calories && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Kalori:</span>{" "}
                    {product.calories} kcal
                  </p>
                </div>
              )} */}

              {/* Cart Controls */}
              {!cartItem ? (
                <Button
                  className="w-full text-xs sm:text-sm md:text-base font-semibold bg-indigo-500 hover:bg-indigo-400 transition text-white rounded-md"
                  onClick={() => handleAddToCart(1)}
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="flex justify-center items-center w-full gap-1">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-xs sm:text-sm md:text-base"
                      onClick={() => handleAddToCart(-1)}
                      disabled={cartItem.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </Button>
                    <span className="min-w-[32px] text-center font-semibold text-xs sm:text-sm md:text-base">
                      {cartItem.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-xs sm:text-sm md:text-base"
                      onClick={() => handleAddToCart(1)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs sm:text-sm md:text-base flex items-center gap-1 mt-1 px-2 py-1 rounded-md"
                    onClick={() => dispatch(removeFromCart(subcategory._id))}
                    aria-label="Remove from cart"
                  >
                    <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Remove</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
