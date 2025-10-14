"use client";
import { cn } from "@/lib/utils";
import {
  getAllCategoriesWithSubcategories,
  selectCategoryState,
} from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductModal } from "./ProductModal";
import { Subcategory } from "@/types/SubCategoryTypes";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";

function MenuProductList() {
  const [activeSubcategory, setActiveSubcategory] =
    useState<Subcategory | null>(null);
  const dispatch = useAppDispatch();
  const { loading, error, categoriesWithSubcategories } =
    useAppSelector(selectCategoryState);

  useEffect(() => {
    dispatch(getAllCategoriesWithSubcategories());
  }, [dispatch]);

  // 🔄 LOADING (Skeleton)
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-48 mb-4 rounded-md" />
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2 rounded-md" />
                    <Skeleton className="h-4 w-60 mb-2 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ⚠️ ERROR
  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] px-4">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertTitle>
            <FaExclamationTriangle className="h-5 w-5 inline-block mr-2" />
            An error occurred!
          </AlertTitle>
          <AlertDescription>
            Something went wrong while fetching data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 🫙 EMPTY (No data)
  if (
    !categoriesWithSubcategories ||
    categoriesWithSubcategories.length === 0
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <FaBoxOpen className="text-gray-400 w-14 h-14 mb-3" />
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="text-sm text-muted-foreground">
          There are currently no categories or products to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {categoriesWithSubcategories.map((category) => (
        <div id={category._id} key={category._id}>
          {/* Kategori adı (başlık olarak) */}
          <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          {/* Alt kategoriler (ürünler) */}
          <div className="flex flex-col gap-3">
            {category.subcategories.map((subcategory, index) => (
              <div
                key={subcategory.name}
                onClick={() => setActiveSubcategory(subcategory)}
                className={cn(
                  "group cursor-pointer flex items-center gap-4 rounded-lg border border-border/50 bg-card p-3 text-left transition-all duration-300",
                  "hover:shadow-md hover:border-primary/30 active:scale-[0.98]",
                  "animate-in fade-in slide-in-from-bottom-2"
                )}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-base first-letter:uppercase font-semibold leading-tight text-card-foreground mb-1">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2 break-words">
                    {subcategory.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {subcategory.price === 0 ? (
                      <span className="text-sm font-semibold text-green-600 ">
                        Ücretsiz
                      </span>
                    ) : subcategory.price ? (
                      <span className="text-base font-bold text-red-600 ">
                        {subcategory.price} $
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border rounded-md bg-muted sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <Image
                    src={subcategory.image || "/placeholder.svg"}
                    alt={subcategory.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <ProductModal
        subcategory={activeSubcategory}
        onClose={() => setActiveSubcategory(null)}
      />
    </div>
  );
}

export default MenuProductList;
