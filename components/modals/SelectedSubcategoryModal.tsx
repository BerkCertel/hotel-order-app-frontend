"use client";

import { addToCart, removeFromCart } from "@/store/cartSlice";
import {
  selectCartState,
  selectCategoryState,
  selectSubcategoryState,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import {
  clearSubcategories,
  getSubcategoriesByCategory,
} from "@/store/subcategorySlice";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { ScrollArea } from "../ui/scroll-area";

interface SelectedSubcategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const SelectedSubcategoryModal = ({
  open,
  onClose,
}: SelectedSubcategoryModalProps) => {
  const dispatch = useAppDispatch();
  const { selectedCategoryId, categories } =
    useAppSelector(selectCategoryState);
  const { subcategories, loading, error } = useAppSelector(
    selectSubcategoryState
  );
  const { items: cartItems } = useAppSelector(selectCartState);

  // Seçili kategori ismini bul
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  useEffect(() => {
    if (open && selectedCategoryId) {
      dispatch(getSubcategoriesByCategory(selectedCategoryId));
    }
    if (!open) {
      dispatch(clearSubcategories());
    }
  }, [open, selectedCategoryId, dispatch]);

  // Sepet helper
  const getCartItem = (id: string) => cartItems.find((item) => item._id === id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="w-full md:min-w-2xl lg:min-w-4xl ">
        <span className="text-center font-bold border-b uppercase  text-xl lg:text-2xl border-gray-400">
          {selectedCategory?.name}
        </span>

        {/* Loading state with skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <Alert className="mb-6">
            <AlertTitle className="text-xs">{error}</AlertTitle>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && subcategories.length === 0 && (
          <Alert className="mb-6">
            <AlertTitle>Alt kategori yok</AlertTitle>
            <AlertDescription>
              Bu kategoriye ait alt kategori bulunmamaktadır.
            </AlertDescription>
          </Alert>
        )}

        {/* Subcategory List */}
        {!loading && !error && subcategories.length > 0 && (
          <ScrollArea className="w-full h-[320px] md:h-[420px] lg:h-[520px] pr-3">
            <div className="grid grid-cols-2 gap-4">
              {subcategories.map((subcategory) => {
                const cartItem = getCartItem(subcategory._id);

                return (
                  <Card
                    key={subcategory._id}
                    className="p-2 w-full bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <CardContent className="flex flex-col items-center gap-2 p-0">
                      <div className="relative w-full h-24 lg:h-28 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={subcategory.image}
                          alt={subcategory.name}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                        />
                      </div>
                      <CardTitle className="w-full text-sm md:text-base lg:text-lg font-semibold text-center mt-1 mb-1 break-words line-clamp-1">
                        {subcategory.name}
                      </CardTitle>

                      {subcategory.price !== 0 && (
                        <span className="font-semibold bg-blue-400 px-2 rounded-md text-white">
                          {subcategory.price}$
                        </span>
                      )}

                      <span className="w-full text-[10px] text-gray-500 text-center mb-2 break-words line-clamp-2">
                        {subcategory.description}
                      </span>
                      {/* Cart Controls */}
                      {!cartItem ? (
                        <Button
                          size="sm"
                          className="w-full mt-1 text-[11px] sm:text-xs md:text-sm lg:text-base"
                          onClick={() =>
                            dispatch(
                              addToCart({
                                _id: subcategory._id,
                                name: subcategory.name,
                                quantity: 1,
                                image: subcategory.image,
                                price: subcategory.price,
                              })
                            )
                          }
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="flex flex-col items-center w-full gap-1">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-xs sm:text-sm md:text-base"
                              onClick={() =>
                                dispatch(
                                  addToCart({
                                    _id: subcategory._id,
                                    name: subcategory.name,
                                    quantity: -1,
                                    image: subcategory.image,
                                    price: subcategory.price,
                                  })
                                )
                              }
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
                              onClick={() =>
                                dispatch(
                                  addToCart({
                                    _id: subcategory._id,
                                    name: subcategory.name,
                                    quantity: 1,
                                    image: subcategory.image,
                                    price: subcategory.price,
                                  })
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              <FaPlus />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-[10px] sm:text-xs md:text-base flex items-center gap-1 mt-1 px-2 py-1 md:px-3 md:py-2 rounded-md"
                            onClick={() =>
                              dispatch(removeFromCart(subcategory._id))
                            }
                            aria-label="Remove from cart"
                          >
                            <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden md:inline">
                              Remove from Cart
                            </span>
                            <span className="md:hidden"> Remove from Cart</span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectedSubcategoryModal;
