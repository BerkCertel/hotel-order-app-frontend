"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getSubcategoriesByCategory,
  selectSubcategoryState,
} from "@/store/subcategorySlice";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/Containers/PageContainer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import MenuHeader from "@/components/menu/MenuHeader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart, selectCartState } from "@/store/cartSlice";

export default function SubcategoryPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { subcategories, loading, error } = useAppSelector(
    selectSubcategoryState
  );
  const { items: cartItems } = useAppSelector(selectCartState);

  useEffect(() => {
    if (typeof params?.id === "string") {
      dispatch(getSubcategoriesByCategory(params.id));
    }
  }, [dispatch, params?.id]);

  // Helper: get cart item by subcategory id
  const getCartItem = (id: string) => cartItems.find((item) => item._id === id);

  return (
    <PageContainer>
      <div className="w-full flex flex-col gap-5 mx-auto px-2 lg:px-0">
        <MenuHeader HeaderText="Subcategories" />
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          (!subcategories || subcategories.length === 0) && (
            <p className="text-center text-muted-foreground mb-6">
              No subcategories found for this category.
            </p>
          )}

        {/* Subcategory List */}
        {!loading && !error && subcategories && subcategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subcategories.map((subcategory) => {
              const cartItem = getCartItem(subcategory._id);

              return (
                <Card
                  key={subcategory._id}
                  className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <CardContent className="flex flex-col items-center gap-2 p-0">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <CardTitle className="text-sm font-semibold text-center mt-2 mb-1">
                      {subcategory.name}
                    </CardTitle>
                    <span className="text-xs text-gray-500 text-center mb-2">
                      {subcategory.description}
                    </span>

                    {/* Cart Controls */}
                    {!cartItem ? (
                      <Button
                        size="sm"
                        className="w-full mt-1"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              _id: subcategory._id,
                              name: subcategory.name,
                              quantity: 1,
                              image: subcategory.image,
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
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  _id: subcategory._id,
                                  name: subcategory.name,
                                  quantity: -1,
                                  image: subcategory.image,
                                })
                              )
                            }
                            disabled={cartItem.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </Button>
                          <span className="min-w-[32px] text-center font-semibold text-base">
                            {cartItem.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  _id: subcategory._id,
                                  name: subcategory.name,
                                  quantity: 1,
                                  image: subcategory.image,
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
                          variant="ghost"
                          className="text-red-500 flex items-center gap-1 mt-1"
                          onClick={() =>
                            dispatch(removeFromCart(subcategory._id))
                          }
                          aria-label="Remove from cart"
                        >
                          <FaTrash className="w-4 h-4" />
                          Remove from Cart
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
