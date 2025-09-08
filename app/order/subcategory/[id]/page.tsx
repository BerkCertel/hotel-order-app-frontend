"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getSubcategoriesByCategory,
  selectSubcategoryState,
} from "@/store/subcategorySlice";
import { useParams, useRouter } from "next/navigation";
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
  const navigate = useRouter();
  const { subcategories, loading, error } = useAppSelector(
    selectSubcategoryState
  );
  const { items: cartItems } = useAppSelector(selectCartState);

  // Subcategory çekimi
  useEffect(() => {
    if (typeof params?.id === "string" && params.id.length === 24) {
      dispatch(getSubcategoriesByCategory(params.id));
    }
  }, [dispatch, params?.id]);

  // Yönlendirmeler
  useEffect(() => {
    // id yoksa veya formatı yanlışsa yönlendir
    if (
      !params?.id ||
      typeof params.id !== "string" ||
      params.id.length !== 24
    ) {
      navigate.push("/scan-qrcode-again");
      return;
    }
    // Yükleme bitmeden yönlendirme yapma
    if (loading) return;

    // API'den error geldi, ve error 'No subcategories found.' değilse yönlendir
    if (error && error !== "No subcategories found.") {
      navigate.push("/scan-qrcode-again");
      return;
    }
    // subcategories.length === 0 durumunda yönlendirme yok!
  }, [params?.id, loading, error, navigate]);

  // Sepet helper
  const getCartItem = (id: string) => cartItems.find((item) => item._id === id);

  return (
    <PageContainer>
      <div className="w-full flex flex-col gap-5 mx-auto px-2 lg:px-0">
        <MenuHeader HeaderText="Subcategories" />

        {/* Loading state with skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && error && subcategories && subcategories.length === 0 && (
          <Alert className="mb-6">
            <AlertTitle>Alt kategori yok</AlertTitle>
            <AlertDescription className="text-xs">
              Bu kategoriye ait alt kategori bulunmamaktadır.
            </AlertDescription>
          </Alert>
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
