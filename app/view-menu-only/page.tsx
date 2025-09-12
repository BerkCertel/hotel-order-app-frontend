"use client";

import { useState } from "react";
import { PageContainer } from "@/components/Containers/PageContainer";

import {
  getAllCategories,
  selectCategoryState,
  setSelectedCategoryId,
} from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NoQrCodeSelectedSubcategoryModal from "@/components/modals/NoQrCodeSelectedSubcategoryModal";
import ViewOnlyMenuHeader from "@/components/menu/ViewOnlyMenuHeader";

function ViewOnlyMenuPage() {
  const dispatch = useAppDispatch();
  const { loading, error, categories } = useAppSelector(selectCategoryState);

  // MODAL STATE
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  // Veri çekme
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Kategoriye tıklanınca modal açılır ve seçili id redux'a yazılır
  const handleCategoryClick = (catId: string) => {
    dispatch(setSelectedCategoryId(catId)); // Redux'a yaz
    setSubcategoryModalOpen(true); // Modalı aç
  };

  return (
    <PageContainer className="mx-auto container">
      <ViewOnlyMenuHeader HeaderText="Categories" />
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-lg" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && (!categories || categories.length === 0) && (
        <Alert className="mb-6">
          <AlertTitle>No Menu Found</AlertTitle>
          <AlertDescription>
            Currently, no menu has been added.
          </AlertDescription>
        </Alert>
      )}

      {/* Kategori listesi */}
      {!loading && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <Card
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {/* Alt içerik */}
              <CardContent className="flex flex-col justify-around items-center gap-1 ">
                <div className="w-full h-32 md:h-40 relative rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover w-full h-full"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardTitle className="text-sm md:text-base font-semibold text-center">
                  {category.name}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL BURADA */}
      <NoQrCodeSelectedSubcategoryModal
        open={subcategoryModalOpen}
        onClose={() => {
          setSubcategoryModalOpen(false);
          dispatch(setSelectedCategoryId(null)); // Modal kapanınca seçimi sil
        }}
      />
    </PageContainer>
  );
}

export default ViewOnlyMenuPage;
