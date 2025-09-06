"use client";

import React, { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { FaBars, FaThList, FaTimes } from "react-icons/fa";
import {
  selectCategoryState,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import { getAllCategories } from "@/store/categorySlice";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Category } from "@/types/CategoryTypes";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";

function MenuSheet() {
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, categories } = useAppSelector(selectCategoryState);

  useEffect(() => {
    dispatch(getAllCategories());
    // eslint-disable-next-line
  }, []);

  const handleCategoryClick = (id: string) => {
    navigate.push(`/order/subcategory/${id}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-xs md:text-base">
          <FaBars className="w-6 h-6" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0">
        {/* HEADER */}
        <div className="relative flex items-center justify-center border-b h-16">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-accent-foreground">
            <FaThList className="w-6 h-6" />

            <SheetTitle>Menu</SheetTitle>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {loading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && categories && categories.length === 0 && (
            <p className="text-center text-muted-foreground">
              Hiç kategori bulunamadı.
            </p>
          )}

          {!loading && !error && categories && categories.length > 0 && (
            <div className="space-y-3">
              {categories.map((cate: Category) => (
                <div
                  onClick={() => handleCategoryClick(cate._id)}
                  key={cate._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition"
                >
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={cate.image}
                      alt={cate.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{cate.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER - Kapatma butonu sadece burada */}
        <SheetFooter className="border-t p-4 flex justify-end">
          <SheetClose asChild>
            <Button type="button">
              <FaTimes className="w-5 h-5" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MenuSheet;
